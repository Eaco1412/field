/**
 * 安全兜底服务 Mock 实现。
 */

import type { SafetyService } from '../safetyService';
import type { CrisisInfo } from '../types';
import { CRISIS_INFO, CRISIS_KEYWORDS } from './mockData';

export const mockSafetyService: SafetyService = {
  isCrisis(content: string): boolean {
    return CRISIS_KEYWORDS.some((kw) => content.includes(kw));
  },
  checkCrisis(content: string): CrisisInfo | null {
    if (this.isCrisis(content)) {
      return CRISIS_INFO;
    }
    return null;
  },
};
