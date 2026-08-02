/**
 * usePlatformInfo — Core Platform Hook
 *
 * Platform detection hook (iOS / Android / Web).
 * Use EXCLUSIVELY for platform-specific behavior (haptics, cursors, keyboard),
 * NOT for responsive styling layout decisions.
 *
 * For responsive layout decisions → useBreakpoint().
 *
 * @example
 * const { isWeb, isNative } = usePlatformInfo();
 * if (isNative) Haptics.impactAsync(...);
 */

import { Platform } from "react-native";
import { usePlatformOverride } from "./PlatformOverride";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Information regarding the current runtime platform.
 */
export interface PlatformInfo {
  /** true if Platform.OS === 'web' */
  isWeb: boolean;
  /** true if Platform.OS !== 'web' (iOS or Android) */
  isNative: boolean;
  /** true if Platform.OS === 'ios' */
  isIOS: boolean;
  /** true if Platform.OS === 'android' */
  isAndroid: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Hook to retrieve current runtime platform flags (web, native, iOS, Android).
 * Respects platform overrides when present.
 *
 * @returns Object containing boolean flags indicating the active platform.
 */
export const usePlatformInfo = (): PlatformInfo => {
  const override = usePlatformOverride();
  if (override?.platform) return override.platform;
  return {
    isWeb: Platform.OS === "web",
    isNative: Platform.OS !== "web",
    isIOS: Platform.OS === "ios",
    isAndroid: Platform.OS === "android",
  };
};
