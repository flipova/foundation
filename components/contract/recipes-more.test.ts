import { describe, expect, it } from 'vitest';
import {
  daysIn,
  formatDate,
  monthGrid,
  parseDate,
  shiftMonth,
  sliderFraction,
  sliderValue,
  stackRecipe,
  gridRecipe,
  GLYPHS,
  defaultRegistry,
  resolveTheme,
} from './index';

const theme = resolveTheme(Object.keys(defaultRegistry.themes)[0]!);

describe('slider maths', () => {
  it('maps value <-> position, clamped', () => {
    expect(sliderFraction(25, 0, 100)).toBe(0.25);
    expect(sliderFraction(-5, 0, 100)).toBe(0);
    expect(sliderFraction(500, 0, 100)).toBe(1);
    expect(sliderFraction(1, 5, 5)).toBe(0);
  });
  it('snaps to the step and stays in range', () => {
    expect(sliderValue(0.33, 0, 100, 10)).toBe(30);
    expect(sliderValue(2, 0, 100, 10)).toBe(100);
    expect(sliderValue(0.5, 0, 1, 0.1)).toBe(0.5);
    expect(sliderValue(0.37, 0, 1, 0.25)).toBe(0.25);
  });
});

describe('calendar maths', () => {
  it('parses only real dates', () => {
    expect(parseDate('2024-02-29')).toEqual([2024, 2, 29]);
    expect(parseDate('2023-02-29')).toBeNull();
    expect(parseDate('2024-2-1')).toBeNull();
    expect(parseDate(undefined)).toBeNull();
  });
  it('knows month lengths, formats, and shifts across years', () => {
    expect(daysIn(2024, 2)).toBe(29);
    expect(daysIn(2023, 2)).toBe(28);
    expect(formatDate(2024, 3, 7)).toBe('2024-03-07');
    expect(shiftMonth(2024, 1, -1)).toEqual([2023, 12]);
    expect(shiftMonth(2024, 12, 1)).toEqual([2025, 1]);
  });
  it('lays the month out in weeks of 7 starting on the chosen day', () => {
    // 1 Feb 2024 is a Thursday
    const sun = monthGrid(2024, 2, { weekStartsOn: 0 });
    expect(sun.every((w) => w.length === 7)).toBe(true);
    expect(sun[0]!.findIndex((c) => c.day === 1)).toBe(4);
    const mon = monthGrid(2024, 2, { weekStartsOn: 1 });
    expect(mon[0]!.findIndex((c) => c.day === 1)).toBe(3);
    expect(sun.flat().filter((c) => c.day !== null)).toHaveLength(29);
  });
  it('disables days outside min / max', () => {
    const days = monthGrid(2024, 2, { min: '2024-02-05', max: '2024-02-20' }).flat();
    expect(days.find((c) => c.day === 4)!.disabled).toBe(true);
    expect(days.find((c) => c.day === 5)!.disabled).toBe(false);
    expect(days.find((c) => c.day === 21)!.disabled).toBe(true);
  });
});

describe('layout recipes', () => {
  it('gap comes from the spacing scale', () => {
    expect(stackRecipe('row', { space: '4' }, theme)).toEqual({ flexDirection: 'row', gap: theme.scale.spacing['4'] });
  });
  it('grid cells share the row', () => {
    expect(gridRecipe({ columns: 4 }, theme).cell.flexBasis).toBe('25.0000%');
  });
  it('every icon name has a glyph', () => {
    expect(Object.values(GLYPHS).every((g) => g.length > 0)).toBe(true);
  });
});
