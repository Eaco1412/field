/**
 * RevisitCard 回访卡片。
 * 多轮对话式交互：先问具体做了什么，再问感受，最后引导写日志。
 */

import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../theme';
import type { PendingAction } from '../services/types';
import { STRINGS } from '../constants/strings';
import { Button } from './Button';

interface RevisitCardProps {
  pending: PendingAction;
  onDone: (result: 'good' | 'okay' | 'notSuit', detail?: string) => void;
  onSkip: () => void;
  onWriteJournal?: (detail: string) => void;
}

type Step = 'ask' | 'feelings' | 'followUp' | 'done';

export function RevisitCard({ pending, onDone, onSkip, onWriteJournal }: RevisitCardProps) {
  const [step, setStep] = useState<Step>('ask');
  const [detail, setDetail] = useState('');
  const [feelingsResult, setFeelingsResult] = useState<'good' | 'okay' | 'notSuit'>('good');

  const questionText = STRINGS.revisitStepQuestion.replace('{action}', pending.title);

  const handleAskSubmit = () => {
    if (!detail.trim()) return;
    setStep('feelings');
  };

  const handleFeelings = (result: 'good' | 'okay' | 'notSuit') => {
    setFeelingsResult(result);
    setStep('followUp');
  };

  const handleWriteJournal = () => {
    onWriteJournal?.(detail);
    onDone(feelingsResult, detail);
    setStep('done');
  };

  const handleNoThanks = () => {
    onDone(feelingsResult, detail);
    setStep('done');
  };

  if (step === 'done') {
    return (
      <View style={[styles.card, styles.thanksCard]}>
        <Ionicons name="heart-outline" size={20} color={colors.accent} />
        <Text style={styles.thanksText}>{STRINGS.revisitThanks}</Text>
      </View>
    );
  }

  if (step === 'followUp') {
    return (
      <View style={styles.card}>
        <View style={styles.bubbleRow}>
          <View style={styles.aiAvatar}>
            <Ionicons name="chatbubble-ellipses" size={14} color="#fff" />
          </View>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{STRINGS.revisitFollowUp}</Text>
          </View>
        </View>
        <View style={styles.followUpActions}>
          <Button
            title={STRINGS.revisitWriteJournal}
            size="sm"
            onPress={handleWriteJournal}
          />
          <Button
            title={STRINGS.revisitNoThanks}
            size="sm"
            variant="ghost"
            onPress={handleNoThanks}
          />
        </View>
      </View>
    );
  }

  if (step === 'feelings') {
    return (
      <View style={styles.card}>
        <View style={styles.bubbleRow}>
          <View style={styles.aiAvatar}>
            <Ionicons name="chatbubble-ellipses" size={14} color="#fff" />
          </View>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>
              {detail.trim() ? `「${detail.trim()}」——` : ''}
              {STRINGS.revisitAskDetail}
            </Text>
          </View>
        </View>
        <View style={styles.options}>
          <Button
            title={STRINGS.revisitGood}
            size="sm"
            variant="secondary"
            onPress={() => handleFeelings('good')}
          />
          <Button
            title={STRINGS.revisitOkay}
            size="sm"
            variant="ghost"
            onPress={() => handleFeelings('okay')}
          />
          <Button
            title={STRINGS.revisitNotSuit}
            size="sm"
            variant="ghost"
            onPress={() => handleFeelings('notSuit')}
          />
        </View>
      </View>
    );
  }

  // step === 'ask'
  return (
    <View style={styles.card}>
      <View style={styles.bubbleRow}>
        <View style={styles.aiAvatar}>
          <Ionicons name="chatbubble-ellipses" size={14} color="#fff" />
        </View>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{questionText}</Text>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder={STRINGS.revisitStepQuestionPlaceholder}
        placeholderTextColor={colors.muted}
        multiline
        value={detail}
        onChangeText={setDetail}
        maxLength={300}
      />

      <View style={styles.askActions}>
        <Pressable
          onPress={onSkip}
          style={({ pressed }) => [styles.skipBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={styles.skipText}>{STRINGS.skip}</Text>
        </Pressable>
        <Button
          title={STRINGS.send}
          size="sm"
          onPress={handleAskSubmit}
          disabled={!detail.trim()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E3F2FD',
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  thanksCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  thanksText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.body,
    color: colors.accent,
    fontWeight: '500',
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  bubbleText: {
    fontSize: fontSize.body,
    color: colors.ink,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.body,
    color: colors.ink,
    minHeight: 44,
    textAlignVertical: 'top',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(100,181,246,0.2)',
  },
  askActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  skipText: {
    fontSize: fontSize.caption,
    color: colors.muted,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  followUpActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
