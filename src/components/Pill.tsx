/**
 * Pill 标签组件：分类标签、心情标签等小胶囊样式。
 */

import { StyleSheet, Text, View, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme';

interface PillProps {
  label: string;
  color?: string;
  bgColor?: string;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
  active?: boolean;
  onPress?: () => void;
}

export function Pill({
  label,
  color = colors.muted,
  bgColor = colors.bg2,
  size = 'sm',
  style,
  active = false,
  onPress,
}: PillProps) {
  const padV = size === 'sm' ? spacing.xs : spacing.sm;
  const padH = size === 'sm' ? spacing.sm : spacing.md;
  const fSize = size === 'sm' ? fontSize.caption : fontSize.body;

  const pillStyle: ViewStyle = {
    backgroundColor: active ? colors.accentLight : bgColor,
    paddingVertical: padV,
    paddingHorizontal: padH,
    borderRadius: radius.pill,
  };

  const textStyle = {
    color: active ? colors.accent : color,
    fontSize: fSize,
    fontWeight: (active ? '600' : '400') as '600' | '400',
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.pill, pillStyle, style, { opacity: pressed ? 0.7 : 1 }]}
      >
        <Text style={textStyle}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.pill, pillStyle, style]}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
