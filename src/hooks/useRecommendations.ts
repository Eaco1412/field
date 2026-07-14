/**
 * useRecommendations：发现页推荐相关 hook。
 */

import { useCallback, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { recommendationService } from '../services';
import type {
  RecommendationItem,
  RecCategory,
} from '../services/types';
import { logger } from '../logger';

export function useRecommendations() {
  const { state, addPendingAction, completeAction } = useApp();
  const [category, setCategory] = useState<RecCategory>('action');

  const currentList = useMemo(
    () => recommendationService.listByCategory(category),
    [category],
  );

  const allItems = useMemo(
    () => recommendationService.listAll(),
    [],
  );

  /** 随机挑 count 个推荐项（首页"今天可以试试的小事"） */
  const pickRandom = useCallback(
    (count: number, exclude?: string[]): RecommendationItem[] => {
      return recommendationService.pickRandom(count, exclude);
    },
    [],
  );

  /** 标记"试试看" → 添加到进行中 */
  const tryItem = useCallback(
    (item: RecommendationItem) => {
      const existing = state.pendingActions.find((p) => p.itemId === item.id);
      if (existing) return;
      addPendingAction({
        itemId: item.id,
        title: item.title,
        source: 'discover',
        puzzleId: item.puzzleId,
        puzzlePieces: item.puzzlePieces ?? 1,
      });
      logger.info('[useRecommendations] try item', { id: item.id });
    },
    [addPendingAction, state.pendingActions],
  );

  /** 从发现页直接确认完成 */
  const completeItem = useCallback(
    (itemId: string) => {
      const pending = state.pendingActions.find((p) => p.itemId === itemId);
      if (pending) {
        completeAction(pending.id);
        return;
      }
      // 没有进行中的记录 → 直接创建一个并完成
      const item = allItems.find((i) => i.id === itemId);
      if (!item) return;
      // 走一遍完整流程
      const pa = addPendingAction({
        itemId: item.id,
        title: item.title,
        source: 'discover',
        puzzleId: item.puzzleId,
        puzzlePieces: item.puzzlePieces ?? 1,
      });
      completeAction(pa.id);
    },
    [state.pendingActions, allItems, addPendingAction, completeAction],
  );

  /** 判断某推荐项是否在进行中 */
  const isInProgress = useCallback(
    (itemId: string): boolean => {
      return state.pendingActions.some((p) => p.itemId === itemId);
    },
    [state.pendingActions],
  );

  /** 判断某推荐项是否已完成 */
  const isCompleted = useCallback(
    (itemId: string): boolean => {
      return state.completedItemIds?.includes(itemId) ?? false;
    },
    [state.completedItemIds],
  );

  /** 获取某项对应的进行中记录 id */
  const getPendingId = useCallback(
    (itemId: string): string | undefined => {
      return state.pendingActions.find((p) => p.itemId === itemId)?.id;
    },
    [state.pendingActions],
  );

  return {
    category,
    setCategory,
    currentList,
    allItems,
    pickRandom,
    tryItem,
    completeItem,
    isInProgress,
    isCompleted,
    getPendingId,
  };
}
