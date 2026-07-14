/**
 * 全局应用状态 Context + Provider。
 * 使用 React Context + useReducer 管理：profile、settings、journals、achievements、
 * puzzles、pendingActions、recommendations。
 * 所有修改通过 dispatch，且每次变更自动持久化到 AsyncStorage。
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { logger } from '../logger';
import {
  MOCK_ACHIEVEMENTS,
  MOCK_JOURNALS,
  MOCK_PUZZLES,
  MOCK_RECOMMENDATIONS,
  DEFAULT_PROFILE,
  DEFAULT_SETTINGS,
} from '../services/mock/mockData';
import { journalService } from '../services/journalService';
import type {
  Achievement,
  AppDataState,
  CardFeedback,
  CardRecommendation,
  CardType,
  JournalEntry,
  JournalMode,
  PendingAction,
  Puzzle,
  UserProfile,
  UserSettings,
} from '../services/types';
import { loadAppState, saveAppState, clearAppState } from '../utils/storage';

// ==================== Action Types ====================

type Action =
  | { type: 'HYDRATE'; payload: AppDataState }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET' }
  // profile
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  // settings
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  // journal
  | { type: 'ADD_JOURNAL'; payload: JournalEntry }
  | { type: 'UPDATE_JOURNAL'; id: string; patch: Partial<JournalEntry> }
  | { type: 'SET_CARD_FEEDBACK'; journalId: string; cardId: string; feedback: CardFeedback }
  | { type: 'REPLACE_CARD'; journalId: string; cardType: CardType; card: CardRecommendation[CardType] }
  // pending actions
  | { type: 'ADD_PENDING_ACTION'; payload: PendingAction }
  | { type: 'REMOVE_PENDING_ACTION'; id: string }
  | { type: 'UPDATE_PENDING_ACTION'; id: string; patch: Partial<PendingAction> }
  | { type: 'ADD_COMPLETED_ITEM'; itemId: string }
  // puzzle
  | { type: 'ADD_PUZZLE_PIECES'; puzzleId: string; count: number }
  // achievement
  | { type: 'UNLOCK_ACHIEVEMENT'; id: string; at: string };

// ==================== Initial State ====================

const INITIAL_STATE: AppDataState = {
  profile: DEFAULT_PROFILE,
  settings: DEFAULT_SETTINGS,
  journals: MOCK_JOURNALS,
  achievements: MOCK_ACHIEVEMENTS,
  puzzles: MOCK_PUZZLES,
  pendingActions: [],
  recommendations: MOCK_RECOMMENDATIONS,
  completedItemIds: [],
  initialized: false,
};

// ==================== Reducer ====================

function reducer(state: AppDataState, action: Action): AppDataState {
  switch (action.type) {
    case 'HYDRATE':
      // 兼容旧版本持久化数据：补全新增字段
      return {
        ...action.payload,
        completedItemIds: action.payload.completedItemIds ?? [],
        settings: {
          ...DEFAULT_SETTINGS,
          ...action.payload.settings,
          // 旧版本没有 aiModel 字段时补默认值
          aiModel: action.payload.settings?.aiModel ?? DEFAULT_SETTINGS.aiModel,
        },
        initialized: true,
      };
    case 'RESET':
      return { ...INITIAL_STATE, initialized: true };
    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'ADD_JOURNAL':
      return { ...state, journals: [action.payload, ...state.journals] };
    case 'UPDATE_JOURNAL':
      return {
        ...state,
        journals: journalService.update(state.journals, action.id, action.patch),
      };
    case 'SET_CARD_FEEDBACK': {
      const entry = state.journals.find((j) => j.id === action.journalId);
      if (!entry) return state;
      const nextFb = { ...(entry.cardFeedback ?? {}), [action.cardId]: action.feedback };
      return {
        ...state,
        journals: journalService.update(state.journals, action.journalId, {
          cardFeedback: nextFb,
        }),
      };
    }
    case 'REPLACE_CARD': {
      const entry = state.journals.find((j) => j.id === action.journalId);
      if (!entry || !entry.cards) return state;
      const nextCards: CardRecommendation = {
        ...entry.cards,
        [action.cardType]: action.card,
      };
      return {
        ...state,
        journals: journalService.update(state.journals, action.journalId, {
          cards: nextCards,
        }),
      };
    }
    case 'ADD_PENDING_ACTION':
      return { ...state, pendingActions: [action.payload, ...state.pendingActions] };
    case 'REMOVE_PENDING_ACTION':
      return {
        ...state,
        pendingActions: state.pendingActions.filter((p) => p.id !== action.id),
      };
    case 'UPDATE_PENDING_ACTION':
      return {
        ...state,
        pendingActions: state.pendingActions.map((p) =>
          p.id === action.id ? { ...p, ...action.patch } : p,
        ),
      };
    case 'ADD_COMPLETED_ITEM':
      if (state.completedItemIds.includes(action.itemId)) return state;
      return {
        ...state,
        completedItemIds: [...state.completedItemIds, action.itemId],
      };
    case 'ADD_PUZZLE_PIECES': {
      const puzzles = state.puzzles.map((p): Puzzle => {
        if (p.id !== action.puzzleId) return p;
        const next = Math.min(p.totalPieces, p.completedPieces + action.count);
        return {
          ...p,
          completedPieces: next,
          isUnlocked: next >= p.totalPieces ? true : p.isUnlocked,
        };
      });
      return { ...state, puzzles };
    }
    case 'UNLOCK_ACHIEVEMENT': {
      const achievements = state.achievements.map((a): Achievement =>
        a.id === action.id && !a.isUnlocked
          ? { ...a, isUnlocked: true, unlockedAt: action.at }
          : a,
      );
      return { ...state, achievements };
    }
    default:
      return state;
  }
}

// ==================== Context Value ====================

interface AppContextValue {
  state: AppDataState;
  loading: boolean;
  // 便捷方法（内部调用 dispatch）
  addJournal(input: {
    content: string;
    mode: JournalMode;
    mood?: number;
    userTags: string[];
    aiThemes: JournalEntry['aiThemes'];
    riskLevel: JournalEntry['riskLevel'];
    analysis?: string;
    cards?: JournalEntry['cards'];
  }): JournalEntry;
  updateJournal(id: string, patch: Partial<JournalEntry>): void;
  setCardFeedback(journalId: string, cardId: string, feedback: CardFeedback): void;
  replaceCard(journalId: string, cardType: CardType, card: CardRecommendation[CardType]): void;
  addPendingAction(action: Omit<PendingAction, 'id' | 'startedAt'>): PendingAction;
  removePendingAction(id: string): void;
  updateSettings(patch: Partial<UserSettings>): void;
  updateProfile(patch: Partial<UserProfile>): void;
  addPuzzlePieces(puzzleId: string, count: number): void;
  unlockAchievement(id: string): void;
  completeAction(pendingActionId: string): void;
  resetAll(): Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

// ==================== Provider ====================

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const firstLoadRef = useRef(true);

  // 首次加载：从 AsyncStorage 读取，没有则用 mock 初始数据
  useEffect(() => {
    let cancelled = false;
    async function init() {
      const saved = await loadAppState();
      if (cancelled) return;
      if (saved) {
        dispatch({ type: 'HYDRATE', payload: saved });
      } else {
        // 首次启动：写入 mock 初始数据
        await saveAppState(INITIAL_STATE);
        dispatch({ type: 'HYDRATE', payload: INITIAL_STATE });
      }
      setLoading(false);
    }
    init().catch((err) => {
      logger.error('[AppProvider] init failed', err);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // 状态变更时持久化（跳过首次加载）
  useEffect(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      return;
    }
    if (!state.initialized) return;
    saveAppState(state).catch((err) => {
      logger.error('[AppProvider] persist failed', err);
    });
  }, [state]);

  // ============ 便捷方法 ============

  const addJournal = useCallback<AppContextValue['addJournal']>((input) => {
    const entry = journalService.create(input);
    dispatch({ type: 'ADD_JOURNAL', payload: entry });
    // 首次写日志成就
    const first = state.journals.length === 0;
    if (first) {
      dispatch({
        type: 'UNLOCK_ACHIEVEMENT',
        id: state.achievements.find((a) => a.type === 'firstJournal')?.id ?? 'a1',
        at: new Date().toISOString(),
      });
    }
    // streak 简易更新
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: { streakDays: state.profile.streakDays + 1 },
    });
    return entry;
  }, [state.journals.length, state.achievements, state.profile.streakDays]);

  const updateJournal = useCallback<AppContextValue['updateJournal']>((id, patch) => {
    dispatch({ type: 'UPDATE_JOURNAL', id, patch });
  }, []);

  const setCardFeedback = useCallback<AppContextValue['setCardFeedback']>(
    (journalId, cardId, feedback) => {
      dispatch({ type: 'SET_CARD_FEEDBACK', journalId, cardId, feedback });
    },
    [],
  );

  const replaceCard = useCallback<AppContextValue['replaceCard']>(
    (journalId, cardType, card) => {
      dispatch({ type: 'REPLACE_CARD', journalId, cardType, card });
    },
    [],
  );

  const addPendingAction = useCallback<AppContextValue['addPendingAction']>((action) => {
    const pending: PendingAction = {
      id: `pa-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      startedAt: new Date().toISOString(),
      ...action,
    };
    dispatch({ type: 'ADD_PENDING_ACTION', payload: pending });
    return pending;
  }, []);

  const removePendingAction = useCallback<AppContextValue['removePendingAction']>((id) => {
    dispatch({ type: 'REMOVE_PENDING_ACTION', id });
  }, []);

  const updateSettings = useCallback<AppContextValue['updateSettings']>((patch) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: patch });
  }, []);

  const updateProfile = useCallback<AppContextValue['updateProfile']>((patch) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: patch });
  }, []);

  const addPuzzlePieces = useCallback<AppContextValue['addPuzzlePieces']>((puzzleId, count) => {
    dispatch({ type: 'ADD_PUZZLE_PIECES', puzzleId, count });
    // 检查是否有拼图刚完成，解锁对应成就
    const puzzle = state.puzzles.find((p) => p.id === puzzleId);
    if (puzzle) {
      const next = Math.min(puzzle.totalPieces, puzzle.completedPieces + count);
      if (next >= puzzle.totalPieces && !puzzle.isUnlocked) {
        const ach = state.achievements.find((a) => a.type === 'puzzleComplete');
        if (ach && !ach.isUnlocked) {
          dispatch({
            type: 'UNLOCK_ACHIEVEMENT',
            id: ach.id,
            at: new Date().toISOString(),
          });
        }
      }
    }
  }, [state.puzzles, state.achievements]);

  const unlockAchievement = useCallback<AppContextValue['unlockAchievement']>((id) => {
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', id, at: new Date().toISOString() });
  }, []);

  const completeAction = useCallback<AppContextValue['completeAction']>((pendingActionId) => {
    const pending = state.pendingActions.find((p) => p.id === pendingActionId);
    if (!pending) return;
    // 增加积分
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: {
        points: state.profile.points + 1,
        completedActions: state.profile.completedActions + 1,
      },
    });
    // 第一个行动成就
    const firstActAch = state.achievements.find((a) => a.type === 'firstAction');
    if (firstActAch && !firstActAch.isUnlocked) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', id: firstActAch.id, at: new Date().toISOString() });
    }
    // 拼图碎片
    if (pending.puzzleId && pending.puzzlePieces) {
      dispatch({
        type: 'ADD_PUZZLE_PIECES',
        puzzleId: pending.puzzleId,
        count: pending.puzzlePieces,
      });
    }
    // 标记日志中的 actionCompleted
    if (pending.journalId) {
      dispatch({
        type: 'UPDATE_JOURNAL',
        id: pending.journalId,
        patch: { actionCompleted: true },
      });
    }
    // 记录已完成的推荐项 id
    dispatch({ type: 'ADD_COMPLETED_ITEM', itemId: pending.itemId });
    // 移除待完成
    dispatch({ type: 'REMOVE_PENDING_ACTION', id: pendingActionId });
  }, [state.pendingActions, state.profile, state.achievements]);

  const resetAll = useCallback(async () => {
    await clearAppState();
    await saveAppState(INITIAL_STATE);
    dispatch({ type: 'RESET' });
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      loading,
      addJournal,
      updateJournal,
      setCardFeedback,
      replaceCard,
      addPendingAction,
      removePendingAction,
      updateSettings,
      updateProfile,
      addPuzzlePieces,
      unlockAchievement,
      completeAction,
      resetAll,
    }),
    [
      state,
      loading,
      addJournal,
      updateJournal,
      setCardFeedback,
      replaceCard,
      addPendingAction,
      removePendingAction,
      updateSettings,
      updateProfile,
      addPuzzlePieces,
      unlockAchievement,
      completeAction,
      resetAll,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/** 使用全局状态的 hook */
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
