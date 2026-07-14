/**
 * Mock 数据：Demo 阶段预填充内容。
 * 包含日志、推荐库、拼图、成就、用户档案、设置、卡片模板、危机信息。
 * 生产阶段这些数据由后端 API 提供，前端通过 services/api 替换。
 */

import type {
  Achievement,
  AnalysisResult,
  CardRecommendation,
  CrisisInfo,
  DistressTheme,
  JournalEntry,
  JournalMode,
  Puzzle,
  RecommendationItem,
  RiskLevel,
  UserProfile,
  UserSettings,
  SupportCard,
} from '../types';

const PUZZLE_IMG_1 = require('../../picture/09918f0d51b34b2b69da6bb4dd236ee6.jpg');
const PUZZLE_IMG_2 = require('../../picture/21d0a9d2162ca154cf6c500e5fe55d90.jpg');
const PUZZLE_IMG_3 = require('../../picture/55b4b028506f06e08cda01cb9a564b5b.jpg');
const PUZZLE_IMG_4 = require('../../picture/ab77308585bf45a1dc42f20ad0678bab.jpg');

/** 默认用户档案 */
export const DEFAULT_PROFILE: UserProfile = {
  nickname: '旷野探索者',
  signature: '在旷野里，慢慢走',
  points: 12,
  streakDays: 3,
  completedActions: 2,
};

/** 默认设置 */
export const DEFAULT_SETTINGS: UserSettings = {
  actionRecommendationEnabled: true,
  revisitEnabled: true,
  cardCount: 3,
  moodScoreMode: 'combined',
  privacyLockEnabled: false,
  aiModel: 'deepseek-v4-flash',
};

/** 预设日志（首次打开即展示完整使用效果） */
export const MOCK_JOURNALS: JournalEntry[] = [
  {
    id: 'j1',
    date: '2025-07-04',
    time: '20:15',
    content: '今天感觉挺平淡的，没什么特别的事情发生',
    mode: 'full',
    mood: 3,
    userTags: ['平淡'],
    aiThemes: [],
    riskLevel: 'normal',
    analysis: '谢谢你愿意分享。平淡的一天也是值得被记录的一天。',
    cards: {
      understanding: {
        id: 'c1u',
        type: 'understanding',
        title: '理解卡',
        content: '谢谢你愿意分享。平淡的一天也是值得被记录的一天。',
      },
      action: {
        id: 'c1a',
        type: 'action',
        title: '行动卡',
        content: '在熟悉的路上慢慢走一遍，试着找三样以前没注意过的东西。',
        sourceItemId: 'act2',
      },
      help: {
        id: 'c1h',
        type: 'help',
        title: '求助卡',
        content: '如果你有任何不舒服的感觉，随时可以回到这里。',
      },
    },
    cardFeedback: { c1u: 'resonate', c1a: 'tried' },
    actionCompleted: true,
  },
  {
    id: 'j2',
    date: '2025-07-03',
    time: '21:30',
    content: '考试没考好，心里有点难受',
    mode: 'full',
    mood: 2,
    userTags: ['学业压力'],
    aiThemes: ['academic'],
    riskLevel: 'normal',
    analysis: '你最近的辛苦，我都听到了。不是你不够好，是你太累了。',
    cards: {
      understanding: {
        id: 'c2u',
        type: 'understanding',
        title: '理解卡',
        content: '你最近的辛苦，我都听到了。不是你不够好，是你太累了。',
      },
      action: {
        id: 'c2a',
        type: 'action',
        title: '行动卡',
        content: '给自己泡一杯热饮，用手机拍一张窗外的照片，记录一个今天的小瞬间。',
        sourceItemId: 'act1',
      },
      help: {
        id: 'c2h',
        type: 'help',
        title: '求助卡',
        content: '如果这种感觉很持续，跟信任的大人说一声，也是一种勇气。',
      },
    },
    cardFeedback: { c2u: 'resonate' },
  },
];

