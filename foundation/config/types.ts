/**
 * Foundation configuration types.
 *
 * Used by flipova.config.ts to override tokens, themes, and behavior.
 */

import type { ColorScheme, ThemeGradients } from "../theme/types";

export interface TokenOverrides {
  spacing?: Record<number, number>;
  breakpoints?: Record<string, number>;
  radii?: Record<string, number>;
  fontSizes?: Record<string, number>;
  fontWeights?: Record<string, string>;
  lineHeights?: Record<string, number>;
  colors?: Record<string, string | Record<string, string>>;
  shadows?: Record<string, {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  }>;
  durations?: Record<string, number>;
  opacity?: Record<number, number>;
  zIndices?: Record<string, number>;
}

export interface ThemeDefinition {
  colors: Partial<Omit<ColorScheme, "gradients">>;
  gradients?: Partial<ThemeGradients>;
}

export interface FoundationConfig {
  tokens?: TokenOverrides;
  themes?: Record<string, ThemeDefinition>;
  defaultTheme?: string;
}
