import type { ResolvedTheme } from '../theme';
import type { CalendarProps } from '../types';
import { px, weight, type Style } from './util';

const pad2 = (n: number) => String(n).padStart(2, '0');

/** 'YYYY-MM-DD' -> [y, m(1-12), d]; null when it is not a real date */
export function parseDate(s: string | undefined): [number, number, number] | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s ?? '');
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d ? [y, mo, d] : null;
}

export const formatDate = (y: number, m: number, d: number) => `${String(y).padStart(4, '0')}-${pad2(m)}-${pad2(d)}`;
export const daysIn = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

/** 'YYYY-MM' of a month shifted by `by` months */
export function shiftMonth(y: number, m: number, by: number): [number, number] {
  const idx = y * 12 + (m - 1) + by;
  return [Math.floor(idx / 12), (idx % 12) + 1];
}

export interface Cell {
  /** 'YYYY-MM-DD', or null for the blanks before the 1st and after the last day */
  date: string | null;
  day: number | null;
  disabled: boolean;
}

/** The month as rows of 7 cells, the first column being Sunday (weekStartsOn 0) or Monday (1). */
export function monthGrid(
  y: number,
  m: number,
  { weekStartsOn = 0, min, max }: Pick<CalendarProps, 'weekStartsOn' | 'min' | 'max'>,
): Cell[][] {
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const lead = (first - weekStartsOn + 7) % 7;
  const cells: Cell[] = Array.from({ length: lead }, () => ({ date: null, day: null, disabled: true }));
  for (let d = 1; d <= daysIn(y, m); d++) {
    const date = formatDate(y, m, d);
    cells.push({ date, day: d, disabled: (!!min && date < min) || (!!max && date > max) });
  }
  while (cells.length % 7) cells.push({ date: null, day: null, disabled: true });
  return Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
}

export const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export interface CalendarRecipe {
  container: Style;
  header: Style;
  title: Style;
  nav: Style;
  navLabel: Style;
  weekRow: Style;
  weekday: Style;
  row: Style;
  day: (selected: boolean, disabled: boolean) => Style;
  dayLabel: (selected: boolean, disabled: boolean) => Style;
}

export function calendarRecipe(t: ResolvedTheme): CalendarRecipe {
  const c = t.colors;
  const cell = px(t, 'spacing', '10');
  return {
    container: {
      padding: px(t, 'spacing', '3'),
      gap: px(t, 'spacing', '2'),
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: px(t, 'radii', 'lg'),
      alignSelf: 'flex-start',
    },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { color: c.cardForeground, fontSize: px(t, 'fontSizes', 'sm'), fontWeight: weight(t, 'semibold') },
    nav: {
      width: px(t, 'spacing', '8'),
      height: px(t, 'spacing', '8'),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: px(t, 'radii', 'md'),
    },
    navLabel: { color: c.mutedForeground, fontSize: px(t, 'fontSizes', 'md') },
    weekRow: { flexDirection: 'row' },
    weekday: { width: cell, textAlign: 'center', color: c.mutedForeground, fontSize: px(t, 'fontSizes', 'xs') },
    row: { flexDirection: 'row' },
    day: (selected, disabled) => ({
      width: cell,
      height: cell,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: px(t, 'radii', 'md'),
      backgroundColor: selected ? c.primary : 'transparent',
      opacity: disabled ? 0.3 : 1,
    }),
    dayLabel: (selected) => ({
      color: selected ? c.primaryForeground : c.cardForeground,
      fontSize: px(t, 'fontSizes', 'sm'),
    }),
  };
}
