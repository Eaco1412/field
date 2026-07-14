import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { usePuzzle } from '../../src/hooks/usePuzzle';
import { colors, fontSize, radius, shadows, spacing } from '../../src/theme';
import { PuzzleBoard } from '../../src/components/PuzzleBoard';
import { Button } from '../../src/components/Button';
import { STRINGS } from '../../src/constants/strings';

export default function PuzzleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { puzzles } = usePuzzle();
  
  const puzzle = puzzles.find((p) => p.id === id);
  
  if (!puzzle) {
    return (
      <ScreenWrapper>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>拼图不存在</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const progress = Math.round((puzzle.completedPieces / puzzle.totalPieces) * 100);

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.boardContainer}>
          <PuzzleBoard
            completedPieces={puzzle.completedPieces}
            totalPieces={puzzle.totalPieces}
            isUnlocked={puzzle.isUnlocked}
            theme={puzzle.theme}
            illustration={puzzle.illustration}
            size="lg"
            imageUrl={puzzle.imageUrl}
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.title}>{puzzle.name}</Text>
          <Text style={styles.description}>{puzzle.description}</Text>
          
          <View style={styles.progressSection}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>完成进度</Text>
              <Text style={styles.progressValue}>{progress}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${progress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>
              {puzzle.completedPieces} / {puzzle.totalPieces} 块
            </Text>
          </View>

          {puzzle.isUnlocked ? (
            <Button
              title={STRINGS.share}
              onPress={() => {}}
              size="lg"
              variant="secondary"
            />
          ) : (
            <Text style={styles.unlockedTip}>
              完成 {puzzle.totalPieces} 个行动即可解锁完整拼图
            </Text>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.body,
    color: colors.muted,
  },
  boardContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    backgroundColor: '#fff',
    borderRadius: radius.card,
    padding: spacing.md,
    ...shadows.card,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: radius.card,
    padding: spacing.lg,
    ...shadows.card,
  },
  title: {
    fontSize: fontSize.h2,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSize.body,
    color: colors.muted,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  progressSection: {
    marginBottom: spacing.lg,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    fontSize: fontSize.title,
    fontWeight: '600',
    color: colors.ink,
  },
  progressValue: {
    fontSize: fontSize.title,
    fontWeight: '700',
    color: colors.accent,
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.bg2,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 5,
  },
  progressText: {
    fontSize: fontSize.caption,
    color: colors.muted,
    textAlign: 'center',
  },
  unlockedTip: {
    fontSize: fontSize.body,
    color: colors.muted,
    textAlign: 'center',
    padding: spacing.md,
    backgroundColor: colors.bg2,
    borderRadius: radius.sm,
  },
});