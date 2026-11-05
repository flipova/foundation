import type { ResolvedTheme } from '../theme';

/** Plain numbers / '#rrggbb' / 'rgba()' strings, valid as React Native and web style props. */
export type Style = Record<string, string | number | { width: number; height: number }>;

type NumericScale = 'spacing' | 'radii' | 'fontSizes' | 'fontWeights' | 'opacity' | 'duration';

/** A value of a scale, or an error naming the token the registry lacks (never a silent `undefined` style). */
export const px = (theme: ResolvedTheme, scale: NumericScale, key: string): number => {
  const v = theme.scale[scale][key];
  if (v === undefined) throw new Error(`design token ${scale}.${key} is missing from the registry`);
  return v;
};

export const weight = (theme: ResolvedTheme, key: string): string => String(px(theme, 'fontWeights', key));
