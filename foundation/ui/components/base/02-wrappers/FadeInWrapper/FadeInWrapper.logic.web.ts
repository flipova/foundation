/**
 * FadeInWrapper Logic - Web Variant
 *
 * @description
 * Logic hook managing fade-in animation state and timing configuration.
 * Tracks animation timing for CSS opacity transitions.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * No animation library dependency. Uses CSS opacity transitions via web renderer.
 * Manages animation state with timing values for delay and duration.
 * Processes component props with YAML metadata defaults.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Uses CSS opacity transition instead of Animated API
 * - Timing values configurable via props
 * - Supports delayed animation start
 *
 * @example
 * ```typescript
 * const logic = useFadeInWrapperLogic({ delay: 300, duration: 600 });
 * // logic.duration: number
 * // logic.delay: number
 * ```
 *
 * @see
 * - FadeInWrapper.web.tsx for rendering
 */

import { useMemo } from 'react';
import FadeInWrapperMeta from './FadeInWrapper.meta.yaml';

export interface FadeInWrapperProps {
  /** Animation duration in ms */
  duration?: number;
  /** Animation delay in ms */
  delay?: number;
  [key: string]: any;
}

export function useFadeInWrapperLogic(props: FadeInWrapperProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (FadeInWrapperMeta?.props) {
      FadeInWrapperMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { duration, delay, ...rest } = merged;

  return {
    duration: merged.duration ?? 300,
    delay: merged.delay ?? 0,
    rest,
    children: merged.children,
  };
}
