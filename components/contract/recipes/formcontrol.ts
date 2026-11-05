import type { ResolvedTheme } from '../theme';
import { px, weight, type Style } from './util';

export function formControlRecipe(
  disabled: boolean,
  t: ResolvedTheme,
): { root: Style; label: Style; required: Style; helper: Style; error: Style } {
  const c = t.colors;
  return {
    root: { gap: px(t, 'spacing', '1.5'), opacity: disabled ? 0.5 : 1 },
    label: { color: c.foreground, fontSize: px(t, 'fontSizes', 'sm'), fontWeight: weight(t, 'medium') },
    required: { color: c.destructive },
    helper: { color: c.mutedForeground, fontSize: px(t, 'fontSizes', 'xs') },
    error: { color: c.destructive, fontSize: px(t, 'fontSizes', 'xs') },
  };
}
