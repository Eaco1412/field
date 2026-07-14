import { router } from 'expo-router';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { usePuzzle } from '../../src/hooks/usePuzzle';
import { STRINGS } from '../../src/constants/strings';
import { colors, fontSize, radius, shadows, spacing } from '../../src/theme';
import { PuzzleBoard } from '../../src/components/PuzzleBoard';

export default function PuzzlesScreen() {
  const { puzzles, completedCount, totalCount } = usePuzzle();

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{STRINGS.myPuzzles}</Text>
        <Text style={styles.headerSubtitle}>
          {STRINGS.puzzleCount.replace('{completed}', String(completedCount)).replace('{total}', String(totalCount))}
        </Text>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {puzzles.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => router.push(`/sub/puzzle-detail?id=${p.id}`)}
            style={({ pressed }) => [
              styles.card,
              { opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <View style={styles.cardContent}>
              <View style={styles.boardContainer}>
                <PuzzleBoard
                  completedPieces={p.completedPieces}
                  totalPieces={p.totalPieces}
                  isUnlocked={p.isUnlocked}
                  theme={p.theme}
                  illustration={p.illustration}
                  size="md"
                  imageUrl={p.imageUrl}
                />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.puzzleName}>{p.name}</Text>
                <Text style={styles.puzzleDesc} numberOfLines={2}>
                  {p.description}
                </Text>
                <View style={styles.progressRow}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${(p.completedPieces / p.totalPieces) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {p.completedPieces} / {p.totalPieces}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
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
  list: {
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boardContainer: {
    marginRight: spacing.md,
    flexShrink: 0,
  },
  cardInfo: {
    flex: 1,
    minWidth: 0,
  },
  puzzleName: {
    fontSize: fontSize.title,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  puzzleDesc: {
    fontSize: fontSize.body,
    color: colors.muted,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.bg2,
    borderRadius: 3,
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  progressText: {
    fontSize: fontSize.caption,
    color: colors.muted,
    fontWeight: '500',
    flexShrink: 0,
  },
});