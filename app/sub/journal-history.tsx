/**
 * 历史日志页：日历视图 + 当日日志列表 + 日志详情。
 */

import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { SupportCard } from '../../src/components/SupportCard';
import { CrisisCard } from '../../src/components/CrisisCard';
import { MoodStars } from '../../src/components/MoodStars';
import { Pill } from '../../src/components/Pill';
import { useJournal } from '../../src/hooks/useJournal';
import { STRINGS } from '../../src/constants/strings';
import { colors, fontSize, radius, spacing } from '../../src/theme';
import type { JournalEntry } from '../../src/services/types';

function buildCalendarMatrix(year: number, month: number): (Date | null)[] {
  // month: 0-11
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const firstWeekday = firstDay.getDay(); // 0=周日
  const result: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) {
    result.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    result.push(new Date(year, month, d));
  }
  return result;
}

const WEEK_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

export default function JournalHistoryScreen() {
  const { recordedDates, getByDate } = useJournal();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-11
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = today;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate(),
    ).padStart(2, '0')}`;
  });

  const calendarMatrix = useMemo(() => buildCalendarMatrix(year, month), [year, month]);
  const recordedSet = useMemo(() => new Set(recordedDates), [recordedDates]);
  const dayJournals = useMemo(() => getByDate(selectedDate), [getByDate, selectedDate]);

  const goPrevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const isSameDay = (d: Date, dateStr: string): boolean => {
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate(),
    ).padStart(2, '0')}`;
    return ds === dateStr;
  };

  const toDateStr = (d: Date): string =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate(),
    ).padStart(2, '0')}`;

  return (
    <ScreenWrapper>
      {/* 日历 */}
      <View style={styles.calendarCard}>
        <View style={styles.calHeader}>
          <Pressable onPress={goPrevMonth}>
            <Ionicons name="chevron-back" size={22} color={colors.ink} />
          </Pressable>
          <Text style={styles.calTitle}>
            {year}年 {month + 1}月
          </Text>
          <Pressable onPress={goNextMonth}>
            <Ionicons name="chevron-forward" size={22} color={colors.ink} />
          </Pressable>
        </View>

        <View style={styles.weekRow}>
          {WEEK_LABELS.map((w) => (
            <Text key={w} style={styles.weekLabel}>
              {w}
            </Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {calendarMatrix.map((d, idx) => {
            if (!d) return <View key={idx} style={styles.dayCell} />;
            const ds = toDateStr(d);
            const hasRecord = recordedSet.has(ds);
            const selected = isSameDay(d, selectedDate);
            return (
              <Pressable
                key={idx}
                onPress={() => setSelectedDate(ds)}
                style={({ pressed }) => [
                  styles.dayCell,
                  selected && styles.daySelected,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text
                  style={{
                    fontSize: fontSize.body,
                    color: selected ? '#fff' : colors.ink,
                    fontWeight: selected ? '600' : '400',
                  }}
                >
                  {d.getDate()}
                </Text>
                {hasRecord ? (
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: selected ? '#fff' : colors.accent },
                    ]}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 选中日期的日志 */}
      <View style={{ marginTop: spacing.lg }}>
        <Text style={styles.sectionTitle}>
          {selectedDate} · {dayJournals.length} 条记录
        </Text>
      </View>

      {dayJournals.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>{STRINGS.historyNoRecord}</Text>
        </View>
      ) : (
        dayJournals.map((entry) => (
          <JournalDetailItem
            key={entry.id}
            entry={entry}
          />
        ))
      )}
    </ScreenWrapper>
  );
}

interface DetailItemProps {
  entry: JournalEntry;
}

function JournalDetailItem({ entry }: DetailItemProps) {
  const [expanded, setExpanded] = useState(false);
  const isCrisis = entry.riskLevel === 'crisis';

  return (
    <View style={styles.journalCard}>
      <View style={styles.journalHeader}>
        <Text style={styles.journalTime}>{entry.time}</Text>
        <View style={styles.tagRow}>
          {entry.userTags.map((t) => (
            <Pill key={t} label={t} size="sm" style={{ marginLeft: spacing.sm }} />
          ))}
        </View>
      </View>

      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>{entry.content}</Text>
      </View>

      {entry.mood ? (
        <View style={styles.moodRow}>
          <Text style={styles.moodLabel}>心情：</Text>
          <MoodStars value={entry.mood} size={16} readOnly />
        </View>
      ) : null}

      {entry.analysis ? (
        <Pressable
          onPress={() => setExpanded((v) => !v)}
          style={styles.aiRow}
        >
          <Text style={styles.aiLabel}>AI 的理解</Text>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.muted}
          />
        </Pressable>
      ) : null}

      {expanded && entry.analysis ? (
        <Text style={styles.aiText}>{entry.analysis}</Text>
      ) : null}

      {expanded && entry.cards && entry.mode === 'full' ? (
        <View style={{ marginTop: spacing.md }}>
          {isCrisis && entry.cards.crisisInfo ? (
            <CrisisCard info={entry.cards.crisisInfo} />
          ) : (
            <>
              <SupportCard card={entry.cards.understanding} />
              <SupportCard card={entry.cards.action} />
              <SupportCard card={entry.cards.help} />
            </>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  calendarCard: {
    backgroundColor: colors.cardBg ?? '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.md,
  },
  calHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  calTitle: {
    fontSize: fontSize.title,
    fontWeight: '600',
    color: colors.ink,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSize.caption,
    color: colors.muted,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  daySelected: {
    backgroundColor: colors.accent,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: fontSize.body,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  emptyBox: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.body,
    color: colors.muted,
  },
  journalCard: {
    backgroundColor: colors.cardBg ?? '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  journalTime: {
    fontSize: fontSize.caption,
    color: colors.muted,
  },
  tagRow: {
    flexDirection: 'row',
  },
  quoteBox: {
    backgroundColor: colors.bg2,
    borderRadius: radius.button,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  quoteText: {
    fontSize: fontSize.body,
    color: colors.ink,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  moodLabel: {
    fontSize: fontSize.caption,
    color: colors.muted,
    marginRight: spacing.sm,
  },
  aiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  aiLabel: {
    fontSize: fontSize.caption,
    color: colors.accent,
    fontWeight: '500',
  },
  aiText: {
    fontSize: fontSize.body,
    color: colors.ink,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
});
