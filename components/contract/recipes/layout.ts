import type { ResolvedTheme } from '../theme';
import type { GridProps, ImageProps, StackProps } from '../types';
import { px, type Style } from './util';

export const DEFAULT_SPACE = '2';

/** gap of a stack / grid, from a spacing step */
export function stackRecipe(
  direction: 'row' | 'column',
  { space = DEFAULT_SPACE }: StackProps,
  t: ResolvedTheme,
): Style {
  return { flexDirection: direction, gap: px(t, 'spacing', space) };
}

export function centerRecipe(): Style {
  return { alignItems: 'center', justifyContent: 'center' };
}

export function gridRecipe(
  { columns = 2, space = DEFAULT_SPACE }: GridProps,
  t: ResolvedTheme,
): { container: Style; cell: Style } {
  const gap = px(t, 'spacing', space);
  const n = Math.max(1, Math.floor(columns));
  // each cell takes an equal share of the row, minus its share of the gaps
  return {
    container: { flexDirection: 'row', flexWrap: 'wrap', gap },
    cell: {
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: `${(100 / n).toFixed(4)}%`,
      maxWidth: `calc(${(100 / n).toFixed(4)}% - ${(gap * (n - 1)) / n}px)`,
    },
  };
}

export function imageRecipe({ width, height, radius }: ImageProps, t: ResolvedTheme): Style {
  const s: Style = {};
  if (width !== undefined) s.width = width;
  if (height !== undefined) s.height = height;
  if (radius) s.borderRadius = px(t, 'radii', radius);
  return s;
}
