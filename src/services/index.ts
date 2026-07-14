/**
 * services 统一出口。
 * 上层通过此文件引入所有 service，切换 mock/api 时只需改此处。
 */

import type { AiService } from './aiService';
import type { CardService } from './cardService';
import { journalService } from './journalService';
import type { JournalService } from './journalService';
import type { RecommendationService } from './recommendationService';
import type { SafetyService } from './safetyService';
import { mockAiService } from './mock/mockAiService';
import { mockCardService } from './mock/mockCardService';
import { mockRecommendationService } from './mock/mockRecommendationService';
import { mockSafetyService } from './mock/mockSafetyService';
import { realAiService } from './api/realAiService';
import { AI_ENABLED } from '../config/ai';

/**
 * 当前使用的服务实现。
 * - aiService：配置了 DeepSeek key 时启用真实 AI（realAiService），否则回退 mock。
 *   realAiService 内部对危机关键词/quiet 模式/调用失败均有兜底，安全可用。
 * - 其余 service 仍用 mock。
 */
export const aiService: AiService = AI_ENABLED ? realAiService : mockAiService;
export const cardService: CardService = mockCardService;
export const safetyService: SafetyService = mockSafetyService;
export const recommendationService: RecommendationService = mockRecommendationService;
export { journalService };
export type { JournalService };

export * from './types';
