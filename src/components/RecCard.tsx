/**
 * RecCard 推荐卡片。
 * 彩色玻璃质感 + 明显边缘阴影，点击进入详情页。
 * 已完成的卡片高透明度。
 */

import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../theme';
import type { RecCategory, RecommendationItem } from '../services/types';
import { STRINGS } from '../constants/strings';
import { Pill } from './Pill';

interface RecCardProps {
  item: RecommendationItem;
  inProgress: boolean;
  completed?: boolean;
  onTry: () => void;
  onComplete?: () => void;
}

const CATEGORY_TINT: Record<RecCategory, {
  bg: string;
  bgGlass: string;
  border: string;
  text: string;
  icon: string;
  shadow: string;
}> = {
  action: {
    bg: '#E8F5E9',
    bgGlass: 'rgba(232,245,233,0.65)',
    border: 'rgba(129,199,132,0.35)',
    text: colors.green,
    icon: 'leaf-outline',
    shadow: 'rgba(129,199,132,0.25)',
  },
  content: {
    bg: '#E3F2FD',
    bgGlass: 'rgba(227,242,253,0.65)',
    border: 'rgba(100,181,246,0.35)',
    text: colors.blue,
    icon: 'book-outline',
    shadow: 'rgba(100,181,246,0.25)',
  },
  habit: {
    bg: '#FFF3E0',
    bgGlass: 'rgba(255,243,224,0.65)',
    border: 'rgba(255,183,77,0.35)',
    text: colors.orange,
    icon: 'repeat-outline',
    shadow: 'rgba(255,183,77,0.25)',
  },
  theme: {
    bg: '#F3E5F5',
    bgGlass: 'rgba(243,229,245,0.65)',
    border: 'rgba(149,117,205,0.35)',
    text: '#9575CD',
    icon: 'sparkles-outline',
    shadow: 'rgba(149,117,205,0.25)',
  },
  music: {
    bg: '#FCE4EC',
    bgGlass: 'rgba(252,228,236,0.65)',
    border: 'rgba(233,30,99,0.35)',
    text: '#E91E63',
    icon: 'musical-note',
    shadow: 'rgba(233,30,99,0.25)',
  },
  nature: {
    bg: '#E0F7FA',
    bgGlass: 'rgba(224,247,250,0.65)',
    border: 'rgba(0,150,136,0.35)',
    text: '#009688',
    icon: 'eye-outline',
    shadow: 'rgba(0,150,136,0.25)',
  },
  creativity: {
    bg: '#FFF3E0',
    bgGlass: 'rgba(255,243,224,0.65)',
    border: 'rgba(255,152,0,0.35)',
    text: '#FF9800',
    icon: 'brush',
    shadow: 'rgba(255,152,0,0.25)',
  },
  mindfulness: {
    bg: '#ECEFF1',
    bgGlass: 'rgba(236,239,241,0.65)',
    border: 'rgba(96,125,139,0.35)',
    text: '#607D8B',
    icon: 'flower-outline',
    shadow: 'rgba(96,125,139,0.25)',
  },
  reading: {
    bg: '#E3F2FD',
    bgGlass: 'rgba(227,242,253,0.65)',
    border: 'rgba(63,81,181,0.35)',
    text: '#3F51B5',
    icon: 'library',
    shadow: 'rgba(63,81,181,0.25)',
  },
  community: {
    bg: '#FCE4EC',
    bgGlass: 'rgba(252,228,236,0.65)',
    border: 'rgba(244,143,177,0.35)',
    text: '#F48FB1',
    icon: 'heart-outline',
    shadow: 'rgba(244,143,177,0.25)',
  },
  body: {
    bg: '#E8F5E9',
    bgGlass: 'rgba(232,245,233,0.65)',
    border: 'rgba(76,175,80,0.35)',
    text: '#4CAF50',
    icon: 'fitness',
    shadow: 'rgba(76,175,80,0.25)',
  },
  growth: {
    bg: '#E3F2FD',
    bgGlass: 'rgba(227,242,253,0.65)',
    border: 'rgba(33,150,243,0.35)',
    text: '#2196F3',
    icon: 'trending-up',
    shadow: 'rgba(33,150,243,0.25)',
  },
};

export function RecCard({ item, inProgress, completed, onTry, onComplete }: RecCardProps) {
  const tint = CATEGORY_TINT[item.category];

  const handlePress = () => {
    router.push(`/sub/rec-detail?id=${item.id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: tint.bgGlass,
          borderColor: tint.border,
          shadowColor: tint.shadow,
          opacity: completed ? 0.35 : pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={[styles.glassOverlay, { backgroundColor: 'rgba(255,255,255,0.25)' }]} />

      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: tint.bg }]}>
          <Ionicons name={tint.icon as keyof typeof Ionicons.glyphMap} size={20} color={tint.text} />
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.desc} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.muted} style={styles.chevron} />
      </View>

      <View style={styles.tagsRow}>
        {item.tags.slice(0, 3).map((tag) => (
          <Pill key={tag} label={tag} size="sm" />
        ))}
        {item.puzzleId ? (
          <Pill
            label={`🧩 ${item.puzzlePieces ?? 1}块`}
            size="sm"
            color={colors.accent}
            bgColor={colors.accentLight}
          />
        ) : null}
      </View>

      <View style={styles.actionRow}>
        {completed ? (
          <View style={styles.doneBadge}>
            <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
            <Text style={styles.doneText}>已完成</Text>
          </View>
        ) : inProgress ? (
          <Pressable
            onPress={onComplete}
            style={({ pressed }) => [
              styles.completeBtn,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.accent} />
            <Text style={styles.completeText}>{STRINGS.complete}</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={onTry}
            style={({ pressed }) => [
              styles.tryBtn,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={styles.tryText}>{STRINGS.tryNow}</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.accent} />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 5,
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  titleWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: 2,
  },
  desc: {
    fontSize: fontSize.body,
    color: colors.muted,
    lineHeight: 18,
  },
  chevron: {
    alignSelf: 'center',
    marginLeft: spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  tryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: radius.pill,
  },
  tryText: {
    color: colors.accent,
    fontSize: fontSize.caption,
    fontWeight: '600',
    marginRight: 4,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: radius.pill,
  },
  completeText: {
    color: colors.accent,
    fontSize: fontSize.caption,
    fontWeight: '600',
    marginLeft: 4,
  },
  doneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  doneText: {
    color: colors.accent,
    fontSize: fontSize.caption,
    fontWeight: '600',
    marginLeft: 4,
  },
});
