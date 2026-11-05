import type { ResolvedTheme } from '../theme';
import type { TabsProps } from '../types';
import { px, weight, type Style } from './util';

export interface TabsRecipe {
  list: Style;
  tab: (active: boolean, disabled: boolean) => Style;
  label: (active: boolean) => Style;
  panel: Style;
}

export function tabsRecipe(_p: TabsProps, t: ResolvedTheme): TabsRecipe {
  const c = t.colors;
  return {
    list: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: c.border },
    tab: (active, disabled) => ({
      paddingHorizontal: px(t, 'spacing', '4'),
      paddingVertical: px(t, 'spacing', '2'),
      borderBottomWidth: 2,
      marginBottom: -1,
      borderBottomColor: active ? c.primary : 'transparent',
      opacity: disabled ? 0.4 : 1,
    }),
    label: (active) => ({
      color: active ? c.foreground : c.mutedForeground,
      fontSize: px(t, 'fontSizes', 'sm'),
      fontWeight: weight(t, 'medium'),
    }),
    panel: { paddingTop: px(t, 'spacing', '4') },
  };
}
