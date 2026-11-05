import { withAlpha, type ResolvedTheme } from '../theme';
import type { SelectProps } from '../types';
import { px, weight, type Style } from './util';

export interface SelectRecipe {
  trigger: Style;
  triggerLabel: Style;
  placeholderColor: string;
  menu: Style;
  option: Style;
  optionSelected: Style;
  optionLabel: Style;
  optionLabelSelected: Style;
  disabledOptionOpacity: number;
  focusBorderColor: string;
}

export function selectRecipe({ disabled = false, invalid = false }: SelectProps, t: ResolvedTheme): SelectRecipe {
  const c = t.colors;
  const sh = t.scale.shadows.md;
  return {
    trigger: {
      height: px(t, 'spacing', '9'),
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: px(t, 'spacing', '2'),
      paddingHorizontal: px(t, 'spacing', '3'),
      borderRadius: px(t, 'radii', 'md'),
      borderWidth: 1,
      borderColor: invalid ? withAlpha(c.destructive, 0.4) : c.border,
      backgroundColor: 'transparent',
      opacity: disabled ? 0.5 : 1,
    },
    triggerLabel: { flex: 1, color: c.foreground, fontSize: px(t, 'fontSizes', 'sm') },
    placeholderColor: c.mutedForeground,
    menu: {
      marginTop: px(t, 'spacing', '1'),
      padding: px(t, 'spacing', '1'),
      maxHeight: px(t, 'spacing', '48') + px(t, 'spacing', '12'),
      backgroundColor: c.popover,
      borderRadius: px(t, 'radii', 'md'),
      borderWidth: 1,
      borderColor: c.border,
      shadowColor: sh.color,
      shadowOffset: { width: sh.offsetX, height: sh.offsetY },
      shadowOpacity: sh.opacity,
      shadowRadius: sh.radius,
      elevation: sh.elevation,
    },
    option: {
      paddingHorizontal: px(t, 'spacing', '2'),
      paddingVertical: px(t, 'spacing', '1.5'),
      borderRadius: px(t, 'radii', 'sm'),
    },
    optionSelected: { backgroundColor: c.accent },
    optionLabel: { color: c.popoverForeground, fontSize: px(t, 'fontSizes', 'sm') },
    optionLabelSelected: { color: c.accentForeground, fontWeight: weight(t, 'medium') },
    disabledOptionOpacity: 0.4,
    focusBorderColor: c.ring,
  };
}
