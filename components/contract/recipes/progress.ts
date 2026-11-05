import type { ResolvedTheme } from '../theme';
import type { ProgressProps } from '../types';
import { px, type Style } from './util';

const HEIGHT = { sm: '1', md: '2', lg: '3' } as const;

export interface ProgressRecipe {
  track: Style;
  bar: Style;
  /** the value, clamped to 0..100 */
  value: number;
}

export function progressRecipe({ value, size = 'md' }: ProgressProps, t: ResolvedTheme): ProgressRecipe {
  const pct = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
  return {
    value: pct,
    track: {
      width: '100%',
      height: px(t, 'spacing', HEIGHT[size]),
      borderRadius: px(t, 'radii', 'full'),
      overflow: 'hidden',
      backgroundColor: t.colors.muted,
    },
    bar: { width: `${pct}%`, height: '100%', borderRadius: px(t, 'radii', 'full'), backgroundColor: t.colors.primary },
  };
}
