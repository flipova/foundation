import type { ResolvedTheme } from '../theme';
import { px, type Style } from './util';

export function linkRecipe(t: ResolvedTheme): Style {
  return { color: t.colors.primary, fontSize: px(t, 'fontSizes', 'md'), textDecorationLine: 'underline' };
}
