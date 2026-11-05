import type { ResolvedTheme } from '../theme';
import type { SkeletonProps } from '../types';
import { px, type Style } from './util';

export interface SkeletonRecipe {
  block: Style;
  /** the pulse: opacity goes from 1 to `minOpacity` and back, one way in `durationMs` */
  pulse: { minOpacity: number; durationMs: number };
}

export function skeletonRecipe(
  { width = '100%', height, circle = false }: SkeletonProps,
  t: ResolvedTheme,
): SkeletonRecipe {
  const h = height ?? px(t, 'spacing', '4');
  return {
    block: {
      width: circle ? h : width,
      height: h,
      borderRadius: px(t, 'radii', circle ? 'full' : 'md'),
      backgroundColor: t.colors.muted,
    },
    pulse: { minOpacity: px(t, 'opacity', 'dim'), durationMs: px(t, 'duration', 'slower') * 2 },
  };
}
