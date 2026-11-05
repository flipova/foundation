import type { ResolvedTheme } from '../theme';
import type { HeadingProps } from '../types';
import { px, weight, type Style } from './util';

const SIZE = { 1: '4xl', 2: '3xl', 3: '2xl', 4: 'xl', 5: 'lg', 6: 'md' } as const;

export function headingRecipe({ level = 2 }: HeadingProps, t: ResolvedTheme): Style {
  const fontSize = px(t, 'fontSizes', SIZE[level]);
  return {
    color: t.colors.foreground,
    fontSize,
    fontWeight: weight(t, level <= 4 ? 'bold' : 'semibold'),
    // tighter tracking on the large levels, expressed (as the registry does) as a fraction of the size
    letterSpacing: level <= 2 ? Math.round(fontSize * t.scale.letterSpacings.tight * 100) / 100 : 0,
  };
}