/** 完整推荐库（发现页 4 个分类） */
export const MOCK_RECOMMENDATIONS: RecommendationItem[] = [
  // 行动推荐区
  {
    id: 'act1', title: '泡一杯热饮', description: '给自己泡一杯热饮，慢慢喝完，感受温度', category: 'action', tags: ['居家', '简单'], puzzleId: 'p1', puzzlePieces: 1, icon: 'local-cafe',
    detail: {
      source: '居家行动',
      highlights: ['用触觉感受杯壁的温度变化', '专注品尝每一口的味道', '给自己3分钟不被打扰的安静'],
      reason: '当你感到疲惫时，一杯热饮能从身体上给你温暖。关键不在于喝什么，而在于那个"慢慢来"的过程——你值得拥有这几分钟的停顿。',
      howToStart: '找一只杯子，泡上你手边有的任何热饮。端起来，先感受一下温度，然后慢慢喝完。',
    },
  },
  {
    id: 'act2', title: '找三样新东西', description: '在熟悉的路上找三样以前没注意过的东西', category: 'action', tags: ['户外', '观察'], puzzleId: 'p5', puzzlePieces: 1, icon: 'explore',
    detail: {
      source: '观察练习',
      highlights: ['在走了一百遍的路上发现新细节', '训练"看见"的能力', '改变对日常的感知方式'],
      reason: '我们经常在熟悉的环境中"视而不见"。这个练习能帮你重新激活感知力，让你发现：原来身边一直有很多被忽略的有趣细节。',
      howToStart: '出门走一段平时常走的路，刻意放慢脚步，找三样你以前没注意过的东西——可以是一朵花、一个招牌、一只猫。',
    },
  },
  {
    id: 'act3', title: '写下三件小事', description: '写下三件今天做得还不错的小事，哪怕很小', category: 'action', tags: ['记录', '简单'], puzzleId: 'p3', puzzlePieces: 1, icon: 'edit',
    detail: {
      source: '自我肯定练习',
      highlights: ['重新定义"做得好"的标准', '发现被自己忽略的努力', '积累对自己的善意'],
      reason: '当我们陷入低谷时，容易只看到做不好的事情。写三件做得不错的小事，是在帮自己重新看见那些被忽略的努力——哪怕只是"今天按时起床了"。',
      howToStart: '拿出纸笔或打开手机备忘录，写下三件今天做得还不错的事。不用大事，"认真吃了一顿饭"也算。',
    },
  },
  {
    id: 'act4', title: '安静散步', description: '安静散步10分钟，不用带耳机', category: 'action', tags: ['户外', '简单'], puzzleId: 'p1', puzzlePieces: 1, icon: 'directions-walk',
    detail: {
      source: '正念行走',
      highlights: ['不戴耳机，让耳朵也"散步"', '感受脚底与地面的接触', '让大脑暂时从信息流中休息'],
      reason: '不带耳机散步，是为了让自己从持续的信息输入中短暂脱离。你不需要"听点什么"才不算浪费时间，安静地走一走本身就有治愈力。',
      howToStart: '出门走10分钟，不带耳机，不看手机。感受周围的声音、风和自己的脚步。',
    },
  },
  {
    id: 'act5', title: '整理房间一角', description: '选择一个角落，花5分钟简单整理', category: 'action', tags: ['居家', '简单'], puzzleId: 'p2', puzzlePieces: 1, icon: 'cleaning-services',
    detail: {
      source: '环境整理',
      highlights: ['只整理一个角落，不贪多', '外部环境的秩序感影响内心', '5分钟即可见效'],
      reason: '当生活感觉失控时，整理一个小角落能帮你找回"我能做到"的感觉。不需要大扫除，5分钟整理桌面一角就够了。',
      howToStart: '选一个你经常看到的小区域（桌面、床头柜），花5分钟把它整理干净。',
    },
  },
  {
    id: 'act6', title: '画一幅小画', description: '用任何工具画一幅简单的小画，不需要好看', category: 'action', tags: ['创作', '居家'], puzzleId: 'p2', puzzlePieces: 1, icon: 'brush',
    detail: {
      source: '自由创作',
      highlights: ['不需要任何绘画基础', '目标是"画完"而不是"画好"', '释放被压抑的表达欲'],
      reason: '画画的过程本身就是一种情绪释放。不需要画得好看，关键是把心里的东西通过手"流"出来。涂鸦、简笔画都可以。',
      howToStart: '找一支笔和一张纸，随便画什么。可以是一个圆圈、一棵树、你今天的心情颜色。',
    },
  },
  {
    id: 'act7', title: '听一首老歌', description: '听一首小时候听过的歌', category: 'action', tags: ['音乐', '简单'], puzzleId: 'p4', puzzlePieces: 1, icon: 'music-note',
    detail: {
      source: '音乐回忆',
      highlights: ['老歌会唤起被时间封存的记忆', '旋律能绕过理性直接触及情感', '是一趟不用买票的时光旅行'],
      reason: '小时候听过的歌往往和温暖的记忆绑在一起。当你在当下感到迷茫时，一首老歌能把你带回一个简单纯粹的时光，让紧绷的情绪松开。',
      howToStart: '想一想小时候家里常放的、或者你最早学会唱的那首歌，在音乐App里搜出来，戴上耳机听完。',
    },
  },
  {
    id: 'act8', title: '看一朵云', description: '抬头看天空，找到一朵形状有趣的云', category: 'action', tags: ['户外', '观察'], puzzleId: 'p5', puzzlePieces: 1, icon: 'cloud',
    detail: {
      source: '自然观察',
      highlights: ['抬头这个动作本身就是一种释放', '云的形状永远在变化，没有标准答案', '给眼睛一个看远处的理由'],
      reason: '我们很少有意识地看着天空。但"抬头看云"这个简单的动作，能让紧绷的颈椎放松，也能让一直盯着近处问题的眼睛获得新的视角。',
      howToStart: '走到窗边或室外，抬头看天空，找到一朵你觉得形状有趣的云，看它慢慢变化。',
    },
  },
  // 内容推荐区
  {
    id: 'cnt1', title: '《也许你该找个人聊聊》', description: '一位心理治疗师和她的来访者的真实故事', category: 'content', tags: ['书籍', '治愈'], puzzleId: 'p4', puzzlePieces: 1, icon: 'menu-book',
    detail: {
      source: '洛莉·戈特利布 著',
      highlights: ['作者既是治疗师也是来访者，双视角叙事', '用真实案例展现"脆弱也是一种力量"', '幽默温暖的文风，读起来不沉重'],
      reason: '这本书最大的特点是：它让你看到，连心理治疗师自己也会遇到困境、也会需要求助。它会帮你理解"寻求帮助"不是软弱，而是勇敢。如果你正在经历一些说不清的困扰，这本书可能会给你答案。',
      howToStart: '在微信读书或图书馆找到这本书，从第一章开始读，不用急着读完。',
    },
  },
  {
    id: 'cnt2', title: '《心灵奇旅》', description: '关于找到生活中值得珍惜的小事', category: 'content', tags: ['影片', '治愈'], puzzleId: 'p4', puzzlePieces: 1, icon: 'movie',
    detail: {
      source: '皮克斯动画 2020',
      highlights: ['皮克斯最有哲思的一部作品', '用一片落叶讲清楚了"活着的意义"', '画面极美，配乐爵士风非常动人'],
      reason: '这部电影讲的不是"追逐梦想"，而是"感受当下"。主角在追求人生目标的过程中，忽略了生活中那些微小但美好的瞬间。如果你曾经觉得"活着有什么意义"，这部电影会给你一个非常温柔的答案。',
      howToStart: '找个安静的时间，独自看完这部电影。看完后可以想一想：你今天的"火花"是什么？',
    },
  },
  {
    id: 'cnt3', title: '《随机波动》', description: '当你觉得自己不够好（单期）', category: 'content', tags: ['播客', '思考'], puzzleId: 'p4', puzzlePieces: 1, icon: 'podcasts',
    detail: {
      source: '随机波动播客',
      highlights: ['三位女性主播的深度对话', '议题涵盖社会、文化、心理', '这一期聚焦"自我否定"与"不够好"的感受'],
      reason: '随机波动是国内最有深度的播客之一。三位主播用温柔但有力的方式讨论"为什么我们总觉得自己不够好"这个话题。听她们聊，你会感觉自己的困惑被认真对待了，而不是被简单地安慰。',
      howToStart: '在小宇宙App或苹果播客搜索"随机波动"，找到"当你觉得自己不够好"这期，戴上耳机慢慢听。',
    },
  },
  {
    id: 'cnt4', title: '轻音乐合集', description: '适合安静时刻听的轻音乐', category: 'content', tags: ['音乐', '安静'], puzzleId: 'p1', puzzlePieces: 1, icon: 'library-music',
    detail: {
      source: '各类音乐平台',
      highlights: ['没有歌词，不会分散注意力', '适合学习、发呆、睡前', '钢琴曲、环境音、lo-fi 都可以'],
      reason: '有时候你需要的不是"听什么"，而是"有个声音陪着你"。轻音乐不会抢走你的注意力，但会给你一种"不孤单"的感觉。在焦虑或疲惫时，它像是背景里一只温柔的手。',
      howToStart: '在音乐App搜索"轻音乐""钢琴曲"或"lo-fi chill"，随便找一个歌单开始播放。',
    },
  },
  // 好习惯推荐区
  {
    id: 'hab1', title: '每天记录开心事', description: '每天写下一件让你开心或感恩的小事', category: 'habit', tags: ['坚持', '记录'], puzzleId: 'p3', puzzlePieces: 21, habitDays: 21, icon: 'favorite',
    detail: {
      source: '21天感恩日记',
      highlights: ['每天只需1分钟', '训练大脑关注"好的事情"', '21天后形成关注正向的习惯'],
      reason: '大脑天然有"负面偏好"——更容易记住不好的事。每天写一件开心的小事，是在刻意训练大脑也去注意好的事情。坚持21天后，你会发现自己更容易发现生活中的小确幸。',
      howToStart: '从今天开始，在睡前写下一件今天让你开心的小事。可以在本子上，也可以在手机里。',
    },
  },
  {
    id: 'hab2', title: '睡前冥想', description: '每天睡前冥想5分钟，安静呼吸', category: 'habit', tags: ['坚持', '安静'], puzzleId: 'p1', puzzlePieces: 21, habitDays: 21, icon: 'self-improvement',
    detail: {
      source: '正念冥想',
      highlights: ['每天5分钟，门槛极低', '帮助入睡、减少焦虑', '不需要任何App，只需要你的呼吸'],
      reason: '冥想不是"什么都不想"，而是练习"注意到自己走神了，再回来"。这个能力会迁移到生活的方方面面——当情绪来的时候，你能更快地"回来"。',
      howToStart: '今晚睡前，坐在床上或躺下，闭上眼睛，把注意力放在呼吸上。走神了没关系，注意到走神的时候，轻轻把注意力带回来。',
    },
  },
  {
    id: 'hab3', title: '每天运动', description: '每天运动20分钟，任何形式都可以', category: 'habit', tags: ['坚持', '运动'], puzzleId: 'p1', puzzlePieces: 21, habitDays: 21, icon: 'directions-run',
    detail: {
      source: '日常运动',
      highlights: ['任何形式：走路、跳绳、跳舞都算', '20分钟即可，不需要健身房', '运动分泌的内啡肽是天然情绪调节剂'],
      reason: '运动是已被科学证实的最有效的情绪调节方式之一。你不需要跑马拉松，每天20分钟的任何运动——走路、跳绳、甚至跟着视频跳舞——都能让身体分泌让你感觉好的化学物质。',
      howToStart: '今天找个20分钟，用你喜欢的任何方式动起来。不用换运动服，不用去操场，在自己房间里也行。',
    },
  },
  {
    id: 'hab4', title: '每天阅读', description: '每天阅读15分钟，任何内容都可以', category: 'habit', tags: ['坚持', '阅读'], puzzleId: 'p4', puzzlePieces: 30, habitDays: 30, icon: 'auto-stories',
    detail: {
      source: '阅读习惯',
      highlights: ['15分钟即可，不需要读完一本书', '任何内容都算：小说、漫画、科普', '30天后阅读变成像刷牙一样的习惯'],
      reason: '阅读是给自己一个"进入另一个世界"的入口。在书里，你的烦恼会暂时退后，你也会从别人的故事中获得新的视角。关键是养成习惯，而不是读什么"有用"的书。',
      howToStart: '找一本你一直想读的书或一篇感兴趣的文章，今天读15分钟。不用设目标，读完就放下。',
    },
  },
  // 主题探索区
  {
    id: 'thm1', title: '了解一个新职业', description: '搜索一个你从未听过的职业，了解它是做什么的', category: 'theme', tags: ['探索', '知识'], puzzleId: 'p4', puzzlePieces: 1, icon: 'work',
    detail: {
      source: '职业探索',
      highlights: ['打开对世界可能性的想象', '了解不同人的不同活法', '可能发现意想不到的兴趣方向'],
      reason: '当我们被困在"考试—升学—就业"的单一轨道里时，很容易觉得人生只有一条路。去了解一个你从没听过的职业，会发现世界比想象中大得多，人生的可能性也比想象中多得多。',
      howToStart: '在搜索引擎里搜"冷门职业"或"你不知道的职业"，找一个你感兴趣的了解它具体做什么、需要什么技能。',
    },
  },
  {
    id: 'thm2', title: '看一场线上展览', description: '在手机上参观一个免费的线上艺术展览', category: 'theme', tags: ['探索', '艺术'], puzzleId: 'p4', puzzlePieces: 1, icon: 'palette',
    detail: {
      source: '数字艺术',
      highlights: ['足不出户参观国内外博物馆', 'Google Arts & Culture 有大量免费资源', '艺术能激活感性思维'],
      reason: '艺术不需要你"看懂"，它只需要你"感受"。在手机上看一场展览，让眼睛从作业和社交信息中暂时解放，去看看色彩、线条和光影，这对紧绷的大脑是一种休息。',
      howToStart: '打开 Google Arts & Culture 网站或故宫博物院数字馆，随便找一个展览慢慢浏览。',
    },
  },
  {
    id: 'thm3', title: '观察一个陌生人', description: '在公共场合安静观察一个陌生人5分钟（不打扰）', category: 'theme', tags: ['观察', '户外'], puzzleId: 'p5', puzzlePieces: 1, icon: 'visibility',
    detail: {
      source: '人群观察',
      highlights: ['锻炼"看见他人"的能力', '意识到每个人都在过着自己的生活', '从自我关注中暂时抽离'],
      reason: '当我们陷入自己的烦恼时，世界会变得很小——好像只有自己在受苦。安静地观察一个陌生人，会让你意识到：每个人都在认真地过着自己的生活，你并不孤单。',
      howToStart: '在公园、咖啡厅或公交站台，找一个不远处的人，安静地观察5分钟。不打扰对方，只是好奇地看。',
    },
  },
  {
    id: 'thm4', title: '读一篇科普文章', description: '读一篇关于宇宙、海洋或动物的科普文章', category: 'theme', tags: ['知识', '阅读'], puzzleId: 'p4', puzzlePieces: 1, icon: 'science',
    detail: {
      source: '科学普及',
      highlights: ['宇宙的尺度让个人烦恼变得渺小', '海洋深处有我们从未见过的生命', '动物的世界简单而有趣'],
      reason: '当你的烦恼感觉很"大"的时候，去了解一下宇宙有多大、海洋有多深。这不是说你的烦恼不重要，而是当你意识到自己在浩瀚宇宙中的位置时，那种紧绷感会松动一些。',
      howToStart: '在果壳网、知乎或任何科普网站搜索"宇宙""深海""动物"相关的文章，找一篇读读看。',
    },
  },
  // 音乐疗愈区
  {
    id: 'mus1', title: '听一首钢琴曲', description: '听一首坂本龙一的钢琴独奏，感受音符之间的留白', category: 'music', tags: ['音乐', '安静'], puzzleId: 'p1', puzzlePieces: 1, icon: 'piano',
    detail: {
      source: '坂本龙一 · 《Energy Flow》',
      highlights: ['旋律极简，却有治愈力量', '音符之间的"留白"让人安静', '适合独处时循环播放'],
      reason: '坂本龙一的音乐有一种"不多说"的温柔。他不会用复杂的旋律打动你，而是用极简的音符留出空间，让你在里面安放自己的情绪。',
      howToStart: '在音乐App搜索"坂本龙一 Energy Flow"，戴上耳机，闭上眼睛听完整首。',
    },
  },
  {
    id: 'mus2', title: '白噪音助眠', description: '听30分钟雨声或海浪声，让大脑安静下来', category: 'music', tags: ['音乐', '睡眠'], puzzleId: 'p1', puzzlePieces: 1, icon: 'rainy',
    detail: {
      source: '自然白噪音',
      highlights: ['稳定的白噪音能屏蔽干扰', '雨声和海浪声有天然的安抚效果', '不需要专注，放着就好'],
      reason: '白噪音不传达任何情绪信息，它只是"在那里"。当你被太多想法塞满时，一个中性的声音背景能让大脑从"处理信息"模式切换到"休息"模式。',
      howToStart: '在音乐App搜索"雨声""海浪声"或"白噪音"，设一个30分钟的定时关闭，躺下听。',
    },
  },
  {
    id: 'mus3', title: '跟着一首歌跳舞', description: '放一首节奏感强的歌，跟着节奏随便动', category: 'music', tags: ['音乐', '运动'], puzzleId: 'p2', puzzlePieces: 1, icon: 'musical-notes',
    detail: {
      source: '身体律动',
      highlights: ['不需要会跳舞，随便动就行', '让身体从"紧绷"切换到"流动"', '一首歌的时间就能改变状态'],
      reason: '当我们焦虑或低落时，身体会不自觉地收紧。跟着一首喜欢的歌随便动一动，是在用身体的方式告诉大脑"现在可以放松了"。',
      howToStart: '选一首你最喜欢的节奏感强的歌，站在房间中间，跟着节奏随便动。不用好看，自己开心就好。',
    },
  },
  {
    id: 'mus4', title: '听一档音乐播客', description: '听别人聊一首歌背后的故事', category: 'music', tags: ['音乐', '播客'], puzzleId: 'p4', puzzlePieces: 1, icon: 'headset',
    detail: {
      source: '音乐播客推荐',
      highlights: ['了解一首歌诞生的故事', '从别人的视角重新听一首歌', '音乐+叙事的双重治愈'],
      reason: '一首歌背后的故事往往和歌本身一样动人。当你了解创作者写下这首歌时的心境，音乐就不再只是旋律，而变成了一次跨越时空的对话。',
      howToStart: '在小宇宙搜索"音乐播客"或"听歌故事"，找一期你感兴趣的听听。',
    },
  },
  // 自然探索区
  {
    id: 'nat1', title: '赤脚踩草地', description: '找一片草地，脱掉鞋子赤脚走几分钟', category: 'nature', tags: ['自然', '户外'], puzzleId: 'p5', puzzlePieces: 1, icon: 'footsteps',
    detail: {
      source: '接地练习',
      highlights: ['脚底有丰富的神经末梢', '直接接触自然 surfaces 能降低焦虑', '一种最简单的"回到身体"的方式'],
      reason: '我们几乎从来不和地面直接接触。赤脚踩在草地上，那种触感会把你从头脑里"拉"回身体——你不再是那些想法，你是一个站在大地上的生命。',
      howToStart: '找一片安全的草地，脱掉鞋袜，赤脚走几分钟。感受草的触感、温度和泥土的柔软。',
    },
  },
  {
    id: 'nat2', title: '种一盆小植物', description: '买一盆好养的绿植，放在书桌上', category: 'nature', tags: ['自然', '居家'], puzzleId: 'p2', puzzlePieces: 1, icon: 'leaf',
    detail: {
      source: '园艺疗愈',
      highlights: ['照顾一个生命会给自己意义感', '植物的生长是肉眼可见的反馈', '桌面绿植还能净化空气'],
      reason: '养植物有一种特别的治愈力——你在照顾它，但它也在安静地陪伴你。每天看到它长出新叶，会给你一种"生活是在向前的"的感觉。',
      howToStart: '去花店或网上买一盆好养的植物（推荐绿萝、多肉），放在你每天都能看到的地方。',
    },
  },
  {
    id: 'nat3', title: '观察一棵树', description: '找一棵你身边的树，花5分钟认真观察它', category: 'nature', tags: ['自然', '观察'], puzzleId: 'p5', puzzlePieces: 1, icon: 'tree',
    detail: {
      source: '自然观察',
      highlights: ['一棵树有自己的形状、纹理和故事', '树不会焦虑，它只是生长', '观察自然能降低皮质醇水平'],
      reason: '我们每天路过很多树，却很少真正"看见"它们。花5分钟认真看一棵树——它的树皮、枝丫、叶子——你会感受到一种安静的力量：它不急不躁，只是按自己的节奏生长。',
      howToStart: '在上下班或散步的路上，找一棵你喜欢的树，停下来看5分钟。看它的形状、纹理，听风吹过叶子的声音。',
    },
  },
  {
    id: 'nat4', title: '看一次日落', description: '找一个视野好的地方，完整地看一次日落', category: 'nature', tags: ['自然', '户外'], puzzleId: 'p5', puzzlePieces: 1, icon: 'sunny',
    detail: {
      source: '日落仪式',
      highlights: ['日落的色彩变化是大自然最壮观的表演', '"看着天变暗"是一种古老的安抚方式', '给一天一个温柔的结束'],
      reason: '日落是一天中最温柔的时刻。不管今天发生了什么，太阳都会照常落下。看着天色从亮变暗，你会感受到一种"今天可以结束了"的释然。',
      howToStart: '查一下今天的日落时间，提前找一个能看到西边天空的地方，安静地看完整个过程。',
    },
  },
  // 创意释放区
  {
    id: 'cre1', title: '写一首烂诗', description: '写一首诗，越烂越好，不要追求任何质量', category: 'creativity', tags: ['创作', '记录'], puzzleId: 'p2', puzzlePieces: 1, icon: 'create',
    detail: {
      source: '自由书写',
      highlights: ['目标是"写得烂"，不是"写得好"', '解除"必须好"的压力后，表达欲会自然涌出', '烂诗也有它真实的力量'],
      reason: '很多人不写东西，是因为觉得"写不好"。但如果你给自己的目标是"写一首烂诗"，压力就消失了——而当你真的开始写，往往会发现没那么烂。',
      howToStart: '拿出纸笔，写一首诗。不要修改，不要纠结押韵。题目可以是"今天的风"或"我的袜子"。',
    },
  },
  {
    id: 'cre2', title: '拍一张"今日照片"', description: '用手机拍一张今天最想记住的瞬间', category: 'creativity', tags: ['创作', '记录'], puzzleId: 'p3', puzzlePieces: 1, icon: 'camera',
    detail: {
      source: '日常摄影',
      highlights: ['一张照片就是一个"我在此刻"的证据', '不需要滤镜和构图', '积累下来就是你的生活编年史'],
      reason: '拍照是"我注意到了这一刻"的仪式。当你举起手机拍下某个瞬间，你在说：这值得被记住。多年后翻看，这些照片会告诉你，你的生活比你以为的丰富得多。',
      howToStart: '今天用手机拍一张你最想记住的画面——可以是早餐、窗外的光、也可以是你的影子。',
    },
  },
  {
    id: 'cre3', title: '用黏土捏个东西', description: '买一包超轻黏土，随便捏一个东西', category: 'creativity', tags: ['创作', '居家'], puzzleId: 'p2', puzzlePieces: 1, icon: 'hand-left',
    detail: {
      source: '触觉创作',
      highlights: ['黏土的触感本身就很解压', '手和脑的连接比我们以为的更紧密', '不需要任何技巧'],
      reason: '用手捏东西是一种非常原始的创造行为。当你的手在忙碌时，大脑会进入一种类似冥想的状态——不需要想什么，手知道该怎么做。',
      howToStart: '买一包超轻黏土（十几块钱），随便捏一个东西。可以是一个碗、一只猫、或者一坨不知道是什么的形状。',
    },
  },
  {
    id: 'cre4', title: '重新排列你的桌面', description: '把桌面上的东西重新排列，创造一种新秩序', category: 'creativity', tags: ['创作', '居家'], puzzleId: 'p2', puzzlePieces: 1, icon: 'grid',
    detail: {
      source: '空间创意',
      highlights: ['重新排列=重新定义空间的意义', '小的改变能带来新的心情', '不需要花钱的"换环境"'],
      reason: '我们每天看同样的桌面会变得"视觉麻木"。把东西换个位置，大脑会重新处理这些视觉信息，像是在说"这是新的"——即使什么都没买，也像换了个环境。',
      howToStart: '把桌面上的东西全部拿走，再一样一样放回来，但换个位置。看看新的排列感觉怎么样。',
    },
  },
  // 正念练习区
  {
    id: 'min1', title: '4-7-8呼吸法', description: '吸气4秒，屏息7秒，呼气8秒，重复4次', category: 'mindfulness', tags: ['正念', '呼吸'], puzzleId: 'p1', puzzlePieces: 1, icon: 'wind',
    detail: {
      source: '呼吸调节',
      highlights: ['呼气比吸气长，能激活副交感神经', '科学验证的最快放松方式之一', '随时随地可以做'],
      reason: '4-7-8呼吸法是由哈佛医学院博士Andrew Weil提出的。它的原理很简单：延长呼气会激活"休息和消化"的副交感神经，让身体从紧张状态快速切换到放松状态。',
      howToStart: '找一个安静的地方坐下，鼻子吸气数4秒，屏住呼吸数7秒，嘴巴呼气数8秒。重复4次。',
    },
  },
  {
    id: 'min2', title: '5-4-3-2-1接地法', description: '说出5个看到的、4个听到的、3个触到的、2个闻到的、1个尝到的东西', category: 'mindfulness', tags: ['正念', '感知'], puzzleId: 'p1', puzzlePieces: 1, icon: 'eye',
    detail: {
      source: '感知锚定',
      highlights: ['最快把你从焦虑漩涡中拉出来的方法', '调动五种感官，让注意力回到当下', '不需要任何工具'],
      reason: '当焦虑袭来时，大脑会"飞"到未来的担忧中。5-4-3-2-1法是用感官把注意力"锚"回到当下——你无法同时感知当下和焦虑未来，所以这个方法很有效。',
      howToStart: '现在就试试：说出5个你看到的东西，4个你听到的声音，3个你触摸到的物体，2个你闻到的气味，1个你尝到的味道。',
    },
  },
  {
    id: 'min3', title: '正念吃一颗葡萄干', description: '用全部感官慢慢吃一颗葡萄干，像第一次吃一样', category: 'mindfulness', tags: ['正念', '感知'], puzzleId: 'p1', puzzlePieces: 1, icon: 'nutrition',
    detail: {
      source: '正念饮食',
      highlights: ['一个经典的正念入门练习', '用"第一次吃"的好奇心去感受', '一颗葡萄干可以吃5分钟'],
      reason: '我们吃东西时几乎不"在场"——边看手机边吃、边想事情边吃。正念饮食让你用全部感官去体验一颗葡萄干，这是一种"回到此刻"的练习。',
      howToStart: '拿一颗葡萄干（或任何小零食），先看它的形状颜色，闻它的味道，放在嘴里慢慢感受，最后慢慢咀嚼。',
    },
  },
  {
    id: 'min4', title: '身体扫描冥想', description: '从脚到头，逐一感受身体每个部位', category: 'mindfulness', tags: ['正念', '身体'], puzzleId: 'p1', puzzlePieces: 1, icon: 'body',
    detail: {
      source: '身体扫描',
      highlights: ['发现你未曾注意到的身体紧张', '身心连接的基础练习', '做完整套约10分钟'],
      reason: '我们经常忽略身体的信号，直到它疼了才发现。身体扫描是从脚到头逐一"问候"每个部位，让你重新和身体建立连接，也让紧绷的地方有机会松开。',
      howToStart: '躺下来，闭上眼睛。从脚趾开始，感受每个部位10秒，慢慢向上移动——脚、小腿、膝盖、大腿、腹部、胸口、手臂、脖子、头。',
    },
  },
  // 阅读时光区
  {
    id: 'rd1', title: '《被讨厌的勇气》', description: '阿德勒心理学：一切烦恼都来自人际关系', category: 'reading', tags: ['书籍', '心理'], puzzleId: 'p4', puzzlePieces: 1, icon: 'book',
    detail: {
      source: '岸见一郎、古贺史健 著',
      highlights: ['用对话体写心理学，极易读', '"课题分离"理念能解决大量烦恼', '改变认知视角的利器'],
      reason: '这本书会让你意识到，很多你以为"做不到"的事，其实是"不想做"——因为改变意味着不确定。阿德勒说：你不是没有能力，你只是缺少改变的勇气。',
      howToStart: '在微信读书找到这本书，先读"第一夜"——哲学家和青年的第一次对话。',
    },
  },
  {
    id: 'rd2', title: '《蛤蟆先生去看心理医生》', description: '一只抑郁的蛤蟆通过心理咨询找回自己的故事', category: 'reading', tags: ['书籍', '治愈'], puzzleId: 'p4', puzzlePieces: 1, icon: 'book',
    detail: {
      source: '罗伯特·戴博德 著',
      highlights: ['用童话形式讲心理咨询过程', '轻松好读却触及核心', '看到"咨询"到底是什么感觉'],
      reason: '如果你对心理咨询好奇但又害怕，这本书是最好的"预习"。通过蛤蟆先生的十次咨询，你会理解咨询不是"被治疗"，而是"被理解"。',
      howToStart: '在微信读书找到这本书，从第一章开始，跟着蛤蟆先生一起走进咨询室。',
    },
  },
  {
    id: 'rd3', title: '读一首里尔克的诗', description: '读里尔克《给一个青年诗人的十封信》中的一段', category: 'reading', tags: ['书籍', '文学'], puzzleId: 'p4', puzzlePieces: 1, icon: 'mail',
    detail: {
      source: '里尔克 著',
      highlights: ['里尔克对年轻人问题的回答温柔而深刻', '关于孤独、爱、困难的智慧', '一段话可能改变你看待问题的方式'],
      reason: '里尔克在一百多年前回答一个年轻人的信，但那些回答至今仍然有效。他说"要耐心对待心里未解的问题"，这句话本身就是一种安慰。',
      howToStart: '搜索"给一个青年诗人的十封信 第一封信"，读其中一段。不用读完，读一段就够了。',
    },
  },
  {
    id: 'rd4', title: '读一篇人物故事', description: '读一个普通人或名人的深度人物报道', category: 'reading', tags: ['阅读', '人物'], puzzleId: 'p4', puzzlePieces: 1, icon: 'person',
    detail: {
      source: '人物报道',
      highlights: ['真实的人生故事比小说更有力量', '看到不同人面对困境的方式', '从别人的经历中获得自己的答案'],
      reason: '当你觉得"只有我这样"的时候，读别人的故事会发现：原来每个人都有自己的困境，也有自己的应对方式。这不是比较谁更惨，而是从别人的经历中找到参考。',
      howToStart: '在《人物》《GQ报道》或"正面连接"找一个你感兴趣的人物报道，花15分钟读完。',
    },
  },
  // 温暖故事区
  {
    id: 'com1', title: '给一个朋友发消息', description: '给一个很久没联系的朋友发一句"最近怎么样"', category: 'community', tags: ['社交', '连接'], puzzleId: 'p3', puzzlePieces: 1, icon: 'chatbubble',
    detail: {
      source: '社交连接',
      highlights: ['一条消息就能重建连接', '不需要长聊，一句问候就够了', '你可能会收到意想不到的温暖回应'],
      reason: '我们经常觉得"没事找别人很奇怪"，但其实收到问候的人往往会很开心。人际连接是心理韧性的重要来源，一条简短的消息就是在维护这种连接。',
      howToStart: '打开通讯录，找一个你想到的人，发一句"嘿，好久没聊了，最近怎么样？"',
    },
  },
  {
    id: 'com2', title: '写一封不寄出的信', description: '写一封给某个人的信，但不需要寄出去', category: 'community', tags: ['记录', '表达'], puzzleId: 'p3', puzzlePieces: 1, icon: 'mail-open',
    detail: {
      source: '书信疗愈',
      highlights: ['写信是整理思绪的过程', '不寄出意味着你可以说任何话', '完成比完美更重要'],
      reason: '有些话我们说不出口，但写出来本身就是一种释放。不寄出的信给了你完全的自由——你可以诚实，可以愤怒，可以温柔，不用担心对方的反应。',
      howToStart: '找一个你想说话但没法说的人，写一封信给他/她。写在纸上或手机里都可以。写完不用寄，收起来就好。',
    },
  },
  {
    id: 'com3', title: '读一个陌生人故事', description: '在网上读一个陌生人分享的真实经历', category: 'community', tags: ['阅读', '连接'], puzzleId: 'p5', puzzlePieces: 1, icon: 'people',
    detail: {
      source: '陌生人故事',
      highlights: ['互联网最温柔的一面是陌生人互助', '读到"和我一样"的瞬间很治愈', '从别人的经历中获得力量'],
      reason: '有时候朋友的故事太近了，反而不好说。陌生人的故事给了你一个安全距离——你可以从他们的经历中看到自己，而不需要"回应"什么。',
      howToStart: '在豆瓣、知乎或Reddit搜索你正在经历的关键词（比如"焦虑""迷茫"），找一个陌生人分享的真实故事读。',
    },
  },
  {
    id: 'com4', title: '做一件微小的善事', description: '为身边的人做一件很小但温暖的事', category: 'community', tags: ['社交', '行动'], puzzleId: 'p3', puzzlePieces: 1, icon: 'heart',
    detail: {
      source: '利他行为',
      highlights: ['帮助别人会激活大脑的奖赏回路', '善事不需要大，小到"帮人按电梯"就行', '"被需要"的感觉能提升自我价值'],
      reason: '心理学研究发现，帮助别人比被帮助更能提升幸福感。做一件微小的善事，不仅让别人开心，也让你感受到"我有能力给"——这对低落时的自我价值感是很好的修复。',
      howToStart: '今天找一件微小的善事做：帮同事带杯水、给路边的小猫喂食、或者在网上给一个帮助过你的帖子点个赞。',
    },
  },
  // 身体关怀区
  {
    id: 'bd1', title: '泡个热水澡', description: '泡一个20分钟的热水澡，让身体完全放松', category: 'body', tags: ['身体', '放松'], puzzleId: 'p1', puzzlePieces: 1, icon: 'water',
    detail: {
      source: '热浴疗愈',
      highlights: ['热水能降低肌肉紧张和皮质醇', '泡澡时的"浮力感"模拟被拥抱', '20分钟是最佳时长'],
      reason: '泡澡不只是"洗干净"，它是一种身体层面的自我安抚。热水让肌肉放松，浮力让你感觉"被托住"，这种身体感受会传递给大脑"安全"的信号。',
      howToStart: '放一缸热水（温度38-40度），泡20分钟。可以放点浴盐或精油，闭上眼睛享受。',
    },
  },
  {
    id: 'bd2', title: '做一套拉伸', description: '跟着视频做10分钟全身拉伸', category: 'body', tags: ['身体', '运动'], puzzleId: 'p1', puzzlePieces: 1, icon: 'fitness',
    detail: {
      source: '拉伸练习',
      highlights: ['10分钟即可，不需要任何器材', '释放肌肉里积攒的紧张', '做完会感觉身体"松开"了'],
      reason: '情绪会"存"在身体里——焦虑时肩膀紧、难过时胸口闷。拉伸不是在"锻炼"，而是在告诉身体：你可以松开了。',
      howToStart: '在B站或YouTube搜索"10分钟全身拉伸"，找一个视频跟着做。',
    },
  },
  {
    id: 'bd3', title: '好好吃一顿饭', description: '认真做一顿饭或好好吃一顿，不看手机', category: 'body', tags: ['身体', '饮食'], puzzleId: 'p3', puzzlePieces: 1, icon: 'restaurant',
    detail: {
      source: '正念饮食',
      highlights: ['"好好吃饭"是最基础的自爱', '不看手机地吃饭=给自己完整的关注', '味觉是常被忽略的感官'],
      reason: '我们经常"顺便"吃饭——边看手机边吃、边赶路边吃。好好吃一顿饭，是在说"我值得花这个时间"。这不是关于吃什么，而是关于"我在场"。',
      howToStart: '今天找一顿饭，放下手机，认真地吃。品尝每一口的味道，感受食物在嘴里的质感。',
    },
  },
  {
    id: 'bd4', title: '早睡一次', description: '今晚比平时早睡30分钟', category: 'body', tags: ['身体', '睡眠'], puzzleId: 'p1', puzzlePieces: 1, icon: 'moon',
    detail: {
      source: '睡眠调节',
      highlights: ['30分钟看似不多，但睡眠质量会明显改善', '早睡比早起更容易调整', '睡眠不足是焦虑的重要诱因'],
      reason: '很多时候你觉得"状态不好"，其实只是"没睡好"。睡眠和情绪的关系比我们以为的紧密得多——早睡30分钟，第二天可能会发现很多烦恼没那么大了。',
      howToStart: '今晚比平时早30分钟上床。把手机放在够不到的地方，闭上眼睛，让自己入睡。',
    },
  },
  // 自我成长区
  {
    id: 'grw1', title: '写一份"我擅长"清单', description: '写下你擅长的事情，至少10件', category: 'growth', tags: ['成长', '记录'], puzzleId: 'p3', puzzlePieces: 1, icon: 'list',
    detail: {
      source: '优势识别',
      highlights: ['很多人写不出5件，但写出来后会很惊讶', '"擅长"不限于技能，性格也算', '重新发现自己的价值'],
      reason: '我们对自己的评价往往是偏低的——很容易看到自己的不足，却忽略了擅长的事。写一份"我擅长"清单，是在帮自己重新看见那些被忽略的优势。',
      howToStart: '拿出纸笔，写下你擅长的10件事。不限于技能——"善于倾听""能逗人笑""准时"都算。',
    },
  },
  {
    id: 'grw2', title: '学一个新技能', description: '花30分钟学一个你一直想学的技能', category: 'growth', tags: ['成长', '学习'], puzzleId: 'p4', puzzlePieces: 1, icon: 'school',
    detail: {
      source: '技能学习',
      highlights: ['30分钟足够入门任何技能', '学习新东西会激活大脑的多巴胺', '"开始"比"学完"更重要'],
      reason: '成长不一定需要宏大的计划。花30分钟学一个新技能——折纸、手语、编程基础——你会在"我学会了"的瞬间感受到一种久违的成就感。',
      howToStart: '想一个你一直想学的技能，今天花30分钟学它的入门内容。在B站或YouTube搜一个教程开始。',
    },
  },
  {
    id: 'grw3', title: '设定一个小目标', description: '为本周设定一个具体、可完成的小目标', category: 'growth', tags: ['成长', '计划'], puzzleId: 'p3', puzzlePieces: 1, icon: 'flag',
    detail: {
      source: '目标设定',
      highlights: ['小到"本周喝8杯水"都可以', '完成小目标会建立"我能做到"的自信', '比大目标更容易坚持'],
      reason: '当我们状态不好时，"大目标"会让人更焦虑。但一个"小到不可能失败"的目标，能帮你重新建立"我能做到"的感觉——这种感觉会慢慢扩展到其他事情。',
      howToStart: '为本周定一个具体的小目标，比如"每天走5000步"或"每天写50字日记"。写下来贴在看得到的地方。',
    },
  },
  {
    id: 'grw4', title: '回顾你的一周', description: '花10分钟回顾这周，写下一件学到的事', category: 'growth', tags: ['成长', '反思'], puzzleId: 'p3', puzzlePieces: 1, icon: 'time',
    detail: {
      source: '周回顾',
      highlights: ['10分钟回顾一周的发生', '找到一件"学到的事"', '为下周提供参考'],
      reason: '如果不回顾，一周一周很快就会模糊成一片。花10分钟停下来想一想，这周发生了什么、你学到了什么——这不是总结报告，而是给自己一个"看见成长"的机会。',
      howToStart: '今天找个10分钟，想想这周发生了什么，写下一件你学到的事。哪怕只是"我发现早起很难"也算。',
    },
  },
];

