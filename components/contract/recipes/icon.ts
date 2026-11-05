import type { ResolvedTheme } from '../theme';
import type { IconColor, IconName, IconProps } from '../types';
import { px, type Style } from './util';

export const GLYPHS: Record<IconName, string> = {
  check: '✓',
  close: '✕',
  'chevron-up': '▴',
  'chevron-down': '▾',
  'chevron-left': '◂',
  'chevron-right': '▸',
  plus: '+',
  minus: '−',
  search: '⌕',
  info: 'ⓘ',
  warning: '⚠',
  star: '★',
  menu: '☰',
  dot: '●',
};

export function iconColor(color: IconColor, t: ResolvedTheme): string {
  const c = t.colors;
  return {
    foreground: c.foreground,
    muted: c.mutedForeground,
    primary: c.primary,
    destructive: c.destructive,
    success: c.success,
    warning: c.warning,
    info: c.info,
  }[color];
}

export function iconRecipe(
  { name, size = 'md', color = 'foreground' }: IconProps,
  t: ResolvedTheme,
): { glyph: string; style: Style } {
  return { glyph: GLYPHS[name], style: { color: iconColor(color, t), fontSize: px(t, 'fontSizes', size) } };
}
