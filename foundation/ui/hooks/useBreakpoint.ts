/**
 * useBreakpoint — Core Layout Hook
 *
 * Detects the current responsive breakpoint and exposes derived flags
 * to avoid repeating `breakpoint === "xs" || breakpoint === "sm"` check blocks.
 *
 * @example
 * const { breakpoint, isMobile, isTablet, isDesktop } = useBreakpoint();
 */

import { useEffect, useMemo, useState } from "react";
import { Dimensions, Platform } from "react-native";
import { Breakpoint } from '../../tokens';
import { getBreakpoint } from "../utils/responsive";
import { usePlatformOverride } from "./PlatformOverride";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Current breakpoint information and derived screen state flags.
 */
export interface BreakpointInfo {
  /** Raw breakpoint token ('xs', 'sm', 'md', 'lg', 'xl', '2xl'). Null on SSR before hydration. */
  breakpoint: Breakpoint | null;
  /** True for xs or sm */
  isMobile: boolean;
  /** True for md */
  isTablet: boolean;
  /** True for lg, xl, or 2xl */
  isDesktop: boolean;
  /** True for md or larger */
  isAtLeastTablet: boolean;
  /** True for lg or larger */
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
    return null; // SSR: viewport unknown until hydration
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

/**
 * Hook to retrieve current responsive breakpoint and screen state flags.
 * Listens for viewport dimension changes and updates reactively.
 *
 * @returns BreakpointInfo object containing screen state flags (isMobile, isTablet, isDesktop).
 */
export const useBreakpoint = (): BreakpointInfo => {
  const override = usePlatformOverride();
  const [bp, setBp] = useState<Breakpoint | null>(getInitialBreakpoint);

  useEffect(() => {
    if (bp === null) {
      setBp(getBreakpoint(window.innerWidth));
    }

    const subscription = Dimensions.addEventListener("change", () => {
      setBp(getBreakpoint());
    });
    return () => subscription?.remove();
  }, [bp]);

  const real = useMemo(() => deriveInfo(bp), [bp]);
  return override?.breakpoint ?? real;
};