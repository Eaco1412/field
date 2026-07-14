/**
 * 设计规范常量：配色、字体、圆角、阴影、间距、动效时长。
 * 所有 UI 样式统一从这里取值，保证视觉一致性。
 */

export const colors = {
  bg: '#FAF8F5', // 主背景：暖米色
  bg2: '#F0EDE8', // 次要背景
  ink: '#2D2D2D', // 主文字：深灰
  muted: '#9E9E9E', // 辅助文字
  accent: '#7BAE7F', // 主色调：柔和薄荷绿
  accentLight: '#E8F5E9', // 主色调浅色
  blue: '#64B5F6', // 理解卡色系
  green: '#81C784', // 行动卡色系
  orange: '#FFB74D', // 求助卡色系
  danger: '#EF5350', // 高危警告色
  cardBg: '#FFFFFF', // 卡片背景
  border: '#E8E8E8', // 边框
} as const;

export const cardBg = '#FFFFFF';
export const borderColor = '#E8E8E8';

export const radius = {
  card: 16,
  button: 12,
  input: 12,
  avatar: 50,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const fontSize = {
  caption: 12,
  body: 14,
  title: 16,
  h3: 18,
  h2: 22,
  h1: 28,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
};

export const animation = {
  tabFade: 300,
  cardSlide: 400,
  breathingMin: 0.3,
  breathingMax: 1.0,
} as const;

// 卡片类型对应的色调（理解/行动/求助）
export const cardTypeColor: Record<'understanding' | 'action' | 'help', string> = {
  understanding: colors.blue,
  action: colors.green,
  help: colors.orange,
};
