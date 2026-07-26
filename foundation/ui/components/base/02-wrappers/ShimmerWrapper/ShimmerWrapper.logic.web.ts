/**
 * ShimmerWrapper Logic - Web Variant
 *
 * @description
 * Logic hook managing shimmer loading state and animation configuration.
 * Indicates whether to display shimmer overlay animation.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * No native animation library dependency. Uses CSS keyframe animation via web renderer.
 * Manages loading state boolean flag.
 * Processes component props with YAML metadata defaults.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Uses CSS keyframe animation for smooth shimmer effect
 * - Simple boolean state for loading indicator
 * - Respects prefers-reduced-motion via CSS media query
 *
 * @example
 * ```typescript
 * const logic = useShimmerWrapperLogic({ isLoading: true });
 * // logic.isLoading: boolean
 * ```
 *
 * @see
 * - ShimmerWrapper.web.tsx for rendering and animation
 */

import { useMemo } from 'react';
import ShimmerWrapperMeta from './ShimmerWrapper.meta.yaml';

export interface ShimmerWrapperProps {
  /** Whether to show the shimmer */
  isLoading?: boolean;
  [key: string]: any;
}

export function useShimmerWrapperLogic(props: ShimmerWrapperProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (ShimmerWrapperMeta?.props) {
      ShimmerWrapperMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { isLoading, ...rest } = merged;

  return {
    isLoading: !!isLoading,
    rest,
    children: merged.children,
  };
}
