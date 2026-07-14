/**
 * 我的页：档案、数据概览、功能入口列表。
 */

import type { ReactNode } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { useApp } from '../../src/context/AppContext';
import { useAchievement } from '../../src/hooks/useAchievement';
import { usePuzzle } from '../../src/hooks/usePuzzle';
import { STRINGS } from '../../src/constants/strings';
import { colors, fontSize, radius, shadows, spacing } from '../../src/theme';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  rightContent?: ReactNode;
}

function MenuItem({ icon, title, subtitle, onPress, rightContent }: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={styles.menuLeft}>
        <View style={styles.menuIcon}>
          <Ionicons name={icon} size={20} color={colors.accent} />
        </View>
        <View>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle ? <Text style={styles.menuSubtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      <View style={styles.menuRight}>
        {rightContent}
        <Ionicons name="chevron-forward" size={18} color={colors.muted} style={{ marginLeft: spacing.sm }} />
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { state } = useApp();
  const { recentUnlocked } = useAchievement();
  const { progressPuzzles } = usePuzzle();

  const { profile } = state;

  return (
    <ScreenWrapper>
      {/* 顶部档案 */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🌿</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.nickname}>{profile.nickname}</Text>
          <Text style={styles.signature}>{profile.signature}</Text>
        </View>
      </View>

      {/* 数据概览 */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{profile.streakDays}</Text>
          <Text style={styles.statLabel}>{STRINGS.profileStreak}{STRINGS.unitDay}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{profile.completedActions}</Text>
          <Text style={styles.statLabel}>{STRINGS.profileActions}{STRINGS.unitTimes}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{profile.points}</Text>
          <Text style={styles.statLabel}>{STRINGS.profilePoints}{STRINGS.unitPoint}</Text>
        </View>
      </View>

      {/* 功能入口列表 */}
      <View style={styles.menuCard}>
        <MenuItem
          icon="document-text-outline"
          title={STRINGS.profileHistory}
          onPress={() => router.push('/sub/journal-history')}
        />
        <View style={styles.menuDivider} />
        <MenuItem
          icon="ribbon-outline"
          title={STRINGS.profileAchievements}
          onPress={() => router.push('/sub/achievements')}
          rightContent={
            <View style={styles.achievementPreview}>
              {recentUnlocked.slice(0, 3).map((a) => (
                <Text key={a.id} style={styles.achPreviewIcon}>{a.icon}</Text>
              ))}
            </View>
          }
        />
        <View style={styles.menuDivider} />
        <MenuItem
          icon="grid-outline"
          title={STRINGS.profilePuzzles}
          onPress={() => router.push('/sub/puzzles')}
          rightContent={
            <View style={styles.puzzlePreview}>
              {progressPuzzles.slice(0, 3).map((p) => (
                <Text key={p.id} style={styles.puzzlePreviewIcon}>{p.illustration}</Text>
              ))}
            </View>
          }
        />
        <View style={styles.menuDivider} />
        <MenuItem
          icon="book-outline"
          title={STRINGS.profileBook}
          onPress={() => router.push('/sub/journal-book')}
        />
        <View style={styles.menuDivider} />
        <MenuItem
          icon="settings-outline"
          title={STRINGS.profileSettings}
          onPress={() => router.push('/sub/settings')}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingTop: spacing.xl,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  avatarText: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
  },
  nickname: {
    fontSize: fontSize.h2,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  signature: {
    fontSize: fontSize.body,
    color: colors.muted,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg ?? '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: fontSize.h2,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: fontSize.caption,
    color: colors.muted,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  menuCard: {
    backgroundColor: colors.cardBg ?? '#FFFFFF',
    borderRadius: radius.card,
    paddingHorizontal: spacing.md,
    ...shadows.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuTitle: {
    fontSize: fontSize.body,
    fontWeight: '500',
    color: colors.ink,
  },
  menuSubtitle: {
    fontSize: fontSize.caption,
    color: colors.muted,
    marginTop: 2,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 48 + spacing.md,
  },
  achievementPreview: {
    flexDirection: 'row',
  },
  achPreviewIcon: {
    fontSize: 18,
    marginLeft: 4,
  },
  puzzlePreview: {
    flexDirection: 'row',
  },
  puzzlePreviewIcon: {
    fontSize: 18,
    marginLeft: 4,
    opacity: 0.5,
  },
});
