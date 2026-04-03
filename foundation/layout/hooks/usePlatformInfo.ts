/**
 * usePlatformInfo — Hook niveau 1
 *
 * Détection de plateforme (iOS / Android / Web).
 * À utiliser UNIQUEMENT pour des comportements liés à la plateforme
 * (haptics, cursor, keyboard, etc.), PAS pour du responsive.
 *
 * Pour le responsive → useBreakpoint().
 *
 * @example
 * const { isWeb, isNative } = usePlatformInfo();
 * if (isNative) Haptics.impactAsync(...);
 */

import { Platform } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlatformInfo {
  /** true si Platform.OS === 'web' */
  isWeb: boolean;
  /** true si Platform.OS !== 'web' (iOS ou Android) */
  isNative: boolean;
  /** true si Platform.OS === 'ios' */
  isIOS: boolean;
  /** true si Platform.OS === 'android' */
  isAndroid: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const usePlatformInfo = (): PlatformInfo => ({
  isWeb: Platform.OS === "web",
  isNative: Platform.OS !== "web",
  isIOS: Platform.OS === "ios",
  isAndroid: Platform.OS === "android",
});
