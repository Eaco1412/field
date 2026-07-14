/**
 * useJournalBook：手账相关 hook（月度/年度汇总）。
 */

import { useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { JournalBookEntry } from '../services/types';

function formatMonth(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function useJournalBook() {
  const { state } = useApp();
  const { journals, puzzles, profile } = state;

  /** 当前月的手账数据 */
  const currentMonth = useMemo(() => {
    const now = new Date();
    return formatMonth(now);
  }, []);

  /** 获取指定月份的手账条目 */
  const getMonthEntry = useCallback(
    (month: string): JournalBookEntry => {
      const monthJournals = journals.filter((j) => j.date.startsWith(month));
      const moodCurve = monthJournals
        .filter((j) => typeof j.mood === 'number')
        .map((j) => ({ date: j.date, mood: j.mood as number }));

      const completedActions = monthJournals.filter((j) => j.actionCompleted).length;

      const unlockedPuzzles = puzzles.filter(
        (p) => p.isUnlocked,
      ).length;

      // 最有共鸣的卡片内容（取 resonate 反馈数最多的那张）
      const fbCounts: Record<string, { count: number; content: string }> = {};
      monthJournals.forEach((j) => {
        if (!j.cards || !j.cardFeedback) return;
        Object.entries(j.cardFeedback).forEach(([cardId, fb]) => {
          if (fb !== 'resonate') return;
          const allCards = [j.cards!.understanding, j.cards!.action, j.cards!.help];
          const card = allCards.find((c) => c.id === cardId);
          if (!card) return;
          if (!fbCounts[cardId]) {
            fbCounts[cardId] = { count: 0, content: card.content };
          }
          fbCounts[cardId].count += 1;
        });
      });
      const topCard = Object.values(fbCounts).sort((a, b) => b.count - a.count)[0]?.content ?? '暂无';

      const autoReview = `这个月，你写了 ${monthJournals.length} 次心事，完成了 ${completedActions} 个小行动。`;

      return {
        month,
        moodCurve,
        completedActions,
        unlockedPuzzles,
        topResonatedCard: topCard,
        autoReview,
      };
    },
    [journals, puzzles],
  );

  const currentMonthEntry = useMemo(
    () => getMonthEntry(currentMonth),
    [getMonthEntry, currentMonth],
  );

  const totalJournals = journals.length;
  const totalActions = profile.completedActions;

  return {
    currentMonth,
    currentMonthEntry,
    getMonthEntry,
    totalJournals,
    totalActions,
  };
}
