import { withAlpha, type ResolvedTheme } from '../theme';
import type { TextareaProps } from '../types';
import { px, type Style } from './util';

export interface TextareaRecipe {
  field: Style;
  placeholderTextColor: string;
  focusBorderColor: string;
}

export function textareaRecipe(
  { rows = 4, disabled = false, invalid = false }: TextareaProps,
  t: ResolvedTheme,
): TextareaRecipe {
  const c = t.colors;
  const line = t.scale.lineHeights.sm;
  const pad = px(t, 'spacing', '2');
  return {
    field: {
      width: '100%',
      minHeight: rows * line + 2 * pad + 2,
      paddingHorizontal: px(t, 'spacing', '3'),
      paddingVertical: pad,
      borderRadius: px(t, 'radii', 'md'),
      borderWidth: 1,
      borderColor: invalid ? withAlpha(c.destructive, 0.4) : c.border,
      backgroundColor: 'transparent',
      color: c.foreground,
      fontSize: px(t, 'fontSizes', 'sm'),
      lineHeight: line,
      textAlignVertical: 'top',
      opacity: disabled ? 0.5 : 1,
    },
    placeholderTextColor: c.mutedForeground,
    focusBorderColor: c.ring,
  };
}
