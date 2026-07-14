/**
 * 首页：问候 + 写心事（输入框为主体）+ 今日卡片推荐 + 推荐内容。
 */

import { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { RevisitCard } from '../../src/components/RevisitCard';
import { SupportCard } from '../../src/components/SupportCard';
import { RecCard } from '../../src/components/RecCard';
import { CrisisCard } from '../../src/components/CrisisCard';
import { SectionHeader } from '../../src/components/SectionHeader';
import { MoodStars } from '../../src/components/MoodStars';
import { Pill } from '../../src/components/Pill';
import { useJournal } from '../../src/hooks/useJournal';
import { useRecommendations } from '../../src/hooks/useRecommendations';
import { useApp } from '../../src/context/AppContext';
import { STRINGS } from '../../src/constants/strings';
import { colors, fontSize, radius, spacing } from '../../src/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const INPUT_AREA_HEIGHT = SCREEN_HEIGHT * 0.65;

function greetByHour(): string {
  const h = new Date().getHours();
  if (h < 6) return '凌晨好';
  if (h < 12) return '早上好';
  if (h < 14) return '中午好';
  if (h < 18) return '下午好';
  return '晚上好';
}

export default function HomeScreen() {
  const {
    submitJournal,
    todayJournal,
    pendingRevisit,
    replaceAllCards,
  } = useJournal();
  const { pickRandom, tryItem, completeItem, isInProgress, isCompleted } = useRecommendations();
  const { state, completeAction, removePendingAction } = useApp();

  const [content, setContent] = useState('');
  const [mood, setMood] = useState<number | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const todayRecs = useMemo(() => {
    const items = pickRandom(4);
    return items.sort((a, b) => {
      const aDone = isCompleted(a.id) ? 1 : 0;
      const bDone = isCompleted(b.id) ? 1 : 0;
      return aDone - bDone;
    });
  }, [pickRandom, isCompleted]);

  const canSubmit = content.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await submitJournal({
        content: content.trim(),
        mode: 'full',
        mood,
        userTags: selectedTags,
      });
      setContent('');
      setMood(undefined);
      setSelectedTags([]);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleRevisitDone = (result: 'good' | 'okay' | 'notSuit') => {
    if (!pendingRevisit) return;
    if (result === 'good' || result === 'okay') {
      completeAction(pendingRevisit.id);
    } else {
      removePendingAction(pendingRevisit.id);
    }
  };

  const handleRevisitSkip = () => {
    if (!pendingRevisit) return;
    removePendingAction(pendingRevisit.id);
  };

  const handleRevisitWriteJournal = (detail: string) => {
    setContent(detail);
  };

  const handleReplaceAll = () => {
    if (!todayJournal) return;
    replaceAllCards(todayJournal.id);
  };

  const isCrisis = todayJournal?.riskLevel === 'crisis';
  const hasJournal = !!todayJournal;

  return (
    <ScreenWrapper>
      <View style={styles.topBar}>
        <Text style={styles.appName}>{STRINGS.appName}</Text>
        <Text style={styles.greeting}>{greetByHour()} ～</Text>
      </View>

      {state.settings.revisitEnabled && pendingRevisit ? (
        <RevisitCard
          pending={pendingRevisit}
          onDone={handleRevisitDone}
          onSkip={handleRevisitSkip}
          onWriteJournal={handleRevisitWriteJournal}
        />
      ) : null}

      <View style={styles.writeArea}>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder={`${STRINGS.homeWritePrompt}\n${STRINGS.homeInputPlaceholder}`}
            placeholderTextColor={colors.muted}
            multiline
            value={content}
            onChangeText={setContent}
          />
          <View style={styles.inputBottom}>
            <Pressable
              onPress={() => setShowTags((v) => !v)}
              style={({ pressed }) => [styles.tagBtn, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Ionicons name="pricetag-outline" size={16} color={colors.muted} />
              <Text style={styles.tagBtnText}>{STRINGS.homeMoodTag}</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={({ pressed }) => [
                styles.sendBtn,
                { opacity: canSubmit ? (pressed ? 0.8 : 1) : 0.4 },
              ]}
            >
              {submitting ? (
                <View style={styles.sendLoading}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.sendBtnText}>{STRINGS.analyzing}</Text>
                </View>
              ) : (
                <Text style={styles.sendBtnText}>{STRINGS.send}</Text>
              )}
            </Pressable>
          </View>
        </View>

        {showTags ? (
          <View style={styles.tagPicker}>
            {STRINGS.tags.map((tag) => (
              <Pressable
                key={tag}
                onPress={() => toggleTag(tag)}
                style={{ marginRight: spacing.sm, marginBottom: spacing.sm }}
              >
                <Pill
                  label={tag}
                  active={selectedTags.includes(tag)}
                />
              </Pressable>
            ))}
          </View>
        ) : null}

        {selectedTags.length > 0 && !showTags ? (
          <View style={styles.selectedTags}>
            {selectedTags.map((t) => (
              <Pill key={t} label={t} active style={{ marginRight: spacing.sm, marginBottom: spacing.sm }} />
            ))}
          </View>
        ) : null}

        <View style={styles.moodRow}>
          <Text style={styles.moodLabel}>{STRINGS.homeMoodScore}</Text>
          <MoodStars value={mood} onChange={setMood} size={18} />
        </View>
      </View>

      {!hasJournal && (
        <View>
          <SectionHeader title={STRINGS.homeTodayRecs} />
          {todayRecs.map((item) => (
            <RecCard
              key={item.id}
              item={item}
              inProgress={isInProgress(item.id)}
              completed={isCompleted(item.id)}
              onTry={() => tryItem(item)}
              onComplete={() => completeItem(item.id)}
            />
          ))}
        </View>
      )}

      {state.settings.actionRecommendationEnabled &&
      todayJournal &&
      todayJournal.mode === 'full' &&
      todayJournal.cards ? (
        <View>
          <SectionHeader
            right={
              !isCrisis ? (
                <Pressable
                  onPress={handleReplaceAll}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <Text style={styles.changeAllText}>{STRINGS.changeAll}</Text>
                </Pressable>
              ) : null
            }
          />

          {isCrisis && todayJournal.cards.crisisInfo ? (
            <CrisisCard
              info={todayJournal.cards.crisisInfo}
              onSave={() => {}}
            />
          ) : (
            <>
              <SupportCard card={todayJournal.cards!.understanding} />
              <SupportCard card={todayJournal.cards!.action} />
              <SupportCard card={todayJournal.cards!.help} />
            </>
          )}
        </View>
      ) : null}

      {hasJournal && todayJournal?.mode === 'full' && (
        <View>
          <SectionHeader title={STRINGS.homeTodayRecs} />
          {todayRecs.map((item) => (
            <RecCard
              key={item.id}
              item={item}
              inProgress={isInProgress(item.id)}
              completed={isCompleted(item.id)}
              onTry={() => tryItem(item)}
              onComplete={() => completeItem(item.id)}
            />
          ))}
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingTop: spacing.xl,
  },
  appName: {
    fontSize: fontSize.h3,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: 0.5,
  },
  greeting: {
    fontSize: fontSize.body,
    color: colors.muted,
    fontWeight: '500',
  },
  writeArea: {
    marginBottom: spacing.md,
    height: INPUT_AREA_HEIGHT,
  },
  inputWrap: {
    backgroundColor: '#fff',
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    fontSize: fontSize.body,
    color: colors.ink,
    textAlignVertical: 'top',
    flex: 1,
    lineHeight: 24,
  },
  inputBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  tagBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(123,174,127,0.08)',
    justifyContent: 'flex-start',
  },
  tagBtnText: {
    fontSize: fontSize.caption,
    color: colors.muted,
    marginLeft: 4,
    fontWeight: '400',
  },
  sendBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  sendBtnText: {
    fontSize: fontSize.body,
    color: '#fff',
    fontWeight: '600',
  },
  sendLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: spacing.sm,
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: spacing.sm,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  moodLabel: {
    fontSize: fontSize.caption,
    color: colors.muted,
    fontWeight: '400',
  },
  changeAllText: {
    fontSize: fontSize.caption,
    color: colors.accent,
    fontWeight: '500',
  },
});
