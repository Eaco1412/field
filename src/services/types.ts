/**
 * 全局业务类型定义。
 * 所有 services / hooks / 组件统一引用此处类型，禁止使用 any。
 */

/** 困扰主题：AI 识别的用户困扰分类（仅内部使用，UI 不直接展示原始标识） */
export type DistressTheme =
  | 'academic'
  | 'selfDoubt'
  | 'interpersonal'
  | 'lifeConfusion'
  | 'academicAnxiety';

/** 风险等级（仅内部流转，UI 绝不展示） */
export type RiskLevel = 'normal' | 'elevated' | 'crisis';

/** 日志模式：完整模式（分析+推荐）/ 安静模式（仅记录） */
export type JournalMode = 'full' | 'quiet';

/** 支持卡片类型：理解卡 / 行动卡 / 求助卡 */
export type CardType = 'understanding' | 'action' | 'help';

/** 卡片反馈枚举 */
export type CardFeedback =
  | 'resonate' // 有共鸣
  | 'neutral' // 一般
  | 'tried' // 已尝试
  | 'pending' // 待尝试
  | 'notSuitable' // 不适合我
  | 'talked' // 已找人聊
  | 'considering' // 在考虑
  | 'notNeeded'; // 不需要

/** 拼图主题 */
export type PuzzleTheme =
  | 'calmGrowth'
  | 'homeCreation'
  | 'gentleLife'
  | 'humanVision'
  | 'cityExplore';

/** 发现页推荐分类 */
export type RecCategory = 'action' | 'content' | 'habit' | 'theme' | 'music' | 'nature' | 'creativity' | 'mindfulness' | 'reading' | 'community' | 'body' | 'growth';

/** 成就类型 */
export type AchievementType =
  | 'firstJournal'
  | 'firstAction'
  | 'streak7'
  | 'streak30'
  | 'puzzleComplete'
  | 'share';

/** 单张支持卡片 */
export interface SupportCard {
  id: string;
  type: CardType;
  title: string;
  content: string;
  /** 关联到发现页的推荐项 id */
  sourceItemId?: string;
  /** 详细内容（AI 深度回复） */
  detail?: string;
}

/** 高危响应信息 */
export interface CrisisInfo {
  message: string;
  hotlines: { name: string; number: string }[];
  talkTemplate: string;
}

/** 一次日志对应的卡片推荐组合 */
export interface CardRecommendation {
  understanding: SupportCard;
  action: SupportCard;
  help: SupportCard;
  /** 仅当 riskLevel === crisis 时存在 */
  crisisInfo?: CrisisInfo;
}

/** 一条日志记录 */
export interface JournalEntry {
  id: string;
  date: string; // ISO 日期 YYYY-MM-DD
  time: string; // HH:mm
  content: string;
  mode: JournalMode;
  mood?: number; // 1-5 用户自评
  /** AI 判断心情分（仅内部使用，UI 不展示） */
  aiMood?: number;
  userTags: string[];
  /** AI 识别主题（仅内部使用） */
  aiThemes: DistressTheme[];
  /** 内部字段，UI 不展示 */
  riskLevel: RiskLevel;
  analysis?: string;
  cards?: CardRecommendation;
  /** key 为卡片 id */
  cardFeedback?: Record<string, CardFeedback>;
  actionCompleted?: boolean;
  /** 隐私加锁 */
  isLocked?: boolean;
}

/** 发现页推荐项 */
export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  category: RecCategory;
  tags: string[];
  puzzleId?: string;
  /** 该任务对应的拼图块数（默认 1） */
  puzzlePieces?: number;
  isRepeatable?: boolean;
  icon?: string;
  /** 习惯类任务的坚持天数 */
  habitDays?: number;
  /** 详情页内容：详细介绍 */
  detail?: RecommendationDetail;
}

/** 推荐详情 */
export interface RecommendationDetail {
  /** 副标题/来源（如歌手名、作者名等） */
  source?: string;
  /** 亮点特色 */
  highlights: string[];
  /** 推荐理由 */
  reason: string;
  /** 如何开始 */
  howToStart?: string;
}

/** 拼图 */
export interface Puzzle {
  id: string;
  theme: PuzzleTheme;
  name: string;
  description: string;
  totalPieces: number;
  completedPieces: number;
  /** 拼图完成后的插画（用 emoji 或本地资源标识，Demo 阶段用占位） */
  illustration: string;
  isUnlocked: boolean;
  /** 拼图底图（可选，支持 URL 字符串或本地 require 资源） */
  imageUrl?: string | number;
}

/** 成就 */
export interface Achievement {
  id: string;
  type: AchievementType;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

/** 手账月度条目 */
export interface JournalBookEntry {
  month: string; // YYYY-MM
  moodCurve: { date: string; mood: number }[];
  completedActions: number;
  unlockedPuzzles: number;
  topResonatedCard: string;
  autoReview: string;
}

/** 用户设置 */
export interface UserSettings {
  /** 行动推荐开关 */
  actionRecommendationEnabled: boolean;
  /** 回访功能开关 */
  revisitEnabled: boolean;
  /** 每次推送卡片数量 */
  cardCount: 3 | 4 | 5 | 6;
  /** 心情评分偏好 */
  moodScoreMode: 'manual' | 'auto' | 'combined';
  /** 隐私加锁 */
  privacyLockEnabled: boolean;
  /** AI 模型选择（deepseek-chat / deepseek-reasoner） */
  aiModel: 'deepseek-chat' | 'deepseek-reasoner';
}

/** 用户档案（我的页头部） */
export interface UserProfile {
  nickname: string;
  signature: string;
  points: number;
  streakDays: number;
  completedActions: number;
}

/** 进行中的行动（回访 + 完成确认用） */
export interface PendingAction {
  id: string;
  itemId: string;
  title: string;
  startedAt: string; // ISO
  source: 'home' | 'discover' | 'journal';
  /** 关联的日志 id（若来自日志推荐） */
  journalId?: string;
  /** 关联拼图 */
  puzzleId?: string;
  puzzlePieces?: number;
}

/** AI 分析结果（services 层返回给 hooks 的结构） */
export interface AnalysisResult {
  themes: DistressTheme[];
  riskLevel: RiskLevel;
  aiMood: number;
  analysis: string;
  cards?: CardRecommendation;
}

/** 持久化的全局应用状态 */
export interface AppDataState {
  profile: UserProfile;
  settings: UserSettings;
  journals: JournalEntry[];
  achievements: Achievement[];
  puzzles: Puzzle[];
  pendingActions: PendingAction[];
  recommendations: RecommendationItem[];
  /** 已完成的推荐项 id 列表 */
  completedItemIds: string[];
  /** 是否已完成首次初始化 */
  initialized: boolean;
}
