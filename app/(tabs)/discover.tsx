import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { STRINGS } from '../../src/constants/strings';
import { colors, fontSize, radius, spacing } from '../../src/theme';

interface CategoryCard {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  border: string;
  shadow: string;
  description: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    id: 'action',
    label: STRINGS.catAction,
    icon: 'leaf-outline',
    color: '#7BAE7F',
    bg: 'rgba(232,245,233,0.7)',
    border: 'rgba(123,174,127,0.35)',
    shadow: 'rgba(123,174,127,0.25)',
    description: '简单易行的小行动',
  },
  {
    id: 'content',
    label: STRINGS.catContent,
    icon: 'book-outline',
    color: '#64B5F6',
    bg: 'rgba(227,242,253,0.7)',
    border: 'rgba(100,181,246,0.35)',
    shadow: 'rgba(100,181,246,0.25)',
    description: '值得一看的内容',
  },
  {
    id: 'habit',
    label: STRINGS.catHabit,
    icon: 'repeat-outline',
    color: '#FFB74D',
    bg: 'rgba(255,243,224,0.7)',
    border: 'rgba(255,183,77,0.35)',
    shadow: 'rgba(255,183,77,0.25)',
    description: '养成好习惯',
  },
  {
    id: 'theme',
    label: STRINGS.catTheme,
    icon: 'sparkles-outline',
    color: '#9575CD',
    bg: 'rgba(243,229,245,0.7)',
    border: 'rgba(149,117,205,0.35)',
    shadow: 'rgba(149,117,205,0.25)',
    description: '探索新主题',
  },
  {
    id: 'music',
    label: STRINGS.catMusic,
    icon: 'musical-note',
    color: '#E91E63',
    bg: 'rgba(248,187,208,0.7)',
    border: 'rgba(233,30,99,0.35)',
    shadow: 'rgba(233,30,99,0.25)',
    description: '用音乐治愈',
  },
  {
    id: 'nature',
    label: STRINGS.catNature,
    icon: 'eye-outline',
    color: '#009688',
    bg: 'rgba(208,255,247,0.7)',
    border: 'rgba(0,150,136,0.35)',
    shadow: 'rgba(0,150,136,0.25)',
    description: '走进大自然',
  },
  {
    id: 'creativity',
    label: STRINGS.catCreativity,
    icon: 'brush',
    color: '#FF9800',
    bg: 'rgba(255,235,205,0.7)',
    border: 'rgba(255,152,0,0.35)',
    shadow: 'rgba(255,152,0,0.25)',
    description: '释放创造力',
  },
  {
    id: 'mindfulness',
    label: STRINGS.catMindfulness,
    icon: 'flower-outline',
    color: '#607D8B',
    bg: 'rgba(229,236,240,0.7)',
    border: 'rgba(96,125,139,0.35)',
    shadow: 'rgba(96,125,139,0.25)',
    description: '静心练习',
  },
  {
    id: 'reading',
    label: STRINGS.catReading,
    icon: 'library',
    color: '#3F51B5',
    bg: 'rgba(232,234,255,0.7)',
    border: 'rgba(63,81,181,0.35)',
    shadow: 'rgba(63,81,181,0.25)',
    description: '阅读好时光',
  },
  {
    id: 'community',
    label: STRINGS.catCommunity,
    icon: 'heart-outline',
    color: '#F48FB1',
    bg: 'rgba(252,228,236,0.7)',
    border: 'rgba(244,143,177,0.35)',
    shadow: 'rgba(244,143,177,0.25)',
    description: '温暖故事',
  },
  {
    id: 'body',
    label: STRINGS.catBody,
    icon: 'fitness',
    color: '#4CAF50',
    bg: 'rgba(232,245,233,0.7)',
    border: 'rgba(76,175,80,0.35)',
    shadow: 'rgba(76,175,80,0.25)',
    description: '关爱身体',
  },
  {
    id: 'growth',
    label: STRINGS.catGrowth,
    icon: 'trending-up',
    color: '#2196F3',
    bg: 'rgba(227,242,253,0.7)',
    border: 'rgba(33,150,243,0.35)',
    shadow: 'rgba(33,150,243,0.25)',
    description: '自我成长',
  },
];

export default function DiscoverScreen() {
  return (
    <ScreenWrapper scroll={false} contentStyle={{ paddingBottom: 0, paddingTop: spacing.xl }}>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/sub/rec-list?category=${item.id}`)}
            style={({ pressed }) => [
              styles.categoryCard,
              {
                backgroundColor: item.bg,
                borderColor: item.border,
                shadowColor: item.shadow,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View style={[styles.glassOverlay, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
            
            <View style={styles.cardContent}>
              <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={[styles.cardLabel, { color: item.color }]}>{item.label}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>
            
            <Ionicons name="chevron-forward" size={16} color={item.color} style={styles.chevron} />
          </Pressable>
        )}
        contentContainerStyle={{ paddingVertical: spacing.lg, paddingBottom: spacing.xxl, rowGap: 15 }}
        columnWrapperStyle={{ columnGap: 23, paddingHorizontal: spacing.md }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  categoryCard: {
    flex: 1,
    borderRadius: radius.card,
    padding: spacing.md,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
    minHeight: 120,
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.card,
  },
  cardContent: {
    position: 'relative',
    zIndex: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardLabel: {
    fontSize: fontSize.title,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: fontSize.caption,
    color: colors.muted,
  },
  chevron: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    opacity: 0.6,
  },
});