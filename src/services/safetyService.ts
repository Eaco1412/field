/**
 * 安全兜底服务接口。
 * 负责高危表达识别与危机响应信息生成。
 * 安全第一：crisis 命中时 UI 立即展示安全提示+热线，不展示任何行动推荐。
 */

import type { CrisisInfo } from './types';

export interface SafetyService {
  /** 是否命中危机关键词 */
  isCrisis(content: string): boolean;
  /** 若命中危机，返回响应信息；否则返回 null */
  checkCrisis(content: string): CrisisInfo | null;
}
