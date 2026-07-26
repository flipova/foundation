/**
 * SlideUpWrapper Logic - Web Variant
 *
 * @description
 * Logic hook managing slide-up animation state and timing configuration.
 * Tracks animation timing and distance parameters for CSS transform transitions.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * No animation library dependency. Uses CSS translate transform transitions.
 * Manages animation timing (duration, delay) and slide distance.
 * Processes component props with YAML metadata defaults.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Uses CSS transform for GPU-accelerated animation
 * - Configurable timing and slide distance
 * - Supports delayed animation start
 * - Combined opacity and transform for smooth entry
 *
 * @example
 * ```typescript
 * const logic = useSlideUpWrapperLogic({ duration: 300, delay: 100, distance: 50 });
 * // logic.duration: number (ms)
 * // logic.delay: number (ms)
 * // logic.distance: number (px)
 * ```
 *
 * @see
 * - SlideUpWrapper.web.tsx for rendering
 */

import { useMemo } from 'react';
import SlideUpWrapperMeta from './SlideUpWrapper.meta.yaml';

export interface SlideUpWrapperProps {
  /** Animation duration in ms */
  duration?: number;
  /** Animation delay in ms */
  delay?: number;
  /** Distance to slide from in pixels */
  distance?: number;
  [key: string]: any;
}

export function useSlideUpWrapperLogic(props: SlideUpWrapperProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (SlideUpWrapperMeta?.props) {
      SlideUpWrapperMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { duration, delay, distance, ...rest } = merged;

  return {
    duration: merged.duration ?? 300,
    delay: merged.delay ?? 0,
    distance: merged.distance ?? 50,
    rest,
    children: merged.children,
  };
}
