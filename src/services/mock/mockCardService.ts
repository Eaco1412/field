/**
 * 卡片服务 Mock 实现。
 */

import type { CardService } from '../cardService';
import type {
  CardFeedback,
  CardRecommendation,
  CardType,
  DistressTheme,
  RiskLevel,
  SupportCard,
} from '../types';
import {
  THEME_CARD_TEMPLATES,
  NEUTRAL_CARD_TEMPLATE,
  buildCardRecommendation,
} from './mockData';

/** 备选文案（用于"换一张"） */
const ALTERNATIVE_UNDERSTANDING: Record<string, string[]> = {
  academic: [
    '学习从来都不是一件轻松的事，但你已经尽力了。',
    '分数不能定义你是谁，你比一张考卷更丰富。',
    '慢慢来，不是所有事情都要立刻有答案。',
  ],
  selfDoubt: [
    '你比自己以为的要好很多。',
    '能感觉到"不够好"，恰恰说明你在认真对待自己。',
    '每个人都有自己的节奏，你不需要和别人比。',
  ],
  interpersonal: [
    '真正的朋友是相互的，不是你单方面去讨好。',
    '被孤立不是因为你不好，是他们还没看见你。',
    '有些关系结束了，是为了给对的关系腾位置。',
  ],
  lifeConfusion: [
    '不知道方向也没关系，先从脚下的小事开始。',
    '意义不是想出来的，是在做的过程中慢慢找到的。',
    '允许自己有一段"不知道"的时光。',
  ],
  academicAnxiety: [
    '焦虑在告诉你，这件事对你很重要。',
    '喘不过气的时候，先停下来深呼吸三次。',
    '你不需要做到完美，做到"足够好"就够了。',
  ],
};

const ALTERNATIVE_ACTION: Record<string, string[]> = {
  academic: [
    '把今天要做的事分成三个最小步骤，只做第一步。',
    '去阳台吹两分钟风，看看远处的树。',
    '写一句话："今天我已经做了____，已经很棒了。"',
  ],
  selfDoubt: [
    '对着镜子里的自己，说一句"你辛苦了"。',
    '找出一张你觉得开心的照片，看看那个时候的你。',
    '写一封给一年后的自己的短信，存起来。',
  ],
  interpersonal: [
    '给一个你信任的人发一条消息，聊聊任何事。',
    '写下来"我喜欢自己的三个地方"。',
    '去一个让你觉得安全的地方坐一会儿。',
  ],
  lifeConfusion: [
    '列一个"小时候想做的10件事"的清单。',
    '去一个你从没去过的小地方，比如一条小巷。',
    '随便翻一本书，翻到第几页就读第几页。',
  ],
  academicAnxiety: [
    '做三次深呼吸：吸气4秒，屏息4秒，呼气6秒。',
    '放下笔，走到窗边，数窗外的绿色植物。',
    '喝一杯温水，感受水流过喉咙的温度。',
  ],
};

const ALTERNATIVE_HELP: Record<string, string[]> = {
  academic: [
    '试着跟老师聊聊你的感受，他们可能有办法。',
    '和家人说说你的压力，被理解会让你轻松一些。',
    '学校的心理老师也可以帮到你。',
  ],
  selfDoubt: [
    '你值得被温柔对待，也包括来自自己的温柔。',
    '如果这些想法一直挥之不去，可以找心理老师聊聊。',
    '身边有人关心你，只是你可能还没注意到。',
  ],
  interpersonal: [
    '找一个你信任的大人说说这件事。',
    '学校的心理老师可以帮你想办法。',
    '你不需要独自扛着一切。',
  ],
  lifeConfusion: [
    '和长辈聊聊他们年轻时的迷茫，也许会有启发。',
    '心理老师可以陪你一起探索。',
    '读一些人物传记，看看别人是怎么找到方向的。',
  ],
  academicAnxiety: [
    '如果焦虑一直很强烈，可以找心理老师聊聊。',
    '跟信任的朋友或家人说说，被听见就会好一些。',
    '学校有心理咨询室，他们很乐意帮你。',
  ],
};

function pickAlt(key: string | undefined, type: CardType, index: number): string {
  const map =
    type === 'understanding'
      ? ALTERNATIVE_UNDERSTANDING
      : type === 'action'
        ? ALTERNATIVE_ACTION
        : ALTERNATIVE_HELP;
  if (!key || !map[key]) {
    // fallback to 通用
    return type === 'understanding'
      ? NEUTRAL_CARD_TEMPLATE.understanding
      : type === 'action'
        ? NEUTRAL_CARD_TEMPLATE.action
        : NEUTRAL_CARD_TEMPLATE.help;
  }
  const arr = map[key];
  return arr[index % arr.length];
}

const FEEDBACK_LABELS: Record<CardFeedback, string> = {
  resonate: '有共鸣',
  neutral: '一般',
  tried: '已尝试',
  pending: '待尝试',
  notSuitable: '不适合我',
  talked: '已找人聊',
  considering: '在考虑',
  notNeeded: '不需要',
};

function makeId(type: CardType): string {
  return `${type[0]}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export const mockCardService: CardService = {
  build(themes: DistressTheme[], riskLevel: RiskLevel): CardRecommendation {
    return buildCardRecommendation(themes, riskLevel);
  },
  replaceOne(
    current: CardRecommendation,
    type: CardType,
    themes: DistressTheme[],
  ): CardRecommendation {
    const primary = themes[0];
    // 用时间戳作为变化因子，保证每次换都不一样
    const factor = Math.floor(Date.now() / 1000) % 10;
    const alt = pickAlt(primary, type, factor);
    let sourceItemId: string | undefined;
    if (type === 'action' && primary) {
      sourceItemId = THEME_CARD_TEMPLATES[primary].actionItemId;
    }
    const newCard: SupportCard = {
      id: makeId(type),
      type,
      title: type === 'understanding' ? '理解卡' : type === 'action' ? '行动卡' : '求助卡',
      content: alt,
      sourceItemId,
    };
    return {
      ...current,
      [type]: newCard,
    };
  },
  replaceAll(themes: DistressTheme[]): CardRecommendation {
    const primary = themes[0];
    const factor = Math.floor(Date.now() / 1000) % 10 + 1;
    const understandingContent = pickAlt(primary, 'understanding', factor);
    const actionContent = pickAlt(primary, 'action', factor);
    const helpContent = pickAlt(primary, 'help', factor);
    const sourceItemId = primary
      ? THEME_CARD_TEMPLATES[primary].actionItemId
      : NEUTRAL_CARD_TEMPLATE.actionItemId;

    const understanding: SupportCard = {
      id: makeId('understanding'),
      type: 'understanding',
      title: '理解卡',
      content: understandingContent,
    };
    const action: SupportCard = {
      id: makeId('action'),
      type: 'action',
      title: '行动卡',
      content: actionContent,
      sourceItemId,
    };
    const help: SupportCard = {
      id: makeId('help'),
      type: 'help',
      title: '求助卡',
      content: helpContent,
    };
    return { understanding, action, help };
  },
  feedbackLabel(fb: CardFeedback): string {
    return FEEDBACK_LABELS[fb] ?? fb;
  },
  makeCard(
    type: CardType,
    content: string,
    sourceItemId?: string,
  ): SupportCard {
    return {
      id: makeId(type),
      type,
      title: type === 'understanding' ? '理解卡' : type === 'action' ? '行动卡' : '求助卡',
      content,
      sourceItemId,
    };
  },
};
