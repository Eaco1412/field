import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { RecCard } from '../../src/components/RecCard';
import { useRecommendations } from '../../src/hooks/useRecommendations';
import { STRINGS } from '../../src/constants/strings';
import { colors, fontSize, spacing } from '../../src/theme';
import type { RecCategory } from '../../src/services/types';

const CATEGORY_LABELS: Record<string, string> = {
  action: STRINGS.catAction,
  content: STRINGS.catContent,
  habit: STRINGS.catHabit,
  theme: STRINGS.catTheme,
  music: STRINGS.catMusic,
  nature: STRINGS.catNature,
  creativity: STRINGS.catCreativity,
  mindfulness: STRINGS.catMindfulness,
  reading: STRINGS.catReading,
  community: STRINGS.catCommunity,
  body: STRINGS.catBody,
  growth: STRINGS.catGrowth,
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  action: '简单易行的小行动，帮你从当下开始',
  content: '精选书籍、影片、播客，陪你度过时光',
  habit: '养成好习惯，每天进步一点点',
  theme: '探索新主题，发现不一样的世界',
  music: '用音乐治愈心灵，找到内心的平静',
  nature: '走进大自然，感受生命的力量',
  creativity: '释放创造力，表达真实的自己',
  mindfulness: '静心练习，与自己温柔相处',
  reading: '阅读好时光，遇见更好的自己',
  community: '温暖故事，让你知道你并不孤单',
  body: '关爱身体，从每一个小细节开始',
  growth: '自我成长，成为更强大的自己',
};

export default function RecListScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { currentList, tryItem, completeItem, isInProgress, isCompleted, setCategory } =
    useRecommendations();

  useEffect(() => {
    if (category) {
      setCategory(category as RecCategory);
    }
  }, [category, setCategory]);

  const label = CATEGORY_LABELS[category] || STRINGS.discoverTitle;
  const description = CATEGORY_DESCRIPTIONS[category] || '';

  return (
    <ScreenWrapper scroll={false} contentStyle={{ paddingBottom: 0 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{label}</Text>
        {description ? <Text style={styles.headerDesc}>{description}</Text> : null}
      </View>

      <FlatList
        data={currentList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecCard
            item={item}
            inProgress={isInProgress(item.id)}
            completed={isCompleted(item.id)}
            onTry={() => tryItem(item)}
            onComplete={() => completeItem(item.id)}
          />
        )}
        contentContainerStyle={{ paddingVertical: spacing.md, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.md,
    paddingTop: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.h2,
    fontWeight: '700',
    color: colors.ink,
  },
  headerDesc: {
    fontSize: fontSize.body,
    color: colors.muted,
    marginTop: 4,
    lineHeight: 20,
  },
});