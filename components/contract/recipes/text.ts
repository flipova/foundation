import { type ResolvedTheme } from '../theme';
import type { TextProps } from '../types';
import { px, weight, type Style } from './util';

export function textRecipe({ size = 'md', bold, underline, strikeThrough }: TextProps, t: ResolvedTheme): Style {
  const style: Style = { color: t.colors.foreground, fontSize: px(t, 'fontSizes', size) };
  if (bold) style.fontWeight = weight(t, 'bold');
  if (underline || strikeThrough)
    style.textDecorationLine =
      underline && strikeThrough ? 'underline line-through' : underline ? 'underline' : 'line-through';
  return style;
}
