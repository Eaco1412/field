/**
 * SectionHeader 区块标题组件。
 */

import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type ViewStyle, type StyleProp } from 'react-native';
import { colors, fontSize, spacing } from '../theme';

interface SectionHeaderProps {
  title?: string;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function SectionHeader({ title, right, style }: SectionHeaderProps) {
  return (
    <View style={[styles.row, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: '600',
    color: colors.ink,
  },
});
