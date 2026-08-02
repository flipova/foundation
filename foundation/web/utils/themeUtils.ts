import { spacing, radii, SpacingToken, RadiusToken } from '../../tokens';
import type { ColorScheme } from '../../theme/types';

export const resolveWebSpacing = (val?: SpacingToken | number | string): string | undefined => {
  if (val === undefined || val === null) return undefined;
  if (typeof val === 'number') return `${val}px`;
  if (typeof val === 'string' && val in spacing) return `${(spacing as any)[val]}px`;
  const namedMap: Record<string, number> = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  };
  if (typeof val === 'string' && val in namedMap) return `${namedMap[val]}px`;
  return val;
};

export const resolveWebRadius = (val?: RadiusToken | number | string): string | undefined => {
  if (val === undefined || val === null) return undefined;
  if (typeof val === 'number') return `${val}px`;
  if (typeof val === 'string' && val in radii) return `${(radii as any)[val]}px`;
  return val;
};

export const resolveWebColor = (theme: ColorScheme, colorKey?: string): string => {
  if (!colorKey) return theme.foreground;
  if (colorKey === 'text' || colorKey === 'primaryText') return theme.foreground;
  if (colorKey === 'textMuted' || colorKey === 'mutedText') return theme.mutedForeground;
  if (colorKey === 'surface' || colorKey === 'card') return theme.card;
  if (colorKey in theme) {
    const val = (theme as any)[colorKey];
    if (typeof val === 'string') return val;
  }
  return colorKey;
};
