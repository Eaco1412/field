/**
 * AI 分析服务 Mock 实现。
 * 基于关键词匹配模拟大模型分析，生产阶段替换为 services/api/aiService。
 */

import type { AiService } from '../aiService';
import type { AnalysisResult, JournalMode } from '../types';
import type { AiModelId } from '../../config/ai';
import { buildAnalysisResult } from './mockData';

export const mockAiService: AiService = {
  analyze(content: string, mode: JournalMode, _model?: AiModelId): Promise<AnalysisResult> {
    // mock 忽略 model 参数，始终用本地关键词匹配
    return Promise.resolve(buildAnalysisResult(content, mode));
  },
};
