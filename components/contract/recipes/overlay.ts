import { withAlpha, type ResolvedTheme } from '../theme';
import { px, weight, type Style } from './util';

const shadow = (t: ResolvedTheme, key: 'md' | 'lg' | 'xl'): Style => {
  const sh = t.scale.shadows[key];
  return {
    shadowColor: sh.color,
    shadowOffset: { width: sh.offsetX, height: sh.offsetY },
    shadowOpacity: sh.opacity,
    shadowRadius: sh.radius,
    elevation: sh.elevation,
  };
};

/** the surface every floating panel shares: popover colour, border, radius, shadow */
function surface(t: ResolvedTheme, radius: string, sh: 'md' | 'lg' | 'xl'): Style {
  return {
    backgroundColor: t.colors.popover,
    borderWidth: 1,
    borderColor: t.colors.border,
    borderRadius: px(t, 'radii', radius),
    ...shadow(t, sh),
  };
}

/** the dim layer behind a modal surface: the registry's shadow colour, not a literal */
export const scrim = (t: ResolvedTheme): string => withAlpha(t.scale.shadows.lg.color, 0.5);

export function popoverRecipe(t: ResolvedTheme): { panel: Style } {
  return {
    panel: {
      ...surface(t, 'md', 'md'),
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: px(t, 'spacing', '1'),
      minWidth: px(t, 'spacing', '48'),
      padding: px(t, 'spacing', '3'),
      gap: px(t, 'spacing', '2'),
      zIndex: t.scale.zIndex.popover,
    },
  };
}

export function tooltipRecipe(t: ResolvedTheme): { bubble: Style; label: Style } {
  return {
    bubble: {
      position: 'absolute',
      bottom: '100%',
      alignSelf: 'center',
      marginBottom: px(t, 'spacing', '1'),
      paddingHorizontal: px(t, 'spacing', '2'),
      paddingVertical: px(t, 'spacing', '1'),
      borderRadius: px(t, 'radii', 'sm'),
      backgroundColor: t.colors.foreground,
      zIndex: t.scale.zIndex.tooltip,
    },
    label: { color: t.colors.background, fontSize: px(t, 'fontSizes', 'xs') },
  };
}

export interface MenuRecipe {
  panel: Style;
  item: (disabled: boolean) => Style;
  label: (destructive: boolean) => Style;
}

export function menuRecipe(t: ResolvedTheme): MenuRecipe {
  const c = t.colors;
  return {
    panel: {
      ...surface(t, 'md', 'md'),
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: px(t, 'spacing', '1'),
      minWidth: px(t, 'spacing', '40'),
      padding: px(t, 'spacing', '1'),
      zIndex: t.scale.zIndex.dropdown,
    },
    item: (disabled) => ({
      paddingHorizontal: px(t, 'spacing', '2'),
      paddingVertical: px(t, 'spacing', '1.5'),
      borderRadius: px(t, 'radii', 'sm'),
      opacity: disabled ? 0.4 : 1,
    }),
    label: (destructive) => ({
      color: destructive ? c.destructive : c.popoverForeground,
      fontSize: px(t, 'fontSizes', 'sm'),
    }),
  };
}

export interface SheetRecipe {
  backdrop: Style;
  panel: Style;
  title: Style;
  handle: Style;
  action: Style;
  actionLabel: (destructive: boolean) => Style;
  cancel: Style;
  cancelLabel: Style;
}

