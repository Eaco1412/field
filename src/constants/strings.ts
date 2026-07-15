/**
 * 全局 UI 文案集中管理。
 * 所有界面文字统一从这里引用，便于后续国际化与维护。
 */

export const APP_NAME = '情绪星野';

export const STRINGS = {
  // 通用
  appName: '情绪星野',
  back: '返回',
  send: '发送',
  analyzing: '正在认真听你说…',
  save: '保存',
  cancel: '取消',
  confirm: '确认',
  skip: '跳过',
  tryNow: '试试看',
  complete: '确认完成',
  inProgress: '尝试中',
  done: '完成',
  changeOne: '换一张',
  changeAll: '换一组',
  export: '导出为图片',
  share: '分享',
  notYet: '还没',
  yes: '是',

  // Tab
  tabHome: '首页',
  tabDiscover: '发现',
  tabProfile: '我的',

  // 首页
  homeGreeting: '今天过得怎么样？',
  homeWritePrompt: '今天过得怎么样？有什么想说的，我在这里。',
  homeInputPlaceholder: '写什么都行...',
  homeMoodTag: '心情标签',
  homeMoodScore: '心情评分',
  homeModeFull: '完整模式',
  homeModeQuiet: '安静模式',
  homeModeFullDesc: 'AI 会分析并推荐卡片',
  homeModeQuietDesc: '只记录，不分析不推卡片',
  homeTodayCards: '为你挑选的这些',
  homeTodayRecs: '今天可以试试的小事',

  // 回访
  revisitTitle: '上次你试了【{action}】，感觉怎么样？',
  revisitGood: '感觉不错',
  revisitOkay: '还行',
  revisitNotSuit: '不太适合我',
  revisitThanks: '谢谢你告诉我～',
  revisitAskDetail: '能跟我说说具体怎么样吗？比如你做了什么、有什么感受？',
  revisitAskInputPlaceholder: '写写你的感受...',
  revisitFollowUp: '谢谢你愿意分享这些。有兴趣在今天的日志中记录下这段体验吗？',
  revisitWriteJournal: '写进今天的日志',
  revisitNoThanks: '下次再说',
  revisitStepQuestion: '上次你试的是【{action}】，具体做了什么呢？',
  revisitStepQuestionPlaceholder: '比如：我听了一首小时候常听的歌...',

  // 卡片类型
  cardUnderstanding: '理解卡',
  cardAction: '行动卡',
  cardHelp: '求助卡',

  // 卡片反馈
  fbResonate: '有共鸣',
  fbNeutral: '一般',
  fbTried: '已尝试',
  fbPending: '待尝试',
  fbNotSuitable: '不适合我',
  fbTalked: '已找人聊',
  fbConsidering: '在考虑',
  fbNotNeeded: '不需要',

  // 发现页
  discoverTitle: '发现',
  catAction: '行动推荐',
  catContent: '内容推荐',
  catHabit: '好习惯',
  catTheme: '主题探索',
  catMusic: '音乐疗愈',
  catNature: '自然探索',
  catCreativity: '创意释放',
  catMindfulness: '正念练习',
  catReading: '阅读时光',
  catCommunity: '温暖故事',
  catBody: '身体关怀',
  catGrowth: '自我成长',

  // 推荐详情页
  recDetailHighlights: '亮点特色',
  recDetailReason: '为什么推荐',
  recDetailHowToStart: '如何开始',
  recDetailSource: '来源',

  // 我的页
  profileNickname: '星野探索者',
  profileSignature: '在星野里，慢慢走',
  profileStreak: '连续记录',
  profileActions: '完成行动',
  profilePoints: '积分',
  profileHistory: '历史日志',
  profileAchievements: '我的成就',
  profilePuzzles: '我的拼图',
  profileBook: '我的手账',
  profileSettings: '设置',
  unitDay: '天',
  unitTimes: '次',
  unitPoint: '分',

  // 历史
  historyTitle: '历史日志',
  historyNoRecord: '这一天没有记录',

  // 成就
  achievementsTitle: '我的成就',
  achievementsCount: '{unlocked} / {total}',

  // 拼图
  myPuzzles: '我的拼图',
  puzzleTitle: '我的拼图',
  puzzleCount: '已完成 {completed} / 共 {total} 张',
  puzzleProgress: '{done} / {total}',
  puzzleUnlocked: '已完成',
  puzzleLocked: '未完成',

  // 手账
  bookTitle: '我的手账',
  bookMonthly: '月度',
  bookYearly: '年度',
  bookMoodCurve: '情绪变化曲线',
  bookCompletedActions: '完成的小行动',
  bookUnlockedPieces: '解锁的拼图碎片',
  bookTopCard: '最有共鸣的卡片',
  bookReview: '月度回顾',

  // 设置
  settingsTitle: '设置',
  settingsActionRec: '行动推荐',
  settingsRevisit: '回访功能',
  settingsCardCount: '每次推送卡片数量',
  settingsMoodMode: '心情评分偏好',
  settingsPrivacyLock: '隐私加锁',
  settingsAiModel: 'AI 模型',
  settingsAbout: '关于情绪星野',
  settingsClear: '清除所有数据（重置 Demo）',
  moodManual: '手动设置',
  moodAuto: '自动判断',
  moodCombined: '两者结合',
  clearConfirm: '确定要清除所有数据吗？此操作不可恢复。',

  // 关于
  aboutDesc: '情绪星野是一个面向青少年的 AI 情绪陪伴与行动引导 Demo。所有数据仅保存在本地。',

  // 高危
  crisisMessage: '我看到你现在很痛苦。你的安全比什么都重要。',
  crisisHotline: '全国24小时心理援助热线',
  crisisHotlineNumber: '12320-5',
  crisisTalkTitle: '你可以试着这样跟信任的大人说：',
  crisisTalkTemplate: '最近我心里很难受，我需要帮助。',
  crisisSaveInfo: '保存求助信息',
  crisisSaved: '已保存求助信息',

  // 完成提示
  toastActionDone: '完成啦 +1 分',
  toastPuzzlePiece: '获得 1 块拼图碎片',
  toastAchievement: '解锁新成就',
  toastSaved: '已保存',
  toastCantChat: '想和 AI 聊聊感受吗？',

  // 心情标签
  tags: ['学业压力', '开心', '平淡', '焦虑', '迷茫', '人际', '疲惫', '孤独', '平静', '难过'],

  // 占位
  comingSoon: '敬请期待',
} as const;

/** 卡片反馈选项列表（顺序即展示顺序） */
export const FEEDBACK_OPTIONS: { value: import('../services/types').CardFeedback; label: string }[] = [
  { value: 'resonate', label: STRINGS.fbResonate },
  { value: 'neutral', label: STRINGS.fbNeutral },
  { value: 'tried', label: STRINGS.fbTried },
  { value: 'pending', label: STRINGS.fbPending },
  { value: 'notSuitable', label: STRINGS.fbNotSuitable },
  { value: 'talked', label: STRINGS.fbTalked },
  { value: 'considering', label: STRINGS.fbConsidering },
  { value: 'notNeeded', label: STRINGS.fbNotNeeded },
];

/** 心情评分 1-5 的描述 */
export const MOOD_LABELS = ['很差', '不好', '一般', '不错', '很好'] as const;
