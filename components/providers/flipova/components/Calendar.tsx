import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  calendarRecipe,
  iconRecipe,
  MONTHS,
  monthGrid,
  parseDate,
  shiftMonth,
  WEEKDAYS,
  type CalendarProps,
} from '../../../contract';
import { useResolvedTheme } from '../../provider';

const initial = (p: CalendarProps): [number, number] => {
  const m = /^(\d{4})-(\d{2})$/.exec(p.month ?? '');
  if (m) return [Number(m[1]), Number(m[2])];
  const d = parseDate(p.value);
  if (d) return [d[0], d[1]];
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1];
};

export function Calendar(p: CalendarProps) {
  const t = useResolvedTheme();
  const r = calendarRecipe(t);
  const [[y, m], setYm] = useState<[number, number]>(() => initial(p));
  const start = p.weekStartsOn ?? 0;
  const weekdays = [...WEEKDAYS.slice(start), ...WEEKDAYS.slice(0, start)];
  const go = (by: number) => setYm(([yy, mm]) => shiftMonth(yy, mm, by));
  return (
    <View testID={p.testID} style={r.container as never}>
      <View style={r.header as never}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          onPress={() => go(-1)}
          style={r.nav as never}
        >
          <Text style={r.navLabel as never}>{iconRecipe({ name: 'chevron-left' }, t).glyph}</Text>
        </Pressable>
        <Text accessibilityRole="header" style={r.title as never}>
          {MONTHS[m - 1]} {y}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          onPress={() => go(1)}
          style={r.nav as never}
        >
          <Text style={r.navLabel as never}>{iconRecipe({ name: 'chevron-right' }, t).glyph}</Text>
        </Pressable>
      </View>
      <View style={r.weekRow as never}>
        {weekdays.map((d) => (
          <Text key={d} style={r.weekday as never}>
            {d}
          </Text>
        ))}
      </View>
      {monthGrid(y, m, p).map((week, wi) => (
        <View key={wi} style={r.row as never}>
          {week.map((c, ci) =>
            c.date === null ? (
              <View key={ci} style={r.day(false, true) as never} />
            ) : (
              <Pressable
                key={ci}
                accessibilityRole="button"
                accessibilityLabel={c.date}
                aria-selected={c.date === p.value}
                aria-disabled={c.disabled || undefined}
                disabled={c.disabled}
                onPress={() => p.onChange?.(c.date as string)}
                style={r.day(c.date === p.value, c.disabled) as never}
              >
                <Text style={r.dayLabel(c.date === p.value, c.disabled) as never}>{c.day}</Text>
              </Pressable>
            ),
          )}
        </View>
      ))}
    </View>
  );
}