/** 拼图库 */
export const MOCK_PUZZLES: Puzzle[] = [
  { id: 'p1', theme: 'calmGrowth', name: '静心成长', description: '在安静中找到自己', totalPieces: 9, completedPieces: 3, illustration: '🌿', isUnlocked: false, imageUrl: PUZZLE_IMG_1 },
  { id: 'p2', theme: 'homeCreation', name: '居家创作', description: '在熟悉的角落创造', totalPieces: 12, completedPieces: 4, illustration: '🏠', isUnlocked: false, imageUrl: PUZZLE_IMG_2 },
  { id: 'p3', theme: 'gentleLife', name: '生活温柔', description: '感受日常的温柔', totalPieces: 16, completedPieces: 5, illustration: '🌸', isUnlocked: false, imageUrl: PUZZLE_IMG_3 },
  { id: 'p4', theme: 'humanVision', name: '人文视野', description: '看见更广阔的世界', totalPieces: 9, completedPieces: 2, illustration: '🏔️', isUnlocked: false, imageUrl: PUZZLE_IMG_4 },
];

/** 成就库 */
export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', type: 'firstJournal', name: '第一次写下心事', description: '开始了记录的第一步', icon: '✨', isUnlocked: true, unlockedAt: '2025-07-01' },
  { id: 'a2', type: 'firstAction', name: '完成第一个小行动', description: '把想法变成了行动', icon: '🌱', isUnlocked: true, unlockedAt: '2025-07-03' },
  { id: 'a3', type: 'streak7', name: '连续记录7天', description: '坚持了一周', icon: '🔥', isUnlocked: false },
  { id: 'a4', type: 'streak30', name: '连续记录30天', description: '坚持了一个月', icon: '🎯', isUnlocked: false },
  { id: 'a5', type: 'puzzleComplete', name: '拼完第一张拼图', description: '完成了第一幅插画', icon: '🧩', isUnlocked: false },
  { id: 'a6', type: 'share', name: '分享一次成就', description: '把成长分享出去', icon: '💌', isUnlocked: false },
];

