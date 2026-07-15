/**
 * AI 分析服务真实实现（通过 Cloudflare Worker 代理调 DeepSeek）。
 *
 * 设计要点：
 *  1. API Key 不在 App 内：所有请求经 Worker 代理转发，Key 永不暴露。
 *  2. 本地危机闸：先用关键词检测自伤/自杀信号，命中即走危机流程，绝不调用模型。
 *  3. quiet 模式：不发请求、不做 AI 分析，尊重用户意图并省成本。
 *  4. 仅传当条日志：messages 里只有当前这一条心事原文，绝不附带历史。
 *  5. 行动卡 grounding：模型只能从现有推荐库挑 actionItemId，保住闭环。
 *  6. 兜底：网络/超时/JSON 解析失败 → 静默回退到本地关键词匹配。
 */

import type { AiService } from '../aiService';
import type {
  AnalysisResult,
  DistressTheme,
  JournalMode,
  RiskLevel,
  SupportCard,
} from '../types';
import type { AiModelId } from '../../config/ai';
import { AI_CONFIG, AI_ENABLED } from '../../config/ai';
import { logger } from '../../logger';
import {
  CRISIS_INFO,
  CRISIS_KEYWORDS,
  MOCK_RECOMMENDATIONS,
  buildAnalysisResult,
} from '../mock/mockData';

/** 允许模型选择的行动卡推荐项（取 action 分类，作为 grounding 清单）。 */
const ACTION_ITEMS = MOCK_RECOMMENDATIONS.filter((r) => r.category === 'action').map(
  (r) => ({ id: r.id, title: r.title, description: r.description }),
);

const ALLOWED_THEME_SET: ReadonlySet<DistressTheme> = new Set([
  'academic',
  'selfDoubt',
  'interpersonal',
  'lifeConfusion',
  'academicAnxiety',
]);

const ALLOWED_RISK_SET: ReadonlySet<RiskLevel> = new Set([
  'normal',
  'elevated',
  'crisis',
]);

/** 模型返回的原始结构。 */
interface AiRawResponse {
  themes?: unknown;
  riskLevel?: unknown;
  aiMood?: unknown;
  analysis?: unknown;
  understanding?: unknown;
  understandingDetail?: unknown;
  action?: unknown;
  actionItemId?: unknown;
  help?: unknown;
}

const SYSTEM_PROMPT = `你是"旷野笔记"App 里的情绪陪伴者。你在阅读用户写下的一段心事，并产出结构化分析。

【人设与语气】
- 你像一个温柔的同行者，不是心理医生，绝不下诊断、不用临床术语（如"抑郁""焦虑症""治疗""病人"）。
- 语气平实温暖，像同龄朋友。简短，每段不超过 2-3 句。
- 用中文，称呼"你"。
- 不说"你应该""你必须"，用"也许""试试看""可以"。
- 不比较痛苦、不否定感受（不说"这没什么""别人更惨""别多想"）。

【安全规则——最高优先级】
- 如果用户表达自伤、自杀、不想活、结束生命等意图，riskLevel 必须为 "crisis"：此时 understanding / action / help 三个字段都填空字符串，actionItemId 填空字符串，analysis 写一句温柔的关切（如"我看到你现在很痛苦，你不是一个人"）。不要给任何行动建议。
- riskLevel="elevated"：强烈的自我否定、被霸凌/孤立、持续低落，但未到危机。
- riskLevel="normal"：一般困扰、平淡、轻微情绪波动。

【themes 取值】从这些里选零到多个：academic（学业/考试/成绩）、selfDoubt（自我否定/觉得自己不够好）、interpersonal（人际/被孤立/被欺负）、lifeConfusion（迷茫/无意义/空虚）、academicAnxiety（焦虑/紧张/压力）。都不命中则返回空数组。

【aiMood】1-5 整数：1=很差（危机/极度低落），2=不好，3=一般，4=不错，5=很好。

【卡片内容要求】
- understanding：一句话共情，简短有力，不超过30字，放在卡片上展示。必填。
- understandingDetail：详细的共情回复，300字左右，分3-4段，用"\n\n"分隔段落。先共情让用户感到被听见，再温和地给出一个新的视角或小小的鼓励。不要急着给建议，不要说教。必填。
- action：一个具体、微小、今天就能做的小行动，不要宏大目标。同时从给定行动清单里选最贴近的 actionItemId。必填。
- help：温柔的求助引导，不施压。必填。

【输出格式】只输出一个 JSON 对象，不要任何额外文字、不要 markdown 代码块。结构：
{"themes":["..."],"riskLevel":"...","aiMood":N,"analysis":"...","understanding":"...","understandingDetail":"...","action":"...","actionItemId":"...","help":"..."}`;

function buildUserPrompt(content: string): string {
  const itemList = ACTION_ITEMS.map(
    (i) => `- ${i.id} | ${i.title} | ${i.description}`,
  ).join('\n');
  return `用户心事原文：
"""
${content}
"""

可选的行动清单（actionItemId 只能从中选一个，选最贴近用户当前状态的；若都不贴近可填空字符串）：
${itemList}

请按系统提示的 JSON 格式输出分析结果。`;
}

function asString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function asThemes(v: unknown): DistressTheme[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((t): t is DistressTheme => typeof t === 'string' && ALLOWED_THEME_SET.has(t as DistressTheme));
}

