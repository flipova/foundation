import { withAlpha, type ResolvedTheme } from '../theme';
import type { ModalProps } from '../types';
import { px, weight, type Style } from './util';

export interface ModalRecipe {
  backdrop: Style;
  panel: Style;
  title: Style;
}

export function modalRecipe(_p: ModalProps, t: ResolvedTheme): ModalRecipe {
  const c = t.colors;
  const sh = t.scale.shadows.lg;
  return {
    // the scrim is the shadow colour of the registry (black in the starter), not a literal
    backdrop: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: px(t, 'spacing', '4'),
      backgroundColor: withAlpha(sh.color, 0.5),
    },
    panel: {
      width: '100%',
      maxWidth: px(t, 'spacing', '48') * 2.5,
      gap: px(t, 'spacing', '4'),
      padding: px(t, 'spacing', '6'),
      backgroundColor: c.popover,
      borderRadius: px(t, 'radii', 'xl'),
      borderWidth: 1,
      borderColor: c.border,
      shadowColor: sh.color,
      shadowOffset: { width: sh.offsetX, height: sh.offsetY },
      shadowOpacity: sh.opacity,
      shadowRadius: sh.radius,
      elevation: sh.elevation,
    },
    title: { color: c.popoverForeground, fontSize: px(t, 'fontSizes', 'lg'), fontWeight: weight(t, 'semibold') },
  };
}
