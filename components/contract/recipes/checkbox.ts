import { withAlpha, type ResolvedTheme } from '../theme';
import type { CheckboxProps } from '../types';
import { px, type Style } from './util';

export interface CheckboxRecipe {
  row: Style;
  box: Style;
  mark: { color: string; fontSize: number };
  label: Style;
}

export function checkboxRecipe(
  { checked = false, disabled = false, invalid = false }: CheckboxProps,
  t: ResolvedTheme,
): CheckboxRecipe {
  const c = t.colors;
  const size = px(t, 'spacing', '5');
  return {
    row: { flexDirection: 'row', alignItems: 'center', gap: px(t, 'spacing', '2'), opacity: disabled ? 0.4 : 1 },
    box: {
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: px(t, 'radii', 'sm'),
      borderWidth: 1,
      borderColor: invalid ? withAlpha(c.destructive, 0.6) : checked ? c.primary : c.input,
      backgroundColor: checked ? c.primary : 'transparent',
    },
    mark: { color: c.primaryForeground, fontSize: px(t, 'fontSizes', 'xs') },
    label: { color: c.foreground, fontSize: px(t, 'fontSizes', 'sm') },
  };
}
