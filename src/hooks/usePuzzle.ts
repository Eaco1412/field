/**
 * usePuzzle：拼图相关 hook。
 */

import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export function usePuzzle() {
  const { state, addPuzzlePieces } = useApp();

  const puzzles = state.puzzles;

  const totalCount = puzzles.length;
  const completedCount = useMemo(
    () => puzzles.filter((p) => p.isUnlocked).length,
    [puzzles],
  );

  const progressPuzzles = useMemo(
    () => puzzles.filter((p) => p.completedPieces > 0),
    [puzzles],
  );

  return {
    puzzles,
    totalCount,
    completedCount,
    progressPuzzles,
    addPuzzlePieces,
  };
}
