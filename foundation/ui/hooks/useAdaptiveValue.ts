/**
 * useAdaptiveValue — Hook utilitaire
 *
 * Sélectionne une valeur selon le breakpoint courant.
 * Élimine la duplication du pattern if(isMobile)/if(isTablet)/if(isDesktop).
 *
 * @example
 * const spacing = useAdaptiveValue({ mobile: 2, tablet: 4, desktop: 8 }, 4);
 */

import { useMemo } from "react";
import { useBreakpoint } from "./useBreakpoint";

export interface AdaptiveConfig<T> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
}

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
