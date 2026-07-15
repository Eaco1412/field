/**
 * 手账页：月度情绪曲线、行动完成数、拼图、最共鸣卡片、自动回顾。
 */

import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { useJournalBook } from '../../src/hooks/useJournalBook';
import { STRINGS } from '../../src/constants/strings';
import { colors, fontSize, radius, shadows, spacing } from '../../src/theme';
import { Button } from '../../src/components/Button';

export default function JournalBookScreen() {
  const { currentMonthEntry, currentMonth, totalActions, totalJournals } = useJournalBook();
  const [view, setView] = useState<'month' | 'year'>('month');

  const screenWidth = Dimensions.get('window').width - spacing.lg * 2 - spacing.lg;

  // 构造图表数据：取当月最多 30 天的心情
  const chartData = {
    labels: currentMonthEntry.moodCurve.slice(-7).map((m) => m.date.slice(8)),
    datasets: [
      {
        data:
          currentMonthEntry.moodCurve.length > 0
            ? currentMonthEntry.moodCurve.slice(-7).map((m) => m.mood)
            : [3],
      },
    ],
  };

  return (
    <ScreenWrapper>
      {/* 顶部分页 */}
      <View style={styles.segment}>
        <Pressable
          onPress={() => setView('month')}
          style={[styles.segItem, view === 'month' ? styles.segActive : null]}
        >
          <Text style={[styles.segText, view === 'month' ? styles.segTextActive : null]}>
            {STRINGS.bookMonthly}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setView('year')}
          style={[styles.segItem, view === 'year' ? styles.segActive : null]}
        >
          <Text style={[styles.segText, view === 'year' ? styles.segTextActive : null]}>
            {STRINGS.bookYearly}
          </Text>
        </Pressable>
      </View>

      {view === 'month' ? (
        <>
          {/* 月份切换 */}
          <View style={styles.monthRow}>
            <Ionicons name="chevron-back" size={20} color={colors.ink} />
            <Text style={styles.monthText}>{currentMonth}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </View>

          {/* 数据卡片 */}
          <View style={styles.statsRow}>
            <StatCard label={STRINGS.bookCompletedActions} value={currentMonthEntry.completedActions} icon="checkmark-circle" />
            <StatCard label="解锁拼图碎片" value={currentMonthEntry.unlockedPuzzles} icon="grid" />
          </View>

          {/* 情绪曲线 */}
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>{STRINGS.bookMoodCurve}</Text>
            <LineChart
              data={chartData}
              width={screenWidth - spacing.md * 2}
              height={160}
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(123, 174, 127, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(158, 158, 158, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: '4', strokeWidth: '2', stroke: colors.accent },
                // @ts-expect-error minY 在运行时支持但类型定义中不存在
                minY: 1,
                maxY: 5,
              }}
              bezier
              style={{ borderRadius: radius.card, marginVertical: spacing.sm }}
            />
          </View>

          {/* 最有共鸣卡片 */}
          <View style={styles.sectionCard}>
            <Text style={styles.cardTitle}>{STRINGS.bookTopCard}</Text>
            <View style={styles.quoteBox}>
              <Text style={styles.quoteText}>{currentMonthEntry.topResonatedCard}</Text>
            </View>
          </View>

          {/* 月度回顾 */}
          <View style={styles.sectionCard}>
            <Text style={styles.cardTitle}>{STRINGS.bookReview}</Text>
            <Text style={styles.reviewText}>{currentMonthEntry.autoReview}</Text>
          </View>

          <Button title={STRINGS.export} onPress={() => {}} variant="secondary" />
        </>
      ) : (
        <YearSummary totalJournals={totalJournals} totalActions={totalActions} />
      )}
    </ScreenWrapper>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={24} color={colors.accent} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function YearSummary({ totalJournals, totalActions }: { totalJournals: number; totalActions: number }) {
  return (
    <View style={styles.yearCard}>
      <Text style={styles.yearTitle}>年度概览</Text>
      <View style={styles.yearStatRow}>
        <View style={styles.yearStat}>
          <Text style={styles.yearNum}>{totalJournals}</Text>
          <Text style={styles.yearLabel}>次心事记录</Text>
        </View>
        <View style={styles.yearStat}>
          <Text style={styles.yearNum}>{totalActions}</Text>
          <Text style={styles.yearLabel}>个小行动</Text>
        </View>
      </View>
      <Text style={styles.yearDesc}>
        这一年，你在星野里走了很远的路。{'\n'}
        每一次记录、每一个小行动，{'\n'}
        都是你认真生活的证明。
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.bg2,
    borderRadius: radius.pill,
    padding: 4,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  segItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
  },
  segActive: {
    backgroundColor: '#fff',
    ...shadows.soft,
  },
  segText: {
    fontSize: fontSize.body,
    color: colors.muted,
    fontWeight: '500',
  },
  segTextActive: {
    color: colors.accent,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  monthText: {
    fontSize: fontSize.h3,
    fontWeight: '600',
    color: colors.ink,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardBg ?? '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.card,
  },
  statValue: {
    fontSize: fontSize.h2,
    fontWeight: '700',
    color: colors.ink,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: fontSize.caption,
    color: colors.muted,
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: colors.cardBg ?? '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  sectionCard: {
    backgroundColor: colors.cardBg ?? '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  cardTitle: {
    fontSize: fontSize.body,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  quoteBox: {
    backgroundColor: colors.bg2,
    borderRadius: radius.button,
    padding: spacing.md,
  },
  quoteText: {
    fontSize: fontSize.body,
    color: colors.ink,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  reviewText: {
    fontSize: fontSize.body,
    color: colors.ink,
    lineHeight: 24,
  },
  yearCard: {
    backgroundColor: colors.cardBg ?? '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.card,
  },
  yearTitle: {
    fontSize: fontSize.h3,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.lg,
  },
  yearStatRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  yearStat: {
    flex: 1,
    alignItems: 'center',
  },
  yearNum: {
    fontSize: fontSize.h1,
    fontWeight: '700',
    color: colors.accent,
  },
  yearLabel: {
    fontSize: fontSize.caption,
    color: colors.muted,
    marginTop: 4,
  },
  yearDesc: {
    fontSize: fontSize.body,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 24,
  },
});
