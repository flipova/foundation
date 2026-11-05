import { type ResolvedTheme } from '../theme';
import type { BadgeProps } from '../types';
import { px, weight, type Style } from './util';

export interface BadgeRecipe {
  container: Style;
  label: Style;
}

export function badgeRecipe({ variant = 'default' }: BadgeProps, t: ResolvedTheme): BadgeRecipe {
  const c = t.colors;
  const bg: Record<string, string> = {
    default: c.primary,
    secondary: c.secondary,
    destructive: c.destructive,
    outline: 'transparent',
  };
  const fg: Record<string, string> = {
    default: c.primaryForeground,
    secondary: c.secondaryForeground,
    destructive: '#ffffff',
    outline: c.foreground,
  };
  const container: Style = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: px(t, 'radii', 'sm'),
    paddingHorizontal: px(t, 'spacing', '2'),
    paddingVertical: px(t, 'spacing', '0.5'),
    backgroundColor: bg[variant],
  };
  if (variant === 'outline') {
    container.borderWidth = 1;
    container.borderColor = c.border;
  }
  return {
    container,
    label: {
      color: fg[variant],
      fontSize: px(t, 'fontSizes', 'xs'),
      fontWeight: weight(t, 'medium'),
      textTransform: 'uppercase',
    },
  };
}
