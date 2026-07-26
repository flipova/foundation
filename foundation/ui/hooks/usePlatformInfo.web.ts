/**
 * usePlatformInfo — Web Variant
 *
 * @description
 * Hook that returns the current platform information, always indicating web platform.
 * Provides boolean flags to conditionally render platform-specific code paths.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * On web, always returns isWeb=true with other platform flags false.
 * No native platform detection needed since this is inherently web code.
 * Respects PlatformOverride context for Studio preview mode to simulate other platforms.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Studio preview can override platform detection for cross-platform testing
 * - Useful for conditional rendering without platform-specific UI libraries
 * - Lightweight hook with minimal overhead
 *
 * @example
 * ```typescript
 * const platform = usePlatformInfo();
 *
 * if (platform.isNative) {
 *   return <NativeComponent />;
 * }
 * return <WebComponent />;
 * ```
 *
 * @see
 * - PlatformOverride context for preview overrides
 * - platform.web.ts utility for direct platform checks
 */

import { usePlatformOverride } from './PlatformOverride';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Informations sur la plateforme d'exécution courante.
 */
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

// ─── Constants ────────────────────────────────────────────────────────────────

const WEB_PLATFORM: PlatformInfo = {
  isWeb: true,
  isNative: false,
  isIOS: false,
  isAndroid: false,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Hook permettant d'obtenir les informations de la plateforme courante.
 * Sur le web, toujours isWeb=true. Tient compte des overrides Studio.
 *
 * @returns Un objet contenant des booléens indiquant la plateforme.
 */
export const usePlatformInfo = (): PlatformInfo => {
  const override = usePlatformOverride();
  if (override?.platform) return override.platform;
  return WEB_PLATFORM;
};
