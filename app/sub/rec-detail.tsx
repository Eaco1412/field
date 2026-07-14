/**
 * 推荐详情页：展示推荐项的详细信息。
 * 包括来源、亮点特色、推荐理由、如何开始。
 */

import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { Pill } from '../../src/components/Pill';
import { colors, fontSize, radius, spacing } from '../../src/theme';
import { STRINGS } from '../../src/constants/strings';
import { recommendationService } from '../../src/services';
import type { RecCategory } from '../../src/services/types';

const CATEGORY_TINT: Record<RecCategory, { bg: string; text: string; icon: string }> = {
  action: { bg: '#E8F5E9', text: colors.green, icon: 'leaf-outline' },
  content: { bg: '#E3F2FD', text: colors.blue, icon: 'book-outline' },
  habit: { bg: '#FFF3E0', text: colors.orange, icon: 'repeat-outline' },
  theme: { bg: '#F3E5F5', text: '#9575CD', icon: 'sparkles-outline' },
  music: { bg: '#FCE4EC', text: '#E91E63', icon: 'musical-note' },
  nature: { bg: '#E0F7FA', text: '#009688', icon: 'eye-outline' },
  creativity: { bg: '#FFF3E0', text: '#FF9800', icon: 'brush' },
  mindfulness: { bg: '#ECEFF1', text: '#607D8B', icon: 'flower-outline' },
  reading: { bg: '#E3F2FD', text: '#3F51B5', icon: 'library' },
  community: { bg: '#FCE4EC', text: '#F48FB1', icon: 'heart-outline' },
  body: { bg: '#E8F5E9', text: '#4CAF50', icon: 'fitness' },
  growth: { bg: '#E3F2FD', text: '#2196F3', icon: 'trending-up' },
};

export default function RecDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = recommendationService.getById(id);

  if (!item) {
    return (
      <ScreenWrapper scroll={false}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>推荐内容不存在</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const tint = CATEGORY_TINT[item.category];
  const detail = item.detail;

  return (
    <ScreenWrapper>
      {/* 头部卡片 */}
      <View style={[styles.heroCard, { backgroundColor: tint.bg }]}>
        <View style={styles.heroIconBox}>
          <Ionicons name={tint.icon as keyof typeof Ionicons.glyphMap} size={28} color={tint.text} />
        </View>
        <Text style={styles.heroTitle}>{item.title}</Text>
        <Text style={styles.heroDesc}>{item.description}</Text>
        {detail?.source ? (
          <View style={styles.sourceRow}>
            <Ionicons name="link-outline" size={14} color={colors.muted} />
            <Text style={styles.sourceText}>
              {STRINGS.recDetailSource}：{detail.source}
            </Text>
          </View>
        ) : null}
      </View>

      {/* 标签 */}
      <View style={styles.tagsRow}>
        {item.tags.map((tag) => (
          <Pill key={tag} label={tag} size="sm" />
        ))}
        {item.puzzleId ? (
          <Pill
            label={`🧩 ${item.puzzlePieces ?? 1}块`}
            size="sm"
            color={colors.accent}
            bgColor={colors.accentLight}
          />
        ) : null}
        {item.habitDays ? (
          <Pill
            label={`📅 ${item.habitDays}天`}
            size="sm"
            color={colors.orange}
            bgColor="#FFF3E0"
          />
        ) : null}
      </View>

      {/* 亮点特色 */}
      {detail?.highlights && detail.highlights.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bulb-outline" size={18} color={colors.accent} />
            <Text style={styles.sectionTitle}>{STRINGS.recDetailHighlights}</Text>
          </View>
          {detail.highlights.map((h, i) => (
            <View key={i} style={styles.bulletItem}>
              <View style={[styles.bulletDot, { backgroundColor: tint.text }]} />
              <Text style={styles.bulletText}>{h}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* 推荐理由 */}
      {detail?.reason ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="heart-outline" size={18} color={colors.accent} />
            <Text style={styles.sectionTitle}>{STRINGS.recDetailReason}</Text>
          </View>
          <Text style={styles.reasonText}>{detail.reason}</Text>
        </View>
      ) : null}

      {/* 如何开始 */}
      {detail?.howToStart ? (
        <View style={[styles.section, styles.howToCard]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flag-outline" size={18} color={colors.accent} />
            <Text style={styles.sectionTitle}>{STRINGS.recDetailHowToStart}</Text>
          </View>
          <Text style={styles.howToText}>{detail.howToStart}</Text>
        </View>
      ) : null}

      {/* 底部留白 */}
      <View style={{ height: spacing.xl }} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: radius.card,
    padding: spacing.xl,
    marginBottom: spacing.md,
  },
  heroIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: fontSize.h2,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  heroDesc: {
    fontSize: fontSize.body,
    color: colors.muted,
    lineHeight: 20,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  sourceText: {
    fontSize: fontSize.caption,
    color: colors.muted,
    marginLeft: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.title,
    fontWeight: '600',
    color: colors.ink,
    marginLeft: spacing.sm,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    paddingLeft: spacing.sm,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: spacing.sm,
  },
  bulletText: {
    flex: 1,
    fontSize: fontSize.body,
    color: colors.ink,
    lineHeight: 20,
  },
  reasonText: {
    fontSize: fontSize.body,
    color: colors.ink,
    lineHeight: 22,
    paddingLeft: spacing.sm,
  },
  howToCard: {
    backgroundColor: colors.accentLight,
    borderRadius: radius.card,
    padding: spacing.md,
  },
  howToText: {
    fontSize: fontSize.body,
    color: colors.ink,
    lineHeight: 22,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.body,
    color: colors.muted,
  },
});
