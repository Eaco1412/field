/**
 * useAchievement：成就相关 hook。
 */

import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export function useAchievement() {
  const { state, unlockAchievement } = useApp();

  const achievements = state.achievements;

  const totalCount = achievements.length;
  const unlockedCount = useMemo(
    () => achievements.filter((a) => a.isUnlocked).length,
    [achievements],
  );

  const recentUnlocked = useMemo(
    () =>
      achievements
        .filter((a) => a.isUnlocked)
        .sort((a, b) => (b.unlockedAt ?? '').localeCompare(a.unlockedAt ?? ''))
        .slice(0, 5),
    [achievements],
  );

  return {
    achievements,
    totalCount,
    unlockedCount,
    recentUnlocked,
    unlockAchievement,
  };
}
