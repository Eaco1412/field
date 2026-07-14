/**
 * AsyncStorage 存储层封装。
 * 统一管理存储的 key 与读写操作，业务层不直接接触 AsyncStorage。
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../logger';
import type { AppDataState } from '../services/types';

const STORAGE_KEY = '@emotion_wilderness/app_state_v2';

export const storageKeys = {
  appState: STORAGE_KEY,
} as const;

export async function loadAppState(): Promise<AppDataState | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppDataState;
    logger.debug('[storage] loadAppState success');
    return parsed;
  } catch (err) {
    logger.error('[storage] loadAppState failed', err);
    return null;
  }
}

export async function saveAppState(state: AppDataState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    logger.debug('[storage] saveAppState success');
  } catch (err) {
    logger.error('[storage] saveAppState failed', err);
  }
}

export async function clearAppState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    logger.info('[storage] clearAppState success');
  } catch (err) {
    logger.error('[storage] clearAppState failed', err);
  }
}