function asRisk(v: unknown): RiskLevel {
  return typeof v === 'string' && ALLOWED_RISK_SET.has(v as RiskLevel)
    ? (v as RiskLevel)
    : 'normal';
}

function asMood(v: unknown): number {
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) return 3;
  return Math.max(1, Math.min(5, Math.round(n)));
}

/** 把模型返回映射成 AnalysisResult，并保证 actionItemId 落在白名单内。 */
function mapToAnalysisResult(raw: AiRawResponse): AnalysisResult | null {
  const riskLevel = asRisk(raw.riskLevel);
  const themes = asThemes(raw.themes);
  const aiMood = asMood(raw.aiMood);
  const analysis = asString(raw.analysis);
  const understanding = asString(raw.understanding);
  let understandingDetail = asString(raw.understandingDetail);
  if (!understandingDetail && analysis && analysis.length > 50) {
    understandingDetail = analysis;
  }
  const actionText = asString(raw.action);
  const help = asString(raw.help);
  let actionItemId = asString(raw.actionItemId);
  if (actionItemId && !ACTION_ITEMS.some((i) => i.id === actionItemId)) {
    actionItemId = '';
  }

  if (riskLevel === 'crisis') {
    return {
      themes,
      riskLevel,
      aiMood,
      analysis: analysis || CRISIS_INFO.message,
      cards: {
        understanding: makeCard('understanding', '', ''),
        action: makeCard('action', '', ''),
        help: makeCard('help', '', ''),
        crisisInfo: CRISIS_INFO,
      },
    };
  }

  if (!understanding || !actionText || !help) {
    return null;
  }

  if (!actionItemId) {
    actionItemId = 'act2';
  }

  return {
    themes,
    riskLevel,
    aiMood,
    analysis,
    cards: {
        understanding: makeCard('understanding', '理解卡', understanding, undefined, understandingDetail),
        action: makeCard('action', '行动卡', actionText, actionItemId),
        help: makeCard('help', '求助卡', help),
      },
  };
}

function makeCard(
  type: SupportCard['type'],
  title: string,
  content: string,
  sourceItemId?: string,
  detail?: string,
): SupportCard {
  const stamp = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  return {
    id: `${type[0]}-${stamp}`,
    type,
    title,
    content,
    sourceItemId,
    detail,
  };
}

/** 通过 Worker 代理调用 DeepSeek，返回模型输出中的 content 字段。 */
async function callViaProxy(content: string, model: AiModelId): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_CONFIG.timeoutMs);
  try {
    const res = await fetch(AI_CONFIG.proxyUrl, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(content) },
        ],
        temperature: AI_CONFIG.temperature,
        response_format: { type: 'json_object' },
        max_tokens: 1200,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Proxy HTTP ${res.status}: ${text.slice(0, 200)}`);
    }
    const data = await res.json();
    // Worker 透传 DeepSeek 的响应结构
    const message = data?.choices?.[0]?.message?.content;
    if (typeof message !== 'string') {
      throw new Error('模型返回结构异常');
    }
    return message;
  } finally {
    clearTimeout(timer);
  }
}

export const realAiService: AiService = {
  async analyze(content: string, mode: JournalMode, model?: AiModelId): Promise<AnalysisResult> {
    // 1) 本地危机闸：命中即走危机流程，不调用模型
    if (CRISIS_KEYWORDS.some((kw) => content.includes(kw))) {
      logger.info('[realAiService] crisis keyword hit, skip model');
      return buildAnalysisResult(content, mode);
    }

    // 2) quiet 模式：用户选择只记录，不做 AI 分析
    if (mode === 'quiet') {
      return buildAnalysisResult(content, mode);
    }

    // 3) 未配置代理：回退本地
    if (!AI_ENABLED) {
      return buildAnalysisResult(content, mode);
    }

    // 4) 通过代理调用 DeepSeek（仅传当条日志，不含历史）
    const selectedModel: AiModelId = model ?? 'deepseek-chat';
    try {
      const rawText = await callViaProxy(content, selectedModel);
      logger.debug('[realAiService] raw response', { raw: rawText.slice(0, 600) });
      const parsed = JSON.parse(rawText) as AiRawResponse;
      logger.debug('[realAiService] parsed fields', {
        hasUnderstanding: !!parsed.understanding,
        hasUnderstandingDetail: !!parsed.understandingDetail,
        understandingLen: String(parsed.understanding).length,
        detailLen: String(parsed.understandingDetail).length,
      });
      const result = mapToAnalysisResult(parsed);
      if (!result) {
        logger.warn('[realAiService] model output incomplete, fallback to mock');
        return buildAnalysisResult(content, mode);
      }
      logger.info('[realAiService] analyze ok', {
        model: selectedModel,
        themes: result.themes,
        riskLevel: result.riskLevel,
        hasDetail: !!result.cards?.understanding?.detail,
        detailLen: result.cards?.understanding?.detail?.length ?? 0,
        understanding: result.cards?.understanding?.content?.slice(0, 60),
        detailPreview: result.cards?.understanding?.detail?.slice(0, 80),
      });
      return result;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.debug('[realAiService] analyze failed, fallback to mock', { error: errMsg });
      return buildAnalysisResult(content, mode);
    }
  },
};
