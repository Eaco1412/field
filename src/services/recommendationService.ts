/**
 * 推荐内容服务接口。
 * 发现页推荐库的查询 + 为日志挑选行动/内容卡片。
 */

import type { DistressTheme, RecCategory, RecommendationItem } from './types';

export interface RecommendationService {
  /** 按分类列出推荐项 */
  listByCategory(category: RecCategory): RecommendationItem[];
  /** 全部推荐项 */
  listAll(): RecommendationItem[];
  /** 按 id 获取 */
  getById(id: string): RecommendationItem | undefined;
  /** 根据困扰主题挑选合适的推荐项（用于行动卡关联与首页今日推荐） */
  pickForThemes(themes: DistressTheme[], count: number): RecommendationItem[];
  /** 随机挑选若干（首页"今天可以试试的小事"） */
  pickRandom(count: number, exclude?: string[]): RecommendationItem[];
}
