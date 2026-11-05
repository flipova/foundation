import { type ResolvedTheme } from '../theme';
import type { ButtonProps } from '../types';
import { px, weight, type Style } from './util';

export interface ButtonRecipe {
  container: Style;
  label: Style;
  spinner: { size: number; color: string };
}

export function buttonRecipe(
  { variant = 'default', size = 'default', disabled = false }: ButtonProps,
  t: ResolvedTheme,
): ButtonRecipe {
  const c = t.colors;
  const bg: Record<string, string> = {
    default: c.primary,
    destructive: c.destructive,
    outline: c.background,
    secondary: c.secondary,
    ghost: 'transparent',
    link: 'transparent',
  };
  const fg: Record<string, string> = {
    default: c.primaryForeground,
    destructive: '#ffffff',
    outline: c.foreground,
    secondary: c.secondaryForeground,
    ghost: c.foreground,
    link: c.primary,
  };
  const dims: Record<string, Style> = {
    default: { paddingHorizontal: px(t, 'spacing', '4'), paddingVertical: px(t, 'spacing', '2') },
    sm: { minHeight: px(t, 'spacing', '8'), paddingHorizontal: px(t, 'spacing', '3') },
    lg: { minHeight: px(t, 'spacing', '10'), paddingHorizontal: px(t, 'spacing', '8') },
    icon: { minHeight: px(t, 'spacing', '9'), minWidth: px(t, 'spacing', '9') },
  };
  const container: Style = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: px(t, 'radii', 'md'),
    gap: px(t, 'spacing', '2'),
    backgroundColor: bg[variant],
    ...dims[size],
    opacity: disabled ? 0.4 : 1,
  };
  if (variant === 'outline') {
    container.borderWidth = 1;
    container.borderColor = c.border;
  }
  const label: Style = {
    color: fg[variant],
    fontSize: px(t, 'fontSizes', size === 'sm' ? 'xs' : 'sm'),
    fontWeight: weight(t, 'medium'),
  };
  return { container, label, spinner: { size: px(t, 'spacing', '4'), color: fg[variant] } };
}
