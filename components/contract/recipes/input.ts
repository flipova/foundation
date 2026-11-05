import { withAlpha, type ResolvedTheme } from '../theme';
import type { InputProps } from '../types';
import { px, type Style } from './util';

export interface InputRecipe {
  container: Style;
  field: Style;
  placeholderTextColor: string;
  /** border colour when focused, for providers that render focus themselves */
  focusBorderColor: string;
}

export function inputRecipe({ disabled = false, invalid = false }: InputProps, t: ResolvedTheme): InputRecipe {
  const c = t.colors;
  return {
    container: {
      height: px(t, 'spacing', '9'),
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: px(t, 'spacing', '2'),
      paddingHorizontal: px(t, 'spacing', '3'),
      borderRadius: px(t, 'radii', 'md'),
      borderWidth: 1,
      borderColor: invalid ? withAlpha(c.destructive, 0.4) : c.border,
      backgroundColor: 'transparent',
      opacity: disabled ? 0.5 : 1,
    },
    field: {
      flex: 1,
      height: '100%',
      color: c.foreground,
      fontSize: px(t, 'fontSizes', 'sm'),
      paddingVertical: px(t, 'spacing', '1'),
    },
    placeholderTextColor: c.mutedForeground,
    focusBorderColor: c.ring,
  };
}
