/**
 * platform — Web Variant
 *
 * @description
 * Utility module providing platform detection and selection for web platform.
 * All checks are constants since this code only runs in web environment.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Exports boolean constants (isWeb=true, isIOS=false, isAndroid=false).
 * Provides platformSelect() function for runtime platform-specific behavior selection.
 * No native platform detection needed—web platform is implicit from build target.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - All constants are tree-shakeable by bundlers
 * - platformSelect() always routes to `web` then `default` option
 * - Useful for utility functions that need platform-specific behavior
 *
 * @example
 * ```typescript
 * import { isWeb, platformSelect } from './platform.web';
 *
 * if (isWeb) {
 *   useWindowResize(); // web-only hook
 * }
 *
 * const handler = platformSelect({
 *   web: handleWebClick,
 *   default: noop,
 * });
 * ```
 *
 * @see
 * - usePlatformInfo hook for reactive platform detection
 */

/** Always false on web. */
export const isIOS = false;

/** Always false on web. */
export const isAndroid = false;

/** Always true on web. */
export const isWeb = true;

/**
 * Sélectionne une valeur spécifique en fonction de la plateforme courante.
 * Sur le web, résout toujours vers `web` puis `default`.
 *
 * @param platforms - Un objet contenant les valeurs possibles par plateforme et une valeur par défaut.
 * @returns La valeur résolue pour la plateforme courante (web).
 */
export const platformSelect = <T>(platforms: {
  ios?: T;
  android?: T;
  web?: T;
  default: T;
}): T => {
  if (platforms.web !== undefined) return platforms.web;
  return platforms.default;
};
