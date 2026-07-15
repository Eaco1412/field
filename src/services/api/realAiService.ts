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

const SYSTEM_PROMPT = `你是情绪陪伴者。输出纯JSON，无markdown标记。
字段：themes(数组，可选：academic/selfDoubt/interpersonal/lifeConfusion/academicAnxiety)，riskLevel(normal/elevated/crisis)，aiMood(1-5)，analysis(简短回应)，understanding(≤30字共情)，understandingDetail(100字左右回复)，action(小行动)，actionItemId(从用户消息中选)，help(求助引导)。
有自伤意图时riskLevel=crisis，其他字段为空。`;

function buildUserPrompt(content: string): string {
  return `用户心事：${content}
请输出JSON分析。actionItemId填空即可。`;
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

  const requestBody = {
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(content) },
    ],
    temperature: AI_CONFIG.temperature,
    max_tokens: 400,
    response_format: { type: 'json_object' },
  };

  logger.info('[realAiService] >>> 发送请求到代理', {
    proxyUrl: AI_CONFIG.proxyUrl,
    model,
    systemPromptLen: SYSTEM_PROMPT.length,
    userPromptLen: buildUserPrompt(content).length,
    requestBody: JSON.stringify(requestBody).slice(0, 500),
  });

  try {
    const res = await fetch(AI_CONFIG.proxyUrl, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    logger.info('[realAiService] <<< 代理返回 HTTP 状态', { status: res.status, statusText: res.statusText });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      logger.error('[realAiService] <<< 代理返回错误', { status: res.status, body: text.slice(0, 500) });
      throw new Error(`Proxy HTTP ${res.status}: ${text.slice(0, 200)}`);
    }

    const data = await res.json();

    // 打印完整的 DeepSeek 响应结构
    logger.info('[realAiService] <<< DeepSeek 完整响应', {
      model: data?.model,
      id: data?.id,
      hasChoices: !!data?.choices,
      choicesLen: data?.choices?.length,
      finishReason: data?.choices?.[0]?.finish_reason,
      usage: data?.usage,
    });

    const message = data?.choices?.[0]?.message?.content;
    logger.info('[realAiService] <<< message.content 详情', {
      type: typeof message,
      length: typeof message === 'string' ? message.length : 0,
      preview: typeof message === 'string' ? message.slice(0, 300) : String(message),
    });

    if (typeof message !== 'string') {
      logger.error('[realAiService] message.content 不是字符串！', { actualValue: JSON.stringify(data?.choices?.[0]).slice(0, 500) });
      throw new Error('模型返回结构异常');
    }
    return message;
  } finally {
    clearTimeout(timer);
  }
}

