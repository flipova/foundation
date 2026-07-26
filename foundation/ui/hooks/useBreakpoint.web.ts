/**
 * useBreakpoint — Web Variant
 *
 * @description
 * Hook that returns responsive breakpoint information by monitoring window width.
 * Provides derived boolean flags (isMobile, isTablet, isDesktop) for responsive UI logic.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Uses `window.innerWidth` + `resize` event listener instead of React Native's Dimensions API.
 * Handles SSR hydration by initially returning null during server-side rendering.
 * On component mount, synchronizes with actual window dimensions and sets up resize listener.
 * Respects PlatformOverride context for Studio preview mode testing.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Automatically handles SSR hydration with null initial state
 * - Cleanup listener removed on unmount to prevent memory leaks
 * - Honors PlatformOverride for testing and Studio preview scenarios
 *
 * @example
 * ```typescript
 * const breakpoint = useBreakpoint();
 *
 * if (breakpoint.isMobile) {
 *   return <MobileLayout />;
 * }
 * if (breakpoint.isDesktop) {
 *   return <DesktopLayout />;
 * }
 * return <TabletLayout />;
 * ```
 *
 * @see
 * - useResponsiveValue hook for responsive values
 * - responsive.web.ts utility for breakpoint calculations
 */

import { useEffect, useMemo, useState } from 'react';
import { Breakpoint } from '../../tokens';
import { getBreakpoint } from '../utils/responsive';
import { usePlatformOverride } from './PlatformOverride';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Informations sur le point d'arrêt (breakpoint) actuel et les états d'écran dérivés.
 */
export interface BreakpointInfo {
  /** Breakpoint brut (xs, sm, md, lg, xl, 2xl). Null en SSR avant hydratation. */
  breakpoint: Breakpoint | null;
  /** xs ou sm */
  isMobile: boolean;
  /** md */
  isTablet: boolean;
  /** lg, xl ou 2xl */
  isDesktop: boolean;
  /** md ou plus */
  isAtLeastTablet: boolean;
  /** lg ou plus */
  isAtLeastDesktop: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MOBILE: Breakpoint[] = ['xs', 'sm'];
const TABLET: Breakpoint[] = ['md'];
const DESKTOP: Breakpoint[] = ['lg', 'xl', '2xl'];

const getInitialBreakpoint = (): Breakpoint | null => {
  if (typeof window !== 'undefined') {
    return getBreakpoint(window.innerWidth);
  }
  return null; // SSR
};

const deriveInfo = (bp: Breakpoint | null): BreakpointInfo => ({
  breakpoint: bp,
  isMobile: bp !== null && MOBILE.includes(bp),
  isTablet: bp !== null && TABLET.includes(bp),
  isDesktop: bp !== null && DESKTOP.includes(bp),
  isAtLeastTablet: bp !== null && !MOBILE.includes(bp),
  isAtLeastDesktop: bp !== null && DESKTOP.includes(bp),
});

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Hook permettant d'obtenir des informations sur le point d'arrêt (breakpoint) courant.
 * Écoute les changements de largeur de fenêtre pour mettre à jour ces valeurs.
 *
 * @returns Un objet contenant les informations de breakpoint (ex: isMobile, isTablet).
 */
export const useBreakpoint = (): BreakpointInfo => {
  const override = usePlatformOverride();
  const [bp, setBp] = useState<Breakpoint | null>(getInitialBreakpoint);

  useEffect(() => {
    // Hydrate on mount in case SSR returned null
    if (bp === null) {
      setBp(getBreakpoint(window.innerWidth));
    }

    const handler = () => setBp(getBreakpoint(window.innerWidth));
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [bp]);

  const real = useMemo(() => deriveInfo(bp), [bp]);
  return override?.breakpoint ?? real;
};
