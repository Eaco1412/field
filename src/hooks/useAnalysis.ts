/**
 * useAnalysis：AI 分析相关 hook（轻封装，便于 UI 层直接调用）。
 */

import { useCallback } from 'react';
import { aiService, safetyService } from '../services';
import type { JournalMode, AnalysisResult } from '../services/types';
import type { AiModelId } from '../config/ai';

export function useAnalysis() {
  const analyze = useCallback(
    (content: string, mode: JournalMode, model?: AiModelId): Promise<AnalysisResult> => {
      return aiService.analyze(content, mode, model);
    },
    [],
  );

  const isCrisis = useCallback((content: string): boolean => {
    return safetyService.isCrisis(content);
  }, []);

  return { analyze, isCrisis };
}
