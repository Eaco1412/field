/**
 * 设置页：行动推荐开关、回访开关、卡片数量、心情评分偏好、隐私加锁、清除数据。
 */

import { useState } from 'react';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View, Switch, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { useApp } from '../../src/context/AppContext';
import { STRINGS } from '../../src/constants/strings';
import { colors, fontSize, radius, spacing } from '../../src/theme';
import type { UserSettings } from '../../src/services/types';
import { AI_MODELS, AI_ENABLED } from '../../src/config/ai';
import type { AiModelId } from '../../src/config/ai';

interface SettingRowProps {
  label: string;
  subtitle?: string;
  right?: ReactNode;
  onPress?: () => void;
}

function SettingRow({ label, subtitle, right, onPress }: SettingRowProps) {
  const Content = (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.rowRight}>{right}</View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
        {Content}
      </Pressable>
    );
  }
  return Content;
}

function SettingDivider() {
  return <View style={styles.divider} />;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { state, updateSettings, resetAll } = useApp();
  const { settings } = state;

  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  const handleToggle = (key: keyof Pick<UserSettings, 'actionRecommendationEnabled' | 'revisitEnabled' | 'privacyLockEnabled'>) => {
    const next = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(next);
    updateSettings({ [key]: !localSettings[key] });
  };

  const cycleCardCount = () => {
    const counts: UserSettings['cardCount'][] = [3, 4, 5, 6];
    const idx = counts.indexOf(localSettings.cardCount);
    const next = counts[(idx + 1) % counts.length];
    setLocalSettings({ ...localSettings, cardCount: next });
    updateSettings({ cardCount: next });
  };

  const cycleMoodMode = () => {
    const modes: UserSettings['moodScoreMode'][] = ['manual', 'auto', 'combined'];
    const idx = modes.indexOf(localSettings.moodScoreMode);
    const next = modes[(idx + 1) % modes.length];
    setLocalSettings({ ...localSettings, moodScoreMode: next });
    updateSettings({ moodScoreMode: next });
  };

  const moodModeLabel =
    localSettings.moodScoreMode === 'manual'
      ? STRINGS.moodManual
      : localSettings.moodScoreMode === 'auto'
        ? STRINGS.moodAuto
        : STRINGS.moodCombined;

  const cycleAiModel = () => {
    const ids = AI_MODELS.map((m) => m.id);
    const idx = ids.indexOf(localSettings.aiModel);
    const next: AiModelId = ids[(idx + 1) % ids.length];
    setLocalSettings({ ...localSettings, aiModel: next });
    updateSettings({ aiModel: next });
  };

  const handleClear = () => {
    Alert.alert('确认清除', STRINGS.clearConfirm, [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        style: 'destructive',
        onPress: async () => {
          await resetAll();
          router.back();
        },
      },
    ]);
  };

  return (
    <ScreenWrapper>
      <View style={styles.group}>
        <SettingRow
          label={STRINGS.settingsActionRec}
          right={
            <Switch
              value={localSettings.actionRecommendationEnabled}
              onValueChange={() => handleToggle('actionRecommendationEnabled')}
              trackColor={{ false: colors.border, true: colors.accentLight }}
              thumbColor={localSettings.actionRecommendationEnabled ? colors.accent : '#fff'}
            />
          }
        />
        <SettingDivider />
        <SettingRow
          label={STRINGS.settingsRevisit}
          right={
            <Switch
              value={localSettings.revisitEnabled}
              onValueChange={() => handleToggle('revisitEnabled')}
              trackColor={{ false: colors.border, true: colors.accentLight }}
              thumbColor={localSettings.revisitEnabled ? colors.accent : '#fff'}
            />
          }
        />
        <SettingDivider />
        <SettingRow
          label={STRINGS.settingsCardCount}
          right={
            <Pressable onPress={cycleCardCount} style={styles.optionBtn}>
              <Text style={styles.optionText}>{localSettings.cardCount} 张</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </Pressable>
          }
        />
        <SettingDivider />
        <SettingRow
          label={STRINGS.settingsMoodMode}
          right={
            <Pressable onPress={cycleMoodMode} style={styles.optionBtn}>
              <Text style={styles.optionText}>{moodModeLabel}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </Pressable>
          }
        />
        <SettingDivider />
        <SettingRow
          label={STRINGS.settingsPrivacyLock}
          right={
            <Switch
              value={localSettings.privacyLockEnabled}
              onValueChange={() => handleToggle('privacyLockEnabled')}
              trackColor={{ false: colors.border, true: colors.accentLight }}
              thumbColor={localSettings.privacyLockEnabled ? colors.accent : '#fff'}
            />
          }
        />
        {AI_ENABLED && (
          <>
            <SettingDivider />
            <SettingRow
              label={STRINGS.settingsAiModel}
              subtitle={AI_MODELS.find((m) => m.id === localSettings.aiModel)?.desc}
              right={
                <Pressable onPress={cycleAiModel} style={styles.optionBtn}>
                  <Text style={styles.optionText}>
                    {AI_MODELS.find((m) => m.id === localSettings.aiModel)?.label ?? localSettings.aiModel}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.muted} />
                </Pressable>
              }
            />
          </>
        )}
      </View>

      <View style={styles.group}>
        <SettingRow label={STRINGS.settingsAbout} subtitle={STRINGS.aboutDesc} />
      </View>

      <View style={[styles.group, { marginTop: spacing.xl }]}>
        <Pressable
          onPress={handleClear}
          style={({ pressed }) => [styles.clearBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={styles.clearText}>{STRINGS.settingsClear}</Text>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  group: {
    backgroundColor: colors.cardBg ?? '#FFFFFF',
    borderRadius: radius.card,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  rowLabel: {
    fontSize: fontSize.body,
    color: colors.ink,
    fontWeight: '500',
  },
  rowSubtitle: {
    fontSize: fontSize.caption,
    color: colors.muted,
    marginTop: 2,
    lineHeight: 16,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 0,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: fontSize.body,
    color: colors.muted,
    marginRight: spacing.xs,
  },
  clearBtn: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  clearText: {
    fontSize: fontSize.body,
    color: colors.danger,
    fontWeight: '500',
  },
});
