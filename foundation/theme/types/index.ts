import type { ThemeName } from '../generated';

/**
 * Type representing built-in and generated theme modes.
 */
export type ThemeMode = ThemeName | 'light' | 'dark';

/**
 * Type representing a custom theme mode as a string.
 */
export type CustomThemeMode = string;

/**
 * Theme gradient color definitions.
 * Each gradient is an array of 2+ color strings.
 */
export type ThemeGradients = {
  primary: string[];
  secondary: string[];
  success: string[];
  warning: string[];
  error: string[];
  info: string[];
  subtle: string[];
  vibrant: string[];
};

/**
 * Theme color scheme specification.
 *
 * Contains color and gradient tokens — static tokens
 * (spacing, radii, shadows, typography) are imported directly
 * from `foundation/tokens` as they remain constant across themes.
 */
export type ColorScheme = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  transparent: string;
  gradients: ThemeGradients;
};

/**
 * Registry of available application themes.
 * Contains light and dark themes, plus any registered custom themes.
 */
export type ThemeRegistry = {
  light: ColorScheme;
  dark: ColorScheme;
  [key: string]: ColorScheme;
};
