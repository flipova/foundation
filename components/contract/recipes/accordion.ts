import type { ResolvedTheme } from '../theme';
import { px, weight, type Style } from './util';

export interface AccordionRecipe {
  container: Style;
  item: Style;
  header: (open: boolean, disabled: boolean) => Style;
  title: Style;
  chevron: Style;
  content: Style;
}

export function accordionRecipe(t: ResolvedTheme): AccordionRecipe {
  const c = t.colors;
  return {
    container: {
      width: '100%',
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: px(t, 'radii', 'lg'),
      backgroundColor: c.card,
      overflow: 'hidden',
    },
    item: { borderBottomWidth: 1, borderBottomColor: c.border },
    header: (_open, disabled) => ({
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: px(t, 'spacing', '2'),
      paddingHorizontal: px(t, 'spacing', '4'),
      paddingVertical: px(t, 'spacing', '3'),
      opacity: disabled ? 0.4 : 1,
    }),
    title: { flex: 1, color: c.cardForeground, fontSize: px(t, 'fontSizes', 'sm'), fontWeight: weight(t, 'medium') },
    chevron: { color: c.mutedForeground, fontSize: px(t, 'fontSizes', 'sm') },
    content: {
      paddingHorizontal: px(t, 'spacing', '4'),
      paddingBottom: px(t, 'spacing', '4'),
      gap: px(t, 'spacing', '2'),
    },
  };
}
