/**
 * 卡片详情页：展示理解卡/行动卡/求助卡的详细信息。
 * 布局参考 rec-detail.tsx。
 */

import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { Pill } from '../../src/components/Pill';
import { colors, fontSize, radius, spacing } from '../../src/theme';
import type { SupportCard as SupportCardType, CardType } from '../../src/services/types';

const TYPE_CONFIG: Record<CardType, {
  bg: string;
  text: string;
  icon: string;
  tag: string;
}> = {
  understanding: { bg: '#E3F2FD', text: colors.blue, icon: 'heart-outline', tag: '理解' },
  action: { bg: '#E8F5E9', text: colors.green, icon: 'leaf-outline', tag: '行动' },
  help: { bg: '#FFF3E0', text: colors.orange, icon: 'alert-circle-outline', tag: '求助' },
};

/** 求助卡额外资源 */
const HELP_RESOURCES = [
  { title: '全国24小时心理援助热线', number: '12320-5', icon: 'call-outline' },
  { title: '北京心理危机研究与干预中心', number: '010-82951332', icon: 'medkit-outline' },
  { title: '希望24热线', number: '400-161-9995', icon: 'heart-circle-outline' },
];

export default function CardDetailScreen() {
  const { card } = useLocalSearchParams<{ card: string }>();

  let cardData: SupportCardType | null = null;
  try {
    cardData = JSON.parse(card || '');
    logger.info('[card-detail] received card', {
      type: cardData?.type,
      hasDetail: !!cardData?.detail,
      detailLen: cardData?.detail?.length ?? 0,
      contentLen: cardData?.content?.length ?? 0,
      contentPreview: cardData?.content?.slice(0, 50),
      detailPreview: cardData?.detail?.slice(0, 80),
    });
  } catch (e) {
    logger.error('[card-detail] parse card failed', { error: String(e) });
  }

  if (!cardData) {
    return (
      <ScreenWrapper scroll={false}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>卡片内容不存在</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const config = TYPE_CONFIG[cardData.type];

  // 把 content 拆成标题和描述
  const sentences = cardData.content.split('。');
  const title = sentences[0] + (sentences[0].length < cardData.content.length ? '。' : '');
  const desc = sentences.length > 1 ? sentences.slice(1).join('。').trim() : '';

  return (
    <ScreenWrapper>
      {/* 头部卡片 */}
      <View style={[styles.heroCard, { backgroundColor: config.bg }]}>
        <View style={styles.heroIconBox}>
          <Ionicons name={config.icon as keyof typeof Ionicons.glyphMap} size={28} color={config.text} />
        </View>
        <Text style={styles.heroTitle}>{title}</Text>
        {desc ? (
          <Text style={styles.heroDesc}>{desc}</Text>
        ) : null}
      </View>

      {/* 标签 */}
      <View style={styles.tagsRow}>
        <Pill label={config.tag} size="sm" color={config.text} bgColor={config.bg} />
        {cardData.sourceItemId ? (
          <Pill
            label={`🧩 1块`}
            size="sm"
            color={colors.accent}
            bgColor={colors.accentLight}
          />
        ) : null}
      </View>

      {/* 卡片内容详情 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="document-text-outline" size={18} color={colors.accent} />
          <Text style={styles.sectionTitle}>详细内容</Text>
        </View>
        <Text style={styles.reasonText}>
          {cardData.detail || cardData.content}
        </Text>
      </View>

      {/* 求助卡：额外资源 */}
      {cardData.type === 'help' ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people-circle-outline" size={18} color={colors.accent} />
            <Text style={styles.sectionTitle}>可以求助的资源</Text>
          </View>
          {HELP_RESOURCES.map((res, i) => (
            <View key={i} style={styles.resourceItem}>
              <View style={[styles.resourceIcon, { backgroundColor: config.bg }]}>
                <Ionicons name={res.icon as keyof typeof Ionicons.glyphMap} size={18} color={config.text} />
              </View>
              <View style={styles.resourceText}>
                <Text style={styles.resourceTitle}>{res.title}</Text>
                <Text style={styles.resourceNumber}>{res.number}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {/* 温馨提示 */}
      <View style={[styles.section, styles.howToCard]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="bulb-outline" size={18} color={colors.accent} />
          <Text style={styles.sectionTitle}>温馨提示</Text>
        </View>
        <Text style={styles.howToText}>
          {cardData.type === 'understanding'
            ? '你的感受是真实的，也是值得被看见的。允许自己有这样的情绪，不需要急着改变。'
            : cardData.type === 'action'
              ? '行动不需要完美，重要的是迈出第一步。如果今天做不到，明天再试也没关系。'
              : '寻求帮助是勇敢的表现。你值得被支持，也值得拥有更好的状态。'}
        </Text>
      </View>

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
  reasonText: {
    fontSize: fontSize.body,
    color: colors.ink,
    lineHeight: 22,
    paddingLeft: spacing.sm,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingLeft: spacing.sm,
  },
  resourceIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  resourceText: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: fontSize.body,
    color: colors.ink,
    fontWeight: '500',
  },
  resourceNumber: {
    fontSize: fontSize.caption,
    color: colors.muted,
    marginTop: 2,
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
