/**
 * 日志服务：接口定义 + 默认实现（纯函数）。
 * 纯函数：操作传入数组，返回新数组（不可变更新）。
 * 可在 mock 和 api 实现间共享核心逻辑。
 */

import type { JournalEntry, JournalMode } from './types';

export interface JournalCreateInput {
  content: string;
  mode: JournalMode;
  mood?: number;
  userTags: string[];
  aiThemes: JournalEntry['aiThemes'];
  riskLevel: JournalEntry['riskLevel'];
  analysis?: string;
  cards?: JournalEntry['cards'];
}

export interface JournalService {
  create(input: JournalCreateInput): JournalEntry;
  update(entries: JournalEntry[], id: string, patch: Partial<JournalEntry>): JournalEntry[];
  remove(entries: JournalEntry[], id: string): JournalEntry[];
  getById(entries: JournalEntry[], id: string): JournalEntry | undefined;
  getByDate(entries: JournalEntry[], date: string): JournalEntry[];
  getRecordedDates(entries: JournalEntry[]): string[];
}

function genId(): string {
  return `j-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function nowDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function nowTime(): string {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export const journalService: JournalService = {
  create(input: JournalCreateInput): JournalEntry {
    return {
      id: genId(),
      date: nowDate(),
      time: nowTime(),
      content: input.content,
      mode: input.mode,
      mood: input.mood,
      userTags: [...input.userTags],
      aiThemes: [...input.aiThemes],
      riskLevel: input.riskLevel,
      analysis: input.analysis,
      cards: input.cards,
      cardFeedback: {},
      actionCompleted: false,
    };
  },
  update(entries, id, patch): JournalEntry[] {
    return entries.map((e) => (e.id === id ? { ...e, ...patch } : e));
  },
  remove(entries, id): JournalEntry[] {
    return entries.filter((e) => e.id !== id);
  },
  getById(entries, id): JournalEntry | undefined {
    return entries.find((e) => e.id === id);
  },
  getByDate(entries, date): JournalEntry[] {
    return entries
      .filter((e) => e.date === date)
      .sort((a, b) => a.time.localeCompare(b.time));
  },
  getRecordedDates(entries): string[] {
    const set = new Set(entries.map((e) => e.date));
    return Array.from(set).sort();
  },
};
