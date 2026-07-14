/**
 * AI 分析服务接口。
 * 异步：真实实现需调用大模型（DeepSeek），mock 实现也返回 Promise 以保持调用方一致。
 */

import type { AnalysisResult, JournalMode } from './types';
import type { AiModelId } from '../config/ai';

export interface AiService {
  /**
   * 分析用户输入的心事内容。
   * @param content 用户原文（仅当条，不含历史）
   * @param mode 日志模式：full=完整分析推荐，quiet=仅记录不推卡
   * @param model 用户选择的 AI 模型
   * @returns 分析结果（主题、风险等级、AI心情、理解回复、卡片组合）
   */
  analyze(content: string, mode: JournalMode, model?: AiModelId): Promise<AnalysisResult>;
}
