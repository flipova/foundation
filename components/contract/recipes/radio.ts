import type { ResolvedTheme } from '../theme';
import type { RadioGroupProps } from '../types';
import { px, type Style } from './util';

export interface RadioRecipe {
  group: Style;
  row: Style;
  circle: (selected: boolean) => Style;
  dot: Style;
  label: Style;
}

export function radioRecipe(
  { orientation = 'vertical', disabled = false }: RadioGroupProps,
  t: ResolvedTheme,
): RadioRecipe {
  const c = t.colors;
  const size = px(t, 'spacing', '5');
  const dot = px(t, 'spacing', '2.5');
  return {
    group: {
      flexDirection: orientation === 'horizontal' ? 'row' : 'column',
      gap: px(t, 'spacing', orientation === 'horizontal' ? '4' : '2'),
      opacity: disabled ? 0.4 : 1,
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: px(t, 'spacing', '2') },
    circle: (selected) => ({
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: px(t, 'radii', 'full'),
      borderWidth: 1,
      borderColor: selected ? c.primary : c.input,
    }),
    dot: { width: dot, height: dot, borderRadius: px(t, 'radii', 'full'), backgroundColor: c.primary },
    label: { color: c.foreground, fontSize: px(t, 'fontSizes', 'sm') },
  };
}
