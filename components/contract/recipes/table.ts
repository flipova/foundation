import type { ResolvedTheme } from '../theme';
import type { TableColumn } from '../types';
import { px, weight, type Style } from './util';

export interface TableRecipe {
  container: Style;
  caption: Style;
  headRow: Style;
  row: (last: boolean) => Style;
  head: (align: TableColumn['align']) => Style;
  cell: (align: TableColumn['align']) => Style;
  headLabel: Style;
  cellLabel: Style;
}

export function tableRecipe(t: ResolvedTheme): TableRecipe {
  const c = t.colors;
  const align = (a: TableColumn['align'] = 'left') => ({ left: 'flex-start', center: 'center', right: 'flex-end' })[a];
  const pad = { paddingHorizontal: px(t, 'spacing', '3'), paddingVertical: px(t, 'spacing', '2') };
  return {
    container: {
      width: '100%',
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: px(t, 'radii', 'lg'),
      overflow: 'hidden',
      backgroundColor: c.card,
    },
    caption: { color: c.mutedForeground, fontSize: px(t, 'fontSizes', 'xs'), padding: px(t, 'spacing', '2') },
    headRow: { flexDirection: 'row', backgroundColor: c.muted, borderBottomWidth: 1, borderBottomColor: c.border },
    row: (last) => ({ flexDirection: 'row', borderBottomWidth: last ? 0 : 1, borderBottomColor: c.border }),
    head: (a) => ({ flex: 1, ...pad, alignItems: align(a) }),
    cell: (a) => ({ flex: 1, ...pad, alignItems: align(a) }),
    headLabel: { color: c.mutedForeground, fontSize: px(t, 'fontSizes', 'xs'), fontWeight: weight(t, 'semibold') },
    cellLabel: { color: c.cardForeground, fontSize: px(t, 'fontSizes', 'sm') },
  };
}
