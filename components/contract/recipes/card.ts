import { type ResolvedTheme } from '../theme';
import type { CardProps } from '../types';
import { px, type Style } from './util';

export function cardRecipe({ size = 'default' }: CardProps, t: ResolvedTheme): Style {
  const sh = t.scale.shadows.sm;
  return {
    flexDirection: 'column',
    backgroundColor: t.colors.card,
    borderWidth: 1,
    borderColor: t.colors.border,
    borderRadius: px(t, 'radii', 'xl'),
    padding: px(t, 'spacing', size === 'sm' ? '3' : '4'),
    gap: px(t, 'spacing', size === 'sm' ? '3' : '6'),
    shadowColor: sh.color,
    shadowOffset: { width: sh.offsetX, height: sh.offsetY },
    shadowOpacity: sh.opacity,
    shadowRadius: sh.radius,
    elevation: sh.elevation,
  };
}
