import type { ResolvedTheme } from '../theme';
import type { FabProps } from '../types';
import { px, weight, type Style } from './util';

export function fabRecipe({ label }: FabProps, t: ResolvedTheme): { container: Style; label: Style; icon: Style } {
  const c = t.colors;
  const sh = t.scale.shadows.lg;
  const size = px(t, 'spacing', '14');
  return {
    container: {
      position: 'absolute',
      right: px(t, 'spacing', '4'),
      bottom: px(t, 'spacing', '4'),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: px(t, 'spacing', '2'),
      height: size,
      ...(label ? { paddingHorizontal: px(t, 'spacing', '5') } : { width: size }),
      borderRadius: px(t, 'radii', 'full'),
      backgroundColor: c.primary,
      shadowColor: sh.color,
      shadowOffset: { width: sh.offsetX, height: sh.offsetY },
      shadowOpacity: sh.opacity,
      shadowRadius: sh.radius,
      elevation: sh.elevation,
    },
    label: { color: c.primaryForeground, fontSize: px(t, 'fontSizes', 'sm'), fontWeight: weight(t, 'medium') },
    icon: { color: c.primaryForeground, fontSize: px(t, 'fontSizes', 'xl') },
  };
}