/** action sheet and bottom sheet: a panel that sticks to the bottom edge */
export function sheetRecipe(t: ResolvedTheme): SheetRecipe {
  const c = t.colors;
  return {
    backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: scrim(t) },
    panel: {
      ...surface(t, 'xl', 'xl'),
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      width: '100%',
      padding: px(t, 'spacing', '4'),
      gap: px(t, 'spacing', '2'),
    },
    title: {
      color: c.mutedForeground,
      fontSize: px(t, 'fontSizes', 'sm'),
      textAlign: 'center',
      paddingVertical: px(t, 'spacing', '1'),
    },
    handle: {
      alignSelf: 'center',
      width: px(t, 'spacing', '10'),
      height: px(t, 'spacing', '1'),
      borderRadius: px(t, 'radii', 'full'),
      backgroundColor: c.border,
      marginBottom: px(t, 'spacing', '2'),
    },
    action: {
      paddingVertical: px(t, 'spacing', '3'),
      alignItems: 'center',
      borderRadius: px(t, 'radii', 'md'),
      backgroundColor: c.muted,
    },
    actionLabel: (destructive) => ({
      color: destructive ? c.destructive : c.foreground,
      fontSize: px(t, 'fontSizes', 'md'),
      fontWeight: weight(t, 'medium'),
    }),
    cancel: {
      paddingVertical: px(t, 'spacing', '3'),
      alignItems: 'center',
      borderRadius: px(t, 'radii', 'md'),
      borderWidth: 1,
      borderColor: c.border,
    },
    cancelLabel: { color: c.foreground, fontSize: px(t, 'fontSizes', 'md') },
  };
}

export interface AlertDialogRecipe {
  backdrop: Style;
  panel: Style;
  title: Style;
  description: Style;
  actions: Style;
}

export function alertDialogRecipe(t: ResolvedTheme): AlertDialogRecipe {
  const c = t.colors;
  return {
    backdrop: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: px(t, 'spacing', '4'),
      backgroundColor: scrim(t),
    },
    panel: {
      ...surface(t, 'xl', 'lg'),
      width: '100%',
      maxWidth: px(t, 'spacing', '48') * 2,
      padding: px(t, 'spacing', '6'),
      gap: px(t, 'spacing', '2'),
    },
    title: { color: c.popoverForeground, fontSize: px(t, 'fontSizes', 'lg'), fontWeight: weight(t, 'semibold') },
    description: { color: c.mutedForeground, fontSize: px(t, 'fontSizes', 'sm') },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: px(t, 'spacing', '2'),
      marginTop: px(t, 'spacing', '4'),
    },
  };
}

export function drawerRecipe(side: 'left' | 'right', t: ResolvedTheme): { backdrop: Style; panel: Style } {
  return {
    backdrop: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: side === 'left' ? 'flex-start' : 'flex-end',
      backgroundColor: scrim(t),
    },
    panel: {
      ...surface(t, 'none', 'xl'),
      height: '100%',
      width: px(t, 'spacing', '48') * 1.5,
      maxWidth: '85%',
      padding: px(t, 'spacing', '4'),
      gap: px(t, 'spacing', '2'),
      borderWidth: 0,
      [side === 'left' ? 'borderRightWidth' : 'borderLeftWidth']: 1,
    },
  };
}

export function imageViewerRecipe(t: ResolvedTheme): {
  backdrop: Style;
  image: Style;
  close: Style;
  closeLabel: Style;
} {
  return {
    backdrop: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: withAlpha(t.scale.shadows.lg.color, 0.92),
    },
    image: { width: '100%', height: '80%' },
    close: {
      position: 'absolute',
      top: px(t, 'spacing', '10'),
      right: px(t, 'spacing', '4'),
      width: px(t, 'spacing', '10'),
      height: px(t, 'spacing', '10'),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: px(t, 'radii', 'full'),
      backgroundColor: withAlpha(t.colors.background, 0.2),
    },
    closeLabel: { color: t.colors.background, fontSize: px(t, 'fontSizes', 'lg') },
  };
}

/** A translucent surface: the card colour at partial opacity over whatever is behind it. */
export function liquidGlassRecipe(t: ResolvedTheme): Style {
  return {
    backgroundColor: withAlpha(t.colors.card, 0.6),
    borderWidth: 1,
    borderColor: withAlpha(t.colors.border, 0.6),
    borderRadius: px(t, 'radii', 'xl'),
    padding: px(t, 'spacing', '4'),
    ...shadow(t, 'md'),
  };
}
