/**
 * useBreakpoint — Hook niveau 1
 *
 * Détecte le breakpoint courant et expose des helpers dérivés
 * pour éviter la duplication `breakpoint === "xs" || breakpoint === "sm"`
 * dans chaque layout.
 *
 * @example
 * const { breakpoint, isMobile, isTablet, isDesktop } = useBreakpoint();
 *
 * // Avant (dupliqué partout) :
 * const isMobile = breakpoint === "xs" || breakpoint === "sm";
 *
 * // Après :
 * const { isMobile } = useBreakpoint();
 */

import { useEffect, useMemo, useState } from "react";
import { Dimensions, Platform } from "react-native";
import { Breakpoint } from "../../tokens/breakpoints";
import { getBreakpoint } from "../utils/responsive";

// ─── Types ────────────────────────────────────────────────────────────────────

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

const MOBILE: Breakpoint[] = ["xs", "sm"];
const TABLET: Breakpoint[] = ["md"];
const DESKTOP: Breakpoint[] = ["lg", "xl", "2xl"];

const getInitialBreakpoint = (): Breakpoint | null => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      return getBreakpoint(window.innerWidth);
    }
    return null; // SSR : on ne sait pas encore
  }
  return getBreakpoint();
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

export const useBreakpoint = (): BreakpointInfo => {
  const [bp, setBp] = useState<Breakpoint | null>(getInitialBreakpoint);

  useEffect(() => {
    // Sur web, si on était en SSR, on résout ici au premier mount
    if (bp === null) {
      setBp(getBreakpoint(window.innerWidth));
    }

    const subscription = Dimensions.addEventListener("change", () => {
      setBp(getBreakpoint());
    });
    return () => subscription?.remove();
  }, []);

  return useMemo(() => deriveInfo(bp), [bp]);
};