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