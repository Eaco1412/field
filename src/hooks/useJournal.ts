/**
 * useJournal：日志相关 hook。
 * 封装日志的增删改查、卡片反馈、回访状态等。
 */

import { useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { CardFeedback, JournalEntry, JournalMode } from '../services/types';
import { aiService, cardService } from '../services';
import { logger } from '../logger';

export function useJournal() {
  const {
    state,
    addJournal,
    setCardFeedback,
    replaceCard,
    addPendingAction,
    addRecommendation,
  } = useApp();

  const journals = state.journals;

  /** 写入一条新心事（调用 AI 分析 + 创建日志 + 可选添加待完成行动）。异步：AI 分析可能耗时数秒。 */
  const submitJournal = useCallback(
    async (input: {
      content: string;
      mode: JournalMode;
      mood?: number;
      userTags: string[];
    }): Promise<JournalEntry> => {
      const analysis = await aiService.analyze(input.content, input.mode, state.settings.aiModel);
      logger.info('[useJournal] submit journal', {
        mode: input.mode,
        themes: analysis.themes,
        riskLevel: analysis.riskLevel,
      });

      const entry = addJournal({
        content: input.content,
        mode: input.mode,
        mood: input.mood,
        userTags: input.userTags,
        aiThemes: analysis.themes,
        riskLevel: analysis.riskLevel,
        analysis: analysis.analysis,
        cards: analysis.cards,
      });

      // 完整模式 + 有行动卡 + 推荐开启 → 添加到待完成行动（用于回访）
      if (
        input.mode === 'full' &&
        analysis.cards?.action?.content &&
        analysis.riskLevel !== 'crisis' &&
        state.settings.actionRecommendationEnabled
      ) {
        const actionCard = analysis.cards.action;
        const recItem = actionCard.sourceItemId
          ? state.recommendations.find((r) => r.id === actionCard.sourceItemId)
          : undefined;
        addPendingAction({
          itemId: actionCard.sourceItemId ?? entry.id,
          title: recItem?.title ?? actionCard.content.slice(0, 12),
          source: 'journal',
          journalId: entry.id,
          puzzleId: recItem?.puzzleId,
          puzzlePieces: recItem?.puzzlePieces ?? 1,
        });

        if (analysis.actionDetail && actionCard.content) {
          addRecommendation({
            title: actionCard.content,
            description: analysis.actionDetail.description || actionCard.content,
            category: 'action',
            tags: ['AI推荐', '个性化'],
            puzzlePieces: 1,
            detail: {
              source: 'AI推荐',
              highlights: analysis.actionDetail.highlights,
              reason: analysis.actionDetail.reason,
              howToStart: analysis.actionDetail.howToStart,
            },
          });
        }
      }

      return entry;
    },
    [addJournal, addPendingAction, addRecommendation, state.settings.actionRecommendationEnabled, state.recommendations],
  );

  const getByDate = useCallback(
    (date: string) => {
      return journals.filter((j) => j.date === date);
    },
    [journals],
  );

  const getById = useCallback(
    (id: string) => {
      return journals.find((j) => j.id === id);
    },
    [journals],
  );

  const recordedDates = useMemo(() => {
    const set = new Set(journals.map((j) => j.date));
    return Array.from(set).sort();
  }, [journals]);

  const feedbackCard = useCallback(
    (journalId: string, cardId: string, feedback: CardFeedback) => {
      setCardFeedback(journalId, cardId, feedback);
      logger.info('[useJournal] card feedback', { journalId, cardId, feedback });
    },
    [setCardFeedback],
  );

  /** 换一张卡片 */
  const replaceOneCard = useCallback(
    (journalId: string, type: 'understanding' | 'action' | 'help') => {
      const entry = journals.find((j) => j.id === journalId);
      if (!entry || !entry.cards) return;
      const newCard = cardService.replaceOne(entry.cards, type, entry.aiThemes);
      replaceCard(journalId, type, newCard[type]);
      logger.info('[useJournal] replace card', { journalId, type });
    },
    [journals, replaceCard],
  );

  /** 换一组卡片 */
  const replaceAllCards = useCallback(
    (journalId: string) => {
      const entry = journals.find((j) => j.id === journalId);
      if (!entry || !entry.cards) return;
      const newSet = cardService.replaceAll(entry.aiThemes);
      // 分别替换三张
      replaceCard(journalId, 'understanding', newSet.understanding);
      replaceCard(journalId, 'action', newSet.action);
      replaceCard(journalId, 'help', newSet.help);
    },
    [journals, replaceCard],
  );

  /** 今日最新一条日志（如果有） */
  const todayJournal = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayEntries = journals.filter((j) => j.date === today);
    if (todayEntries.length === 0) return undefined;
    return todayEntries.sort((a, b) => b.time.localeCompare(a.time))[0];
  }, [journals]);

  /** 待回访的行动（首页顶部展示） */
  const pendingRevisit = useMemo(() => {
    if (!state.settings.revisitEnabled) return null;
    // 取第一个 pendingAction
    return state.pendingActions[0] ?? null;
  }, [state.pendingActions, state.settings.revisitEnabled]);

  return {
    journals,
    recordedDates,
    todayJournal,
    pendingRevisit,
    submitJournal,
    getByDate,
    getById,
    feedbackCard,
    replaceOneCard,
    replaceAllCards,
  };
}
