// SupportCard 支持卡片组件
// 理解卡（蓝）/ 行动卡（绿）/ 求助卡（橙）三种类型
// 样式与 RecCard 完全一致，点击进入详情页

import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../theme';
import type { CardType, SupportCard as SupportCardType } from '../services/types';
import { Pill } from './Pill';

const TYPE_CONFIG: Record<CardType, {
  bg: string;
  bgGlass: string;
  border: string;
  text: string;
  icon: string;
  shadow: string;
  tag: string;
}> = {
  understanding: {
    bg: '#E3F2FD',
    bgGlass: 'rgba(227,242,253,0.65)',
    border: 'rgba(100,181,246,0.35)',
    text: colors.blue,
    icon: 'heart-outline',
    shadow: 'rgba(100,181,246,0.25)',
    tag: '理解',
  },
  action: {
    bg: '#E8F5E9',
    bgGlass: 'rgba(232,245,233,0.65)',
    border: 'rgba(129,199,132,0.35)',
    text: colors.green,
    icon: 'leaf-outline',
    shadow: 'rgba(129,199,132,0.25)',
    tag: '行动',
  },
  help: {
    bg: '#FFF3E0',
    bgGlass: 'rgba(255,243,224,0.65)',
    border: 'rgba(255,183,77,0.35)',
    text: colors.orange,
    icon: 'alert-circle-outline',
    shadow: 'rgba(255,183,77,0.25)',
    tag: '求助',
  },
};

interface SupportCardProps {
  card: SupportCardType;
}

export function SupportCard({ card }: SupportCardProps) {
  const config = TYPE_CONFIG[card.type];

  const handlePress = () => {
    router.push({
      pathname: '/sub/card-detail',
      params: { card: JSON.stringify(card) },
    });
  };

  const sentences = card.content.split('。');
  const title = sentences[0] + (sentences[0].length < card.content.length ? '。' : '');
  const desc = sentences.length > 1 ? sentences.slice(1).join('。').trim() : '';

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: config.bgGlass,
          borderColor: config.border,
          shadowColor: config.shadow,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={[styles.glassOverlay, { backgroundColor: 'rgba(255,255,255,0.25)' }]} />

      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: config.bg }]}>
          <Ionicons name={config.icon as keyof typeof Ionicons.glyphMap} size={20} color={config.text} />
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {desc ? (
            <Text style={styles.desc} numberOfLines={2}>
              {desc}
            </Text>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.muted} style={styles.chevron} />
      </View>

      <View style={styles.tagsRow}>
        <Pill label={config.tag} size="sm" color={config.text} bgColor={config.bg} />
        {card.sourceItemId ? (
          <Pill
            label="🧩 1块"
            size="sm"
            color={colors.accent}
            bgColor={colors.accentLight}
          />
        ) : null}
      </View>

      <View style={styles.actionRow}>
        <Pressable
          onPress={handlePress}
          style={({ pressed }) => [
            styles.tryBtn,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Text style={styles.tryText}>查看详情</Text>
          <Ionicons name="arrow-forward" size={14} color={colors.accent} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 5,
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  titleWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: 2,
  },
  desc: {
    fontSize: fontSize.body,
    color: colors.muted,
    lineHeight: 18,
  },
  chevron: {
    alignSelf: 'center',
    marginLeft: spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  tryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: radius.pill,
  },
  tryText: {
    color: colors.accent,
    fontSize: fontSize.caption,
    fontWeight: '600',
    marginRight: 4,
  },
});
