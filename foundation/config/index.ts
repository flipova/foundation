import { breakpoints as defaultBreakpoints } from '../tokens';
import { colors as defaultColors } from '../tokens';
import { motion, typography, zIndex, opacity as defaultOpacity, radii as defaultRadii, shadows as defaultShadows, spacing as defaultSpacing } from '../tokens';

const defaultDurations = motion.durations;
const defaultEasings = motion.easings;
const defaultFontSizes = typography.fontSizes;
const defaultFontWeights = typography.fontWeights;
const defaultLineHeights = typography.lineHeights;
const defaultZIndices = zIndex;
import { createTheme } from "../theme/createTheme";
import type { ColorScheme, ThemeGradients } from "../theme/types";

// ==============================================================================
// 1. Configuration Types
// ==============================================================================

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
  typescript?: boolean;
}

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

// ==============================================================================
// 2. Configuration Utilities
// ==============================================================================

export function defineConfig(config: FoundationConfig): FoundationConfig {
  return config;
}

// ==============================================================================
// 3. Configuration Resolution
// ==============================================================================

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

function resolveThemes(userThemes?: Record<string, ThemeDefinition>): Record<string, ColorScheme> {
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

// ==============================================================================
// 4. Exports
// ==============================================================================

export * from "./FoundationProvider";