/** 高危响应信息 */
export const CRISIS_INFO: CrisisInfo = {
  message: '我看到你现在很痛苦。你的安全比什么都重要。',
  hotlines: [{ name: '全国24小时心理援助热线', number: '12320-5' }],
  talkTemplate: '最近我心里很难受，我需要帮助。',
};

/** 困扰主题关键词匹配表 */
export const THEME_KEYWORDS: Record<DistressTheme, string[]> = {
  academic: ['考试', '成绩', '作业', '学习', '考砸', '排名', '分数', '复习', '中考', '高考', '补习'],
  selfDoubt: ['没用', '废物', '笨', '差劲', '不够好', '失败', '比不上', '讨厌自己'],
  interpersonal: ['霸凌', '欺负', '孤立', '不理我', '排挤', '嘲笑', '打我', '骂我', '没人理'],
  lifeConfusion: ['没意思', '无意义', '活着干嘛', '不知道', '迷茫', '空虚', '无聊', '干什么'],
  academicAnxiety: ['焦虑', '紧张', '压力', '喘不过气', '来不及', '快疯了'],
};

/** 高危关键词 */
export const CRISIS_KEYWORDS = ['不想活', '去死', '自杀', '自残', '自伤', '跳楼', '割腕'];

/** 自我否定关键词（用于 elevated 判定） */
export const SELF_DOUBT_KEYWORDS = THEME_KEYWORDS.selfDoubt;

