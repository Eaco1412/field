/**
 * CrisisCard 高危响应卡片。
 * 仅在 riskLevel === 'crisis' 时展示，红色预警风格，突出心理援助热线与求助话术。
 * 安全第一：绝不展示行动推荐。
 */

import { StyleSheet, Text, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../theme';
import type { CrisisInfo } from '../services/types';
import { STRINGS } from '../constants/strings';
import { Button } from './Button';

interface CrisisCardProps {
  info: CrisisInfo;
  onSave?: () => void;
}

export function CrisisCard({ info, onSave }: CrisisCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Ionicons name="heart" size={24} color="#fff" />
        </View>
        <Text style={styles.message}>{info.message}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{STRINGS.crisisHotline}</Text>
        {info.hotlines.map((h) => (
          <View key={h.number} style={styles.hotlineRow}>
            <Ionicons name="call-outline" size={18} color={colors.danger} />
            <Text style={styles.hotlineNumber}>{h.number}</Text>
            <Text style={styles.hotlineName}>{h.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{STRINGS.crisisTalkTitle}</Text>
        <View style={styles.talkBubble}>
          <Text style={styles.talkText}>{info.talkTemplate}</Text>
        </View>
      </View>

      <Button
        title={STRINGS.crisisSaveInfo}
        variant="danger"
        size="md"
        onPress={() => {
          onSave?.();
          Alert.alert('已保存', '求助信息已保存到本地，随时可以查看。');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFEBEE',
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  message: {
    flex: 1,
    fontSize: fontSize.title,
    fontWeight: '600',
    color: colors.danger,
    lineHeight: 24,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.body,
    fontWeight: '600',
    color: colors.danger,
    marginBottom: spacing.sm,
  },
  hotlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  hotlineNumber: {
    fontSize: fontSize.title,
    fontWeight: '700',
    color: colors.danger,
    marginHorizontal: spacing.sm,
  },
  hotlineName: {
    fontSize: fontSize.caption,
    color: colors.muted,
  },
  talkBubble: {
    backgroundColor: '#fff',
    borderRadius: radius.card,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
  },
  talkText: {
    fontSize: fontSize.body,
    color: colors.ink,
    lineHeight: 22,
    fontStyle: 'italic',
  },
});
