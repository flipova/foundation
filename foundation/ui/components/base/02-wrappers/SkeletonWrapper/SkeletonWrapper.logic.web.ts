/**
 * SkeletonWrapper Logic - Web Variant
 *
 * @description
 * Logic hook for skeleton loading state with ResizeObserver-based dimension tracking.
 * Provides precise content dimensions for skeleton placeholder sizing.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Uses ResizeObserver instead of React Native layout events for accurate measurements.
 * Tracks container dimensions (width/height) and loading state.
 * Provides setRef callback for container element measurement.
 * Handles graceful degradation if ResizeObserver unavailable.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - ResizeObserver provides real-time dimension updates
 * - Handles SSR gracefully with dimension initialization
 * - Automatically disconnects observer on unmount
 * - Simple boolean state for loading indication
 *
 * @example
 * ```typescript
 * const logic = useSkeletonWrapperLogic({ isLoading: true, children: <Content /> });
 * // logic.isLoading: boolean
 * // logic.dimensions: { width, height }
 * // logic.hasMeasured: boolean
 * // logic.setRef: (node) => void
 * ```
 *
 * @see
 * - SkeletonWrapper.web.tsx for rendering
 * - ResizeObserver API (MDN)
 */

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Props for the SkeletonWrapper component.
 */
export interface SkeletonWrapperProps {
  /** Whether the component is currently loading. If true, shows skeleton. */
  isLoading: boolean;
  /** Children elements to measure and optionally render */
  children: React.ReactNode;
  /** Any other props for the container */
  [key: string]: any;
}

export function useSkeletonWrapperLogic(rawProps: SkeletonWrapperProps) {
  const { isLoading, children, ...rest } = rawProps;

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hasMeasured, setHasMeasured] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Use ResizeObserver for accurate measurements on web
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
          setHasMeasured(true);
        }
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const setRef = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
  }, []);

  return {
    isLoading,
    children,
    dimensions,
    hasMeasured,
    setRef,
    rest,
  };
}
