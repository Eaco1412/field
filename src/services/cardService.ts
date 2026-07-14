/**
 * 卡片反馈服务接口。
 * 处理支持卡片的生成、单张替换、整组替换、反馈标签映射。
 */

import type {
  CardFeedback,
  CardRecommendation,
  CardType,
  DistressTheme,
  RiskLevel,
  SupportCard,
} from './types';

export interface CardService {
  /** 根据主题与风险等级构建卡片推荐组合 */
  build(themes: DistressTheme[], riskLevel: RiskLevel): CardRecommendation;
  /** 单独替换某一张卡片（换一张） */
  replaceOne(
    current: CardRecommendation,
    type: CardType,
    themes: DistressTheme[],
  ): CardRecommendation;
  /** 整组替换（换一组） */
  replaceAll(
    themes: DistressTheme[],
  ): CardRecommendation;
  /** 反馈枚举 -> 中文标签 */
  feedbackLabel(fb: CardFeedback): string;
  /** 构造一张占位/通用卡片 */
  makeCard(type: CardType, content: string, sourceItemId?: string): SupportCard;
}
