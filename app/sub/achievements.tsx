import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { useAchievement } from '../../src/hooks/useAchievement';
import { STRINGS } from '../../src/constants/strings';
import { colors, fontSize, radius, shadows, spacing } from '../../src/theme';
import type { Achievement } from '../../src/services/types';
import { Button } from '../../src/components/Button';

const ACHIEVEMENT_COLORS: Record<string, { bg: string; border: string; glow: string }> = {
  firstJournal: { bg: '#E8F5E9', border: '#7BAE7F', glow: 'rgba(123,174,127,0.3)' },
  firstAction: { bg: '#E3F2FD', border: '#64B5F6', glow: 'rgba(100,181,246,0.3)' },
  streak7: { bg: '#FFF3E0', border: '#FFB74D', glow: 'rgba(255,183,77,0.3)' },
  streak30: { bg: '#FCE4EC', border: '#F48FB1', glow: 'rgba(244,143,177,0.3)' },
  puzzleComplete: { bg: '#ECEFF1', border: '#90A4AE', glow: 'rgba(144,164,174,0.3)' },
  share: { bg: '#F3E5F5', border: '#BA68C8', glow: 'rgba(186,104,200,0.3)' },
};

export default function AchievementsScreen() {
  const { achievements, unlockedCount, totalCount } = useAchievement();
  const [selected, setSelected] = useState<Achievement | null>(null);

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{STRINGS.achievementsTitle}</Text>
        <Text style={styles.headerSubtitle}>
          {STRINGS.achievementsCount
            .replace('{unlocked}', String(unlockedCount))
            .replace('{total}', String(totalCount))}
        </Text>
      </View>

      <View style={styles.grid}>
        {achievements.map((a) => {
          const colorset = ACHIEVEMENT_COLORS[a.type] || ACHIEVEMENT_COLORS.firstJournal;
          return (
            <Pressable
              key={a.id}
              onPress={() => a.isUnlocked && setSelected(a)}
              style={({ pressed }) => [
                styles.badgeWrap,
                { opacity: a.isUnlocked && pressed ? 0.85 : 1 },
              ]}
            >
              <View
                style={[
                  styles.badge,
                  a.isUnlocked
                    ? [
                        styles.badgeUnlocked,
                        {
                          backgroundColor: colorset.bg,
                          borderColor: colorset.border,
                          shadowColor: colorset.glow,
                        },
                      ]
                    : styles.badgeLocked,
                ]}
              >
                <View
                  style={[
                    styles.badgeInner,
                    a.isUnlocked ? { backgroundColor: colorset.border } : { backgroundColor: colors.bg2 },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeIcon,
                      { fontSize: a.isUnlocked ? 28 : 24, opacity: a.isUnlocked ? 1 : 0.3 },
                    ]}
                  >
                    {a.icon}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.badgeName,
                  { opacity: a.isUnlocked ? 1 : 0.5 },
                ]}
                numberOfLines={1}
              >
                {a.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {selected ? (
        <Modal
          visible={!!selected}
          transparent
          animationType="fade"
          onRequestClose={() => setSelected(null)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setSelected(null)}
          >
            <View style={styles.modalCard}>
              {(() => {
                const colorset = ACHIEVEMENT_COLORS[selected.type] || ACHIEVEMENT_COLORS.firstJournal;
                return (
                  <View
                    style={[
                      styles.bigBadge,
                      {
                        backgroundColor: colorset.bg,
                        borderColor: colorset.border,
                        shadowColor: colorset.glow,
                      },
                    ]}
                  >
                    <View style={[styles.bigBadgeInner, { backgroundColor: colorset.border }]}>
                      <Text style={styles.bigBadgeIcon}>{selected.icon}</Text>
                    </View>
                  </View>
                );
              })()}
              <Text style={styles.modalTitle}>{selected.name}</Text>
              <Text style={styles.modalDesc}>{selected.description}</Text>
              {selected.unlockedAt ? (
                <Text style={styles.modalDate}>
                  解锁于 {selected.unlockedAt.slice(0, 10)}
                </Text>
              ) : null}
              <View style={styles.modalActions}>
                <Button
                  title={STRINGS.share}
                  onPress={() => {}}
                  size="sm"
                  variant="secondary"
                />
                <Button title="关闭" onPress={() => setSelected(null)} size="sm" />
              </View>
            </View>
          </Pressable>
        </Modal>
      ) : null}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.h2,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.body,
    color: colors.muted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.sm,
  },
  badgeWrap: {
    width: '33.33%',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  badge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
  },
  badgeUnlocked: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  badgeLocked: {
    backgroundColor: colors.bg2,
    borderColor: colors.border,
    borderWidth: 1,
  },
  badgeInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeIcon: {
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  badgeName: {
    fontSize: fontSize.caption,
    color: colors.ink,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: radius.card,
    padding: spacing.xl,
    width: '100%',
    alignItems: 'center',
    ...shadows.card,
  },
  bigBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 3,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  bigBadgeInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigBadgeIcon: {
    fontSize: 44,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  modalTitle: {
    fontSize: fontSize.h3,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  modalDesc: {
    fontSize: fontSize.body,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  modalDate: {
    fontSize: fontSize.caption,
    color: colors.muted,
    marginBottom: spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
