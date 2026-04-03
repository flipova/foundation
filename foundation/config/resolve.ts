/**
 * Config resolver.
 *
 * Merges user overrides with built-in token defaults.
 * Called once at app startup, not per-render.
 */

import { breakpoints as defaultBreakpoints } from "../tokens/breakpoints";
import { colors as defaultColors } from "../tokens/colors";
import { durations as defaultDurations, easings as defaultEasings } from "../tokens/motion";
import { opacity as defaultOpacity } from "../tokens/opacity";
import { radii as defaultRadii } from "../tokens/radii";
import { shadows as defaultShadows } from "../tokens/shadows";
import { spacing as defaultSpacing } from "../tokens/spacing";
import { fontSizes as defaultFontSizes, fontWeights as defaultFontWeights, lineHeights as defaultLineHeights } from "../tokens/typography";
import { zIndices as defaultZIndices } from "../tokens/z-index";
import { createTheme } from "../theme/config/create.theme";
import type { ColorScheme } from "../theme/types";
import type { FoundationConfig, TokenOverrides } from "./types";

export interface ResolvedTokens {
  spacing: Record<number, number>;
  breakpoints: Record<string, number>;
  radii: Record<string, number>;
  shadows: Record<string, unknown>;
  colors: Record<string, unknown>;
  fontSizes: Record<string, number>;
  fontWeights: Record<string, string>;
  lineHeights: Record<string, number>;
  durations: Record<string, number>;
  opacity: Record<number, number>;
  zIndices: Record<string, number>;
}

export interface ResolvedConfig {
  tokens: ResolvedTokens;
  themes: Record<string, ColorScheme>;
  defaultTheme: string;
}

export function resolveConfig(userConfig?: FoundationConfig): ResolvedConfig {
  const tokens = resolveTokens(userConfig?.tokens);
  const themes = resolveThemes(userConfig?.themes);
  const defaultTheme = userConfig?.defaultTheme || "light";

  return { tokens, themes, defaultTheme };
}

function resolveTokens(overrides?: TokenOverrides): ResolvedTokens {
  return {
    spacing: overrides?.spacing
      ? { ...defaultSpacing, ...overrides.spacing }
      : { ...defaultSpacing },
    breakpoints: overrides?.breakpoints
      ? { ...defaultBreakpoints, ...overrides.breakpoints }
      : { ...defaultBreakpoints },
    radii: overrides?.radii
      ? { ...defaultRadii, ...overrides.radii }
      : { ...defaultRadii },
    shadows: overrides?.shadows
      ? { ...defaultShadows, ...overrides.shadows }
      : { ...defaultShadows },
    colors: overrides?.colors
      ? deepMerge({ ...defaultColors }, overrides.colors)
      : { ...defaultColors },
    fontSizes: overrides?.fontSizes
      ? { ...defaultFontSizes, ...overrides.fontSizes }
      : { ...defaultFontSizes },
    fontWeights: overrides?.fontWeights
      ? { ...defaultFontWeights, ...overrides.fontWeights }
      : { ...defaultFontWeights },
    lineHeights: overrides?.lineHeights
      ? { ...defaultLineHeights, ...overrides.lineHeights }
      : { ...defaultLineHeights },
    durations: overrides?.durations
      ? { ...defaultDurations, ...overrides.durations }
      : { ...defaultDurations },
    opacity: overrides?.opacity
      ? { ...defaultOpacity, ...overrides.opacity }
      : { ...defaultOpacity },
    zIndices: overrides?.zIndices
      ? { ...defaultZIndices, ...overrides.zIndices }
      : { ...defaultZIndices },
  };
}

function resolveThemes(
  userThemes?: Record<string, { colors: Partial<Omit<ColorScheme, "gradients">>; gradients?: Partial<ColorScheme["gradients"]> }>,
): Record<string, ColorScheme> {
  const themes: Record<string, ColorScheme> = {};

  if (!userThemes) return themes;

  for (const [name, def] of Object.entries(userThemes)) {
    themes[name] = createTheme({
      ...def.colors,
      gradients: def.gradients
        ? {
            primary: [], secondary: [], success: [], warning: [],
            error: [], info: [], subtle: [], vibrant: [],
            ...def.gradients,
          }
        : undefined,
    } as Partial<ColorScheme>);
  }

  return themes;
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  for (const key of Object.keys(source)) {
    if (
      typeof source[key] === "object" && source[key] !== null && !Array.isArray(source[key]) &&
      typeof target[key] === "object" && target[key] !== null && !Array.isArray(target[key])
    ) {
      target[key] = deepMerge(
        { ...(target[key] as Record<string, unknown>) },
        source[key] as Record<string, unknown>,
      );
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
