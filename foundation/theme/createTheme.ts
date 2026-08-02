import { colors } from "../tokens";
import type { ColorScheme } from "./types";

/**
 * Creates a theme color scheme by merging default colors with optional overrides.
 * 
 * @param overrides - (Optional) Object containing color values to override.
 * @returns The complete generated theme color scheme.
 */
export const createTheme = (overrides: Partial<ColorScheme> = {}): ColorScheme => ({
  background: colors.white,
  foreground: colors.gray[900],
  card: colors.white,
  cardForeground: colors.gray[900],
  primary: colors.primary[600],
  primaryForeground: colors.white,
  secondary: colors.secondary[600],
  secondaryForeground: colors.white,
  muted: colors.gray[100],
  mutedForeground: colors.gray[600],
  accent: colors.primary[50],
  accentForeground: colors.primary[900],
  destructive: colors.error[600],
  destructiveForeground: colors.white,
  border: colors.gray[200],
  input: colors.gray[200],
  ring: colors.primary[600],
  success: colors.success[600],
  warning: colors.warning[600],
  error: colors.error[600],
  info: colors.info[600],
  transparent: colors.transparent,
  gradients: {
    primary: [colors.primary[400], colors.primary[600]],
    secondary: [colors.secondary[400], colors.secondary[600]],
    success: [colors.success[500], colors.success[600]],
    warning: [colors.warning[500], colors.warning[600]],
    error: [colors.error[500], colors.error[600]],
    info: [colors.info[500], colors.info[600]],
    subtle: [colors.gray[50], colors.gray[100]],
    vibrant: [colors.primary[500], colors.secondary[500]],
  },
  ...overrides,
});
