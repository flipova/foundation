import type { ResolvedTheme } from '../theme';
import type { DividerProps } from '../types';
import type { Style } from './util';

export function dividerRecipe({ orientation = 'horizontal' }: DividerProps, t: ResolvedTheme): Style {
  return orientation === 'vertical'
    ? { width: 1, alignSelf: 'stretch', backgroundColor: t.colors.border }
    : { height: 1, width: '100%', backgroundColor: t.colors.border };
}
