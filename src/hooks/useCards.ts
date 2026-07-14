/**
 * useCards：卡片操作相关 hook。
 */

import { useCallback } from 'react';
import { cardService } from '../services';
import type {
  CardType,
  CardFeedback,
  CardRecommendation,
  DistressTheme,
} from '../services/types';

export function useCards() {
  const feedbackLabel = useCallback((fb: CardFeedback): string => {
    return cardService.feedbackLabel(fb);
  }, []);

  const build = useCallback(
    (themes: DistressTheme[]): CardRecommendation => {
      return cardService.build(themes, 'normal');
    },
    [],
  );

  const replaceOne = useCallback(
    (
      current: CardRecommendation,
      type: CardType,
      themes: DistressTheme[],
    ): CardRecommendation => {
      return cardService.replaceOne(current, type, themes);
    },
    [],
  );

  const replaceAll = useCallback(
    (themes: DistressTheme[]): CardRecommendation => {
      return cardService.replaceAll(themes);
    },
    [],
  );

  return { feedbackLabel, build, replaceOne, replaceAll };
}
