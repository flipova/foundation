/**
 * usePanelWidth — Manages a resizable panel width with min/max clamping.
 */
import { useState, useCallback } from 'react';

export function usePanelWidth(initial: number, min: number, max: number) {
  const [width, setWidth] = useState(initial);

  const onResize = useCallback((delta: number) => {
    setWidth(w => Math.min(max, Math.max(min, w + delta)));
  }, [min, max]);

  return { width, onResize };
}
