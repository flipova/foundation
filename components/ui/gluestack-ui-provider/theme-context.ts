import { createContext, useContext } from 'react';

/**
 * The colour maps of the theme that is actually mounted.
 *
 * `useGluestackColors` used to close over the config this package generates,
 * so an app that adopted the registries and mounted its own provider still read
 * the package colours - the branding would have been cosmetic. The provider
 * publishes what it was built with here instead, and the hook reads this first.
 */
export type ThemeColors = Record<string, Record<string, string>>;

export const ThemeContext = createContext<ThemeColors | null>(null);

/** The mounted theme, or null when the package's own provider is not in the tree. */
export const useMountedColors = (): ThemeColors | null => useContext(ThemeContext);

/**
 * Which theme of the mounted set is active.
 *
 * A theme set declares several light/dark pairs (variants: `spring-light` /
 * `spring-dark`, ...). Nativewind only knows `light` and `dark`, so the provider
 * resolves the pair itself and publishes the resulting id here - otherwise a hook
 * reading colours would look up `colors['dark']` and miss the variant entirely.
 */
export interface MountedTheme {
  /** The active theme id, e.g. `spring-dark`. */
  themeId: string;
  /** Every id the mounted set declares, so a lookup can fall back safely. */
  themeIds: string[];
}

export const MountedThemeContext = createContext<MountedTheme | null>(null);

export const useMountedTheme = (): MountedTheme | null => useContext(MountedThemeContext);

/**
 * Resolve a (variant, mode) request to a theme id.
 *
 * The generated `variants` table is authoritative, so a theme id never has to
 * follow a naming convention. An unknown variant falls back to the mode itself,
 * which is exactly the pre-variant behaviour (the `light`/`dark` ids).
 */
export function resolveThemeId(
  variants: Record<string, Record<string, string>> | undefined,
  variant: string | undefined,
  mode: string
): string {
  const mapped = variant ? variants?.[variant]?.[mode] : undefined;
  return mapped ?? mode;
}