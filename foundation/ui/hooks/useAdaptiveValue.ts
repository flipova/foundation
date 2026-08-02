/**
 * useAdaptiveValue — Utility Hook
 *
 * Selects a value based on the active responsive breakpoint.
 * Eliminates repeating if(isMobile)/if(isTablet)/if(isDesktop) logic blocks.
 *
 * @example
 * const spacing = useAdaptiveValue({ mobile: 2, tablet: 4, desktop: 8 }, 4);
 */

import { useMemo } from "react";
import { useBreakpoint } from "./useBreakpoint";

/**
 * Configuration object for adaptive breakpoint values.
 */
export interface AdaptiveConfig<T> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
}

/**
 * Hook to dynamically resolve a value based on current breakpoint.
 *
 * @param adaptive - Per-breakpoint configuration object (mobile, tablet, desktop).
 * @param fallback - Fallback value if configuration is undefined.
 * @returns The value adapted to current breakpoint.
 */
export function useAdaptiveValue<T>(
  adaptive: AdaptiveConfig<T> | undefined,
  fallback: T,
): T {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  return useMemo(() => {
    if (!adaptive) return fallback;
    if (isMobile && adaptive.mobile !== undefined) return adaptive.mobile;
    if (isTablet && adaptive.tablet !== undefined) return adaptive.tablet;
    if (isDesktop && adaptive.desktop !== undefined) return adaptive.desktop;
    return fallback;
  }, [adaptive, fallback, isMobile, isTablet, isDesktop]);
}
