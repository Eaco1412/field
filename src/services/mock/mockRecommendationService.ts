/**
 * 推荐内容服务 Mock 实现。
 */

import type { RecommendationService } from '../recommendationService';
import type {
  DistressTheme,
  RecCategory,
  RecommendationItem,
} from '../types';
import { MOCK_RECOMMENDATIONS } from './mockData';

/** 主题 -> 倾向推荐的分类 / 拼图主题映射 */
const THEME_PUZZLE_MAP: Record<DistressTheme, string> = {
  academic: 'p1',
  selfDoubt: 'p3',
  interpersonal: 'p3',
  lifeConfusion: 'p5',
  academicAnxiety: 'p1',
};

/** 分类映射：每个分类对应自身 */
const CATEGORY_MAP: Record<RecCategory, RecCategory[]> = {
  action: ['action'],
  content: ['content'],
  habit: ['habit'],
  theme: ['theme'],
  music: ['music'],
  nature: ['nature'],
  creativity: ['creativity'],
  mindfulness: ['mindfulness'],
  reading: ['reading'],
  community: ['community'],
  body: ['body'],
  growth: ['growth'],
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const mockRecommendationService: RecommendationService = {
  listByCategory(category: RecCategory): RecommendationItem[] {
    const targetCategories = CATEGORY_MAP[category] || [category];
    const filtered = MOCK_RECOMMENDATIONS.filter((r) => targetCategories.includes(r.category));
    // 数据不足时复制填充，保证每个分类至少有 6 条
    if (filtered.length >= 6) return filtered;
    const result = [...filtered];
    let i = 0;
    while (result.length < 6 && filtered.length > 0) {
      const item = filtered[i % filtered.length];
      result.push({ ...item, id: `${item.id}_copy${Math.floor(i / filtered.length) + 1}` });
      i++;
    }
    return result;
  },
  listAll(): RecommendationItem[] {
    return MOCK_RECOMMENDATIONS;
  },
  getById(id: string): RecommendationItem | undefined {
    // 支持复制 id（如 act1_copy2）
    const baseId = id.replace(/_copy\d+$/, '');
    return MOCK_RECOMMENDATIONS.find((r) => r.id === baseId);
  },
  pickForThemes(themes: DistressTheme[], count: number): RecommendationItem[] {
    // 优先推荐与主题拼图关联的项，其次行动类
    const preferredPuzzleIds = new Set(themes.map((t) => THEME_PUZZLE_MAP[t]));
    const themed = MOCK_RECOMMENDATIONS.filter(
      (r) => r.puzzleId && preferredPuzzleIds.has(r.puzzleId),
    );
    const actions = MOCK_RECOMMENDATIONS.filter((r) => r.category === 'action');
    const pool = themed.length >= count ? themed : [...themed, ...actions];
    const seen = new Set<string>();
    const picked: RecommendationItem[] = [];
    for (const item of shuffle(pool)) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      picked.push(item);
      if (picked.length >= count) break;
    }
    return picked;
  },
  pickRandom(count: number, exclude: string[] = []): RecommendationItem[] {
    const pool = MOCK_RECOMMENDATIONS.filter((r) => !exclude.includes(r.id));
    return shuffle(pool).slice(0, count);
  },
};
