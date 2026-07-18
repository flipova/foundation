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

/**
 * Configuration pour une valeur qui s'adapte en fonction du breakpoint.
 */
export interface AdaptiveConfig<T> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
}

/**
 * Hook permettant de sélectionner dynamiquement une valeur selon le breakpoint courant.
 *
 * @param adaptive - Objet de configuration par breakpoint (mobile, tablette, bureau).
 * @param fallback - Valeur de repli si la configuration n'est pas définie.
 * @returns La valeur adaptée au breakpoint courant.
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
