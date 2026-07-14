/**
 * AI 服务配置。
 *
 * API Key 安全策略：
 *   Key 不存放在 App 内，而是部署在 Vercel Serverless Function 代理（api/ai-proxy.ts）里。
 *   App 只需要知道 Vercel 的 URL，所有请求经代理转发给 DeepSeek，Key 永不暴露。
 *
 * Vercel 部署步骤：
 *   1. 推送代码到 GitHub/GitLab
 *   2. 在 Vercel Dashboard 导入项目，自动部署
 *   3. 在 Vercel → Settings → Environment Variables 添加 DEEPSEEK_API_KEY
 *   4. 部署成功后获得 URL（格式：https://your-project.vercel.app/api/ai-proxy）
 *   5. 把 URL 填到下面的 proxyUrl 引号里
 *   6. 在 App 设置页选择要用的 DeepSeek 模型
 *
 * 当 proxyUrl 为空时，aiService 自动回退到本地关键词匹配（mockAiService），
 * App 仍可正常运行，只是不会有真正的 AI 分析。
 */

/** 可选的 DeepSeek 模型列表。 */
export const AI_MODELS = [
  { id: 'deepseek-v4-flash', label: 'DeepSeek V4 Flash', desc: '速度快、便宜，日常情绪分析足够' },
  { id: 'deepseek-v4-pro', label: 'DeepSeek V4 Pro', desc: '推理更深，适合复杂情绪，但更慢更贵' },
] as const;

export type AiModelId = (typeof AI_MODELS)[number]['id'];

export const AI_CONFIG = {
  /**
   * Vercel 代理地址。部署到 Vercel 后填入（如 https://your-project.vercel.app/api/ai-proxy）。
   * 留空则禁用真实 AI，回退到本地关键词匹配。
   */
  proxyUrl: 'https://field-pink.vercel.app/api/ai-proxy', // 部署到 Vercel 后填入（格式：https://your-project.vercel.app/api/ai-proxy）
  /** 单次请求超时（毫秒）。超时后回退到本地 mock。 */
  timeoutMs: 30000,
  /** 采样温度。低温度保证输出稳定。 */
  temperature: 0.7,
} as const;

/** 是否启用了真实 AI（proxyUrl 非空即启用）。 */
export const AI_ENABLED: boolean = AI_CONFIG.proxyUrl.trim().length > 0;
