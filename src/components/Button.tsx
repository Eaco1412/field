/**
 * PrimaryButton / GhostButton 按钮组件。
 * 统一按钮样式：圆角、高度、字体、按压效果。
 */

import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  size = 'md',
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const bgColor =
    variant === 'primary'
      ? colors.accent
      : variant === 'secondary'
        ? colors.accentLight
        : variant === 'danger'
          ? colors.danger
          : 'transparent';
  const textColor =
    variant === 'primary' || variant === 'danger'
      ? '#FFFFFF'
      : variant === 'secondary'
        ? colors.accent
        : colors.ink;

  const height = size === 'sm' ? 32 : size === 'lg' ? 52 : 42;
  const paddingH = size === 'sm' ? spacing.md : size === 'lg' ? spacing.xl : spacing.lg;
  const fSize = size === 'sm' ? fontSize.caption : size === 'lg' ? fontSize.title : fontSize.body;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bgColor,
          height,
          paddingHorizontal: paddingH,
          borderRadius: radius.button,
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
          borderWidth: variant === 'ghost' ? 1 : 0,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <Text
          style={[
            styles.text,
            { color: textColor, fontSize: fSize, fontWeight: '500' },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    textAlign: 'center',
  },
});
