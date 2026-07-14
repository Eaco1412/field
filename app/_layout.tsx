/**
 * 根布局：包裹 AppProvider + StatusBar + 全局样式。
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../src/context/AppContext';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.ink,
            headerTitleStyle: { fontWeight: '600' },
            contentStyle: { backgroundColor: colors.bg },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="sub/journal-history"
            options={{ title: '历史日志', headerBackTitle: '返回' }}
          />
          <Stack.Screen
            name="sub/achievements"
            options={{ title: '我的成就', headerBackTitle: '返回' }}
          />
          <Stack.Screen
            name="sub/puzzles"
            options={{ title: '我的拼图', headerBackTitle: '返回' }}
          />
          <Stack.Screen
            name="sub/puzzle-detail"
            options={{ title: '拼图详情', headerBackTitle: '返回' }}
          />
          <Stack.Screen
            name="sub/journal-book"
            options={{ title: '我的手账', headerBackTitle: '返回' }}
          />
          <Stack.Screen
            name="sub/settings"
            options={{ title: '设置', headerBackTitle: '返回' }}
          />
          <Stack.Screen
            name="sub/rec-detail"
            options={{ title: '推荐详情', headerBackTitle: '返回' }}
          />
          <Stack.Screen
            name="sub/rec-list"
            options={{ title: '推荐列表', headerBackTitle: '返回' }}
          />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