/** 每个主题对应的预设卡片模板 */
export const THEME_CARD_TEMPLATES: Record<
  DistressTheme,
  { understanding: string; action: string; actionItemId: string; help: string }
> = {
  academic: {
    understanding: '你最近的辛苦，我都听到了。不是你不够好，是你太累了。',
    action: '给自己泡一杯热饮，用手机拍一张窗外的照片，记录一个今天的小瞬间。',
    actionItemId: 'act1',
    help: '如果这种感觉很持续，跟信任的大人说一声，也是一种勇气。',
  },
  selfDoubt: {
    understanding: '你说自己不够好的时候，我想告诉你——你愿意把心里的话写下来，这件事本身就很勇敢。',
    action: '写下三件今天做得还不错的小事，哪怕很小很小。',
    actionItemId: 'act3',
    help: '你不需要一个人扛着这些。',
  },
  interpersonal: {
    understanding: '被孤立不是你的错。你值得被尊重，也值得拥有让你舒服的关系。',
    action: '写下一件今天让你感到安全的小事。',
    actionItemId: 'act3',
    help: '你不需要独自面对。学校有心理老师，他们可以帮助你。',
  },
  lifeConfusion: {
    understanding: '感觉不到意义，也是一种真实的状态。我们可以一起找找生活里那些被忽略的小事。',
    action: '在熟悉的路上慢慢走一遍，试着找三样以前没注意过的东西。',
    actionItemId: 'act2',
    help: '如果这些感受持续了很久，和心理老师或专业人士聊聊，是一种对自己负责的选择。',
  },
  academicAnxiety: {
    understanding: '紧张和焦虑是身体在提醒你：你太在乎了，需要喘口气。',
    action: '安静散步10分钟，不用带耳机，让大脑暂时放空。',
    actionItemId: 'act4',
    help: '如果喘不过气的感觉一直都在，跟心理老师聊聊，会轻松一些。',
  },
};

/** 通用（无主题命中）卡片模板 */
export const NEUTRAL_CARD_TEMPLATE = {
  understanding: '谢谢你愿意分享。平淡的一天也是值得被记录的一天。',
  action: '在熟悉的路上慢慢走一遍，试着找三样以前没注意过的东西。',
  actionItemId: 'act2',
  help: '如果你有任何不舒服的感觉，随时可以回到这里。',
};

/** 根据分析结果构建卡片推荐组合 */
export function buildCardRecommendation(
  themes: DistressTheme[],
  riskLevel: RiskLevel,
): CardRecommendation {
  // 高危：不返回常规卡片，仅 crisis 信息（由调用方附加）
  const primary = themes[0];
  const tmpl = primary ? THEME_CARD_TEMPLATES[primary] : NEUTRAL_CARD_TEMPLATE;
  const stamp = Date.now().toString(36);
  const understanding: SupportCard = {
    id: `u-${stamp}`,
    type: 'understanding',
    title: '理解卡',
    content: tmpl.understanding,
  };
  const action: SupportCard = {
    id: `a-${stamp}`,
    type: 'action',
    title: '行动卡',
    content: tmpl.action,
    sourceItemId: tmpl.actionItemId,
  };
  const help: SupportCard = {
    id: `h-${stamp}`,
    type: 'help',
    title: '求助卡',
    content: tmpl.help,
  };
  const rec: CardRecommendation = { understanding, action, help };
  if (riskLevel === 'crisis') {
    rec.crisisInfo = CRISIS_INFO;
  }
  return rec;
}

/** 构建 AnalysisResult（mock 关键词匹配） */
export function buildAnalysisResult(
  content: string,
  mode: JournalMode,
): AnalysisResult {
  const themes: DistressTheme[] = [];
  (Object.keys(THEME_KEYWORDS) as DistressTheme[]).forEach((theme) => {
    if (THEME_KEYWORDS[theme].some((kw) => content.includes(kw))) {
      themes.push(theme);
    }
  });

  // 风险等级判定
  const isCrisis = CRISIS_KEYWORDS.some((kw) => content.includes(kw));
  const selfDoubtCount = SELF_DOUBT_KEYWORDS.filter((kw) =>
    content.includes(kw),
  ).length;
  const riskLevel: RiskLevel = isCrisis
    ? 'crisis'
    : selfDoubtCount >= 3 || themes.includes('selfDoubt')
      ? 'elevated'
      : 'normal';

  // 心情分（mock：基于关键词粗判）
  const aiMood = isCrisis
    ? 1
    : themes.includes('selfDoubt') || themes.includes('interpersonal')
      ? 2
      : themes.length > 0
        ? 3
        : 4;

  // 安静模式：不生成分析、不推荐卡片
  if (mode === 'quiet') {
    return {
      themes,
      riskLevel,
      aiMood,
      analysis: '',
      cards: undefined,
    };
  }

  // 完整模式：固定温暖分析文案
  const analysis = isCrisis
    ? CRISIS_INFO.message
    : '谢谢你愿意把心里的话说出来。不管今天过得怎么样，你都在认真地活着，这本身就很了不起。我会陪你一起，慢慢走。';

  const cards = buildCardRecommendation(themes, riskLevel);

  const result: AnalysisResult = {
    themes,
    riskLevel,
    aiMood,
    analysis,
    cards,
  };
  return result;
}