function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');
  cleaned = cleaned.replace(/^```\s*/i, '');
  return cleaned;
}

function tryParseJson(text: string): AiRawResponse | null {
  try {
    const cleaned = cleanJsonResponse(text);
    return JSON.parse(cleaned) as AiRawResponse;
  } catch {
    return null;
  }
}

export const realAiService: AiService = {
  async analyze(content: string, mode: JournalMode, model?: AiModelId): Promise<AnalysisResult> {
    if (CRISIS_KEYWORDS.some((kw) => content.includes(kw))) {
      logger.info('[realAiService] crisis keyword hit, skip model');
      return buildAnalysisResult(content, mode);
    }

    if (mode === 'quiet') {
      return buildAnalysisResult(content, mode);
    }

    if (!AI_ENABLED) {
      logger.warn('[realAiService] AI_ENABLED is false, fallback to mock');
      return buildAnalysisResult(content, mode);
    }

    logger.info('[realAiService] calling DeepSeek via proxy...', { proxyUrl: AI_CONFIG.proxyUrl });

    const selectedModel: AiModelId = model ?? 'deepseek-chat';
    try {
      const rawText = await callViaProxy(content, selectedModel);

      // 打印完整的原始返回（不截断，方便排查）
      logger.info('[realAiService] ===== DeepSeek 原始回复 START =====');
      logger.info('[realAiService] 原始回复长度', { length: rawText.length });
      logger.info('[realAiService] 原始回复全文', { raw: rawText });
      logger.info('[realAiService] ===== DeepSeek 原始回复 END =====');

      let parsed = tryParseJson(rawText);
      logger.info('[realAiService] 第一次 JSON 解析结果', { success: !!parsed });

      if (!parsed) {
        logger.warn('[realAiService] JSON 直接解析失败，尝试从文本中提取 JSON');
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          logger.info('[realAiService] 从文本中提取到 JSON 片段', { matched: jsonMatch[0].slice(0, 200) });
          parsed = tryParseJson(jsonMatch[0]);
          logger.info('[realAiService] 提取后 JSON 解析结果', { success: !!parsed });
        } else {
          logger.warn('[realAiService] 文本中没有找到 JSON 片段');
        }
      }

      if (!parsed) {
        logger.warn('[realAiService] 无法解析为 JSON，使用原始文本作为 understandingDetail');
        return {
          themes: [],
          riskLevel: 'normal',
          aiMood: 3,
          analysis: '谢谢你愿意分享。我在这里陪着你。',
          cards: {
            understanding: makeCard(
              'understanding',
              '理解卡',
              '谢谢你愿意分享。我在这里陪着你。',
              undefined,
              rawText.slice(0, 500),
            ),
            action: makeCard('action', '行动卡', '给自己一点时间，做一件让自己舒服的事', 'act2'),
            help: makeCard('help', '求助卡', '如果你需要，随时可以回来。'),
          },
        };
      }

      // 打印解析后的每个字段
      logger.info('[realAiService] 解析后的字段详情', {
        themes: parsed.themes,
        riskLevel: parsed.riskLevel,
        aiMood: parsed.aiMood,
        analysis: typeof parsed.analysis === 'string' ? parsed.analysis.slice(0, 100) : parsed.analysis,
        understanding: typeof parsed.understanding === 'string' ? parsed.understanding.slice(0, 100) : parsed.understanding,
        understandingDetail: typeof parsed.understandingDetail === 'string' ? `${parsed.understandingDetail.slice(0, 100)}... (总长${parsed.understandingDetail.length})` : parsed.understandingDetail,
        action: typeof parsed.action === 'string' ? parsed.action.slice(0, 100) : parsed.action,
        actionItemId: parsed.actionItemId,
        help: typeof parsed.help === 'string' ? parsed.help.slice(0, 100) : parsed.help,
      });

      const result = mapToAnalysisResult(parsed);
      logger.info('[realAiService] mapToAnalysisResult 结果', { success: !!result });

      if (!result) {
        logger.warn('[realAiService] mapToAnalysisResult 返回 null（字段不完整），使用 fallback');
        return {
          themes: [],
          riskLevel: 'normal',
          aiMood: 3,
          analysis: '谢谢你愿意分享。',
          cards: {
            understanding: makeCard(
              'understanding',
              '理解卡',
              parsed.understanding ? String(parsed.understanding).slice(0, 100) : '谢谢你愿意分享。',
              undefined,
              parsed.understandingDetail ? String(parsed.understandingDetail) : undefined,
            ),
            action: makeCard('action', '行动卡', parsed.action ? String(parsed.action) : '做一件让自己舒服的事', parsed.actionItemId ? String(parsed.actionItemId) : 'act2'),
            help: makeCard('help', '求助卡', parsed.help ? String(parsed.help) : '如果你需要，随时可以回来。'),
          },
        };
      }

      logger.info('[realAiService] ===== 最终分析结果 =====', {
        model: selectedModel,
        themes: result.themes,
        riskLevel: result.riskLevel,
        aiMood: result.aiMood,
        understandingContent: result.cards?.understanding?.content?.slice(0, 80),
        understandingDetailLen: result.cards?.understanding?.detail?.length ?? 0,
        understandingDetailPreview: result.cards?.understanding?.detail?.slice(0, 120),
        actionContent: result.cards?.action?.content?.slice(0, 80),
        helpContent: result.cards?.help?.content?.slice(0, 80),
      });

      return result;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error('[realAiService] ===== 请求失败 =====', { error: errMsg, model: selectedModel });
      return buildAnalysisResult(content, mode);
    }
  },
};
