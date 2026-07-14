/**
 * MoodStars 心情评分组件。
 * 1-5 颗星，可点击选择或仅展示。
 */

import { StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '../theme';

interface MoodStarsProps {
  value: number | undefined;
  size?: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
}

export function MoodStars({
  value,
  size = 20,
  onChange,
  readOnly = false,
}: MoodStarsProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.row}>
      {stars.map((n) => {
        const filled = value != null && n <= value;
        const icon = filled ? 'star' : 'star-outline';
        const color = filled ? '#FFB74D' : '#CCCCCC';
        if (readOnly) {
          return (
            <Ionicons
              key={n}
              name={icon}
              size={size}
              color={color}
              style={{ marginRight: n < 5 ? spacing.xs : 0 }}
            />
          );
        }
        return (
          <Pressable
            key={n}
            onPress={() => onChange?.(n)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              marginRight: n < 5 ? spacing.xs : 0,
              padding: 2,
            })}
          >
            <Ionicons name={icon} size={size} color={color} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
