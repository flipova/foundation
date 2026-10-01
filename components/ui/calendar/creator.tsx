/**
 * Local replacement for the (unpublished) `@gluestack-ui/core/calendar/creator`
 * module. Implements an actual date-selection engine (single/multiple/range
 * modes, month/year navigation, day-grid generation, min/max bounds, markers)
 * driving the styled slot components defined in `./index.tsx`.
 */
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export type CalendarMode = 'single' | 'multiple' | 'range';

export interface DayState {
  isSelected?: boolean;
  isToday?: boolean;
  isDisabled?: boolean;
  isOutsideMonth?: boolean;
  isInRange?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
}

export interface CalendarMarker {
  date: Date;
  color?: string;
}
export type CalendarMarkers = CalendarMarker[];

export interface ICalendarProps {
  mode?: CalendarMode;
  value?: Date | Date[] | { from: Date; to?: Date };
  defaultValue?: Date | Date[] | { from: Date; to?: Date };
  onValueChange?: (value: any) => void;
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  disabledDates?: Date[] | ((date: Date) => boolean);
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  markers?: CalendarMarkers;
  showWeekNumbers?: boolean;
  showFooter?: boolean;
  disabled?: boolean;
}

/* ---- date helpers (no external date library) ---- */

const DAY_MS = 86400000;
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function isSameDay(a?: Date, b?: Date) {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function startOfMonthDate(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function monthIndex(d: Date) {
  return d.getFullYear() * 12 + d.getMonth();
}
function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function buildMonthGrid(monthDate: Date, weekStartsOn: number): Date[][] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const offset = (firstWeekday - weekStartsOn + 7) % 7;
  const total = daysInMonth(year, month);
  const lastWeekday = new Date(year, month, total).getDay();
  const endOffset = (weekStartsOn + 6 - lastWeekday + 7) % 7;
  const cells = offset + total + endOffset;
  const weeks: Date[][] = [];
  for (let w = 0; w < cells / 7; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(year, month, 1 - offset + w * 7 + d));
    }
    weeks.push(week);
  }
  return weeks;
}
function getWeekNumber(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / DAY_MS + 1) / 7);
}
function isDateDisabled(date: Date, props: Pick<ICalendarProps, 'minimumDate' | 'maximumDate' | 'disabledDates' | 'disabled'>) {
  if (props.disabled) return true;
  if (props.minimumDate && stripTime(date) < stripTime(props.minimumDate)) return true;
  if (props.maximumDate && stripTime(date) > stripTime(props.maximumDate)) return true;
  if (props.disabledDates) {
    if (typeof props.disabledDates === 'function') return props.disabledDates(date);
    return props.disabledDates.some((d) => isSameDay(d, date));
  }
  return false;
}

export interface CreateCalendarConfig {
  Root: React.ComponentType<any>;
  Header: React.ComponentType<any>;
  HeaderPrevButton: React.ComponentType<any>;
  HeaderNextButton: React.ComponentType<any>;
  HeaderTitle: React.ComponentType<any>;
  HeaderMonthSelect: React.ComponentType<any>;
  HeaderYearSelect: React.ComponentType<any>;
  WeekDaysHeader: React.ComponentType<any>;
  WeekDay: React.ComponentType<any>;
  Body: React.ComponentType<any>;
  Grid: React.ComponentType<any>;
  Week: React.ComponentType<any>;
  Day: React.ComponentType<any>;
  DayText: React.ComponentType<any>;
  DayIndicator: React.ComponentType<any>;
  WeekNumber: React.ComponentType<any>;
  Footer: React.ComponentType<any>;
}

export function createCalendar(slots: CreateCalendarConfig) {
  const {
    Root, Header, HeaderPrevButton, HeaderNextButton, HeaderMonthSelect, HeaderYearSelect,
    WeekDaysHeader, WeekDay, Body, Grid, Week, Day, DayText, DayIndicator, WeekNumber, Footer,
  } = slots;

  const Calendar = React.forwardRef<any, ICalendarProps & { className?: string }>(function Calendar(props, ref) {
    const {
      mode = 'single',
      value,
      defaultValue,
      onValueChange,
      month: controlledMonth,
      defaultMonth,
      onMonthChange,
      minimumDate,
      maximumDate,
      disabledDates,
      weekStartsOn = 0,
      markers,
      showWeekNumbers = false,
      showFooter = true,
      disabled,
      className,
      ...rest
    } = props as any;

    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
    const currentValue = value !== undefined ? value : uncontrolledValue;

    const [uncontrolledMonth, setUncontrolledMonth] = React.useState<Date>(() => {
      if (controlledMonth) return startOfMonthDate(controlledMonth);
      if (defaultMonth) return startOfMonthDate(defaultMonth);
      if (mode === 'single' && currentValue instanceof Date) return startOfMonthDate(currentValue);
      if (mode === 'range' && currentValue?.from) return startOfMonthDate(currentValue.from);
      if (mode === 'multiple' && Array.isArray(currentValue) && currentValue[0]) return startOfMonthDate(currentValue[0]);
      return startOfMonthDate(new Date());
    });
    const displayedMonth = controlledMonth ? startOfMonthDate(controlledMonth) : uncontrolledMonth;

    const setDisplayedMonth = React.useCallback(
      (next: Date) => {
        if (!controlledMonth) setUncontrolledMonth(next);
        onMonthChange?.(next);
      },
      [controlledMonth, onMonthChange]
    );

    const setValue = React.useCallback(
      (next: any) => {
        if (value === undefined) setUncontrolledValue(next);
        onValueChange?.(next);
      },
      [value, onValueChange]
    );

    const handleDayPress = React.useCallback(
      (date: Date) => {
        if (isDateDisabled(date, { minimumDate, maximumDate, disabledDates, disabled })) return;

        if (mode === 'multiple') {
          const arr: Date[] = Array.isArray(currentValue) ? currentValue : [];
          const exists = arr.some((d) => isSameDay(d, date));
          setValue(exists ? arr.filter((d) => !isSameDay(d, date)) : [...arr, date]);
        } else if (mode === 'range') {
          const range = currentValue as { from: Date; to?: Date } | undefined;
          if (!range?.from || (range.from && range.to)) {
            setValue({ from: date, to: undefined });
          } else if (date < range.from) {
            setValue({ from: date, to: range.from });
          } else {
            setValue({ from: range.from, to: date });
          }
        } else {
          setValue(date);
        }
      },
      [mode, currentValue, setValue, minimumDate, maximumDate, disabledDates, disabled]
    );

    const weeks = React.useMemo(() => buildMonthGrid(displayedMonth, weekStartsOn), [displayedMonth, weekStartsOn]);
    const weekDayLabels = React.useMemo(
      () => Array.from({ length: 7 }, (_, i) => WEEKDAY_LABELS[(weekStartsOn + i) % 7]),
      [weekStartsOn]
    );
    const today = React.useMemo(() => new Date(), []);

    const prevDisabled = !!minimumDate && monthIndex(displayedMonth) <= monthIndex(minimumDate);
    const nextDisabled = !!maximumDate && monthIndex(displayedMonth) >= monthIndex(maximumDate);

    const monthItems = React.useMemo(() => MONTH_LABELS.map((label, idx) => ({ label, value: idx })), []);
    const yearItems = React.useMemo(() => {
      const minYear = minimumDate ? minimumDate.getFullYear() : displayedMonth.getFullYear() - 100;
      const maxYear = maximumDate ? maximumDate.getFullYear() : displayedMonth.getFullYear() + 10;
      const items: { label: string; value: number }[] = [];
      for (let y = maxYear; y >= minYear; y--) items.push({ label: String(y), value: y });
      return items;
    }, [minimumDate, maximumDate, displayedMonth]);

    const resolveDayState = React.useCallback(
      (date: Date): DayState => {
        const isOutsideMonth = date.getMonth() !== displayedMonth.getMonth();
        const isToday = isSameDay(date, today);
        const isDisabled = isDateDisabled(date, { minimumDate, maximumDate, disabledDates, disabled });

        if (mode === 'multiple') {
          const arr = Array.isArray(currentValue) ? currentValue : [];
          return { isSelected: arr.some((d: Date) => isSameDay(d, date)), isToday, isDisabled, isOutsideMonth };
        }
        if (mode === 'range') {
          const range = currentValue as { from: Date; to?: Date } | undefined;
          const isRangeStart = !!range?.from && isSameDay(date, range.from);
          const isRangeEnd = !!range?.to && isSameDay(date, range.to);
          const isInRange = !!range?.from && !!range?.to && date > stripTime(range.from) && date < stripTime(range.to);
          return { isSelected: isRangeStart || isRangeEnd, isToday, isDisabled, isOutsideMonth, isInRange, isRangeStart, isRangeEnd };
        }
        return { isSelected: isSameDay(currentValue as Date | undefined, date), isToday, isDisabled, isOutsideMonth };
      },
      [mode, currentValue, displayedMonth, today, minimumDate, maximumDate, disabledDates, disabled]
    );

    return (
      <Root ref={ref} className={className} {...rest}>
        <Header>
          <HeaderPrevButton
            disabled={prevDisabled}
            onPress={() => !prevDisabled && setDisplayedMonth(addMonths(displayedMonth, -1))}
          >
            {'<'}
          </HeaderPrevButton>
          <HeaderMonthSelect
            items={monthItems}
            selectedValue={displayedMonth.getMonth()}
            onValueChange={(m: number) => setDisplayedMonth(new Date(displayedMonth.getFullYear(), m, 1))}
          />
          <HeaderYearSelect
            items={yearItems}
            selectedValue={displayedMonth.getFullYear()}
            onValueChange={(y: number) => setDisplayedMonth(new Date(y, displayedMonth.getMonth(), 1))}
          />
          <HeaderNextButton
            disabled={nextDisabled}
            onPress={() => !nextDisabled && setDisplayedMonth(addMonths(displayedMonth, 1))}
          >
            {'>'}
          </HeaderNextButton>
        </Header>

        <WeekDaysHeader>
          {weekDayLabels.map((label, i) => (
            <WeekDay key={`${label}-${i}`}>{label}</WeekDay>
          ))}
        </WeekDaysHeader>

        <Body>
          <Grid>
            {weeks.map((week, wi) => (
              <Week key={wi}>
                {showWeekNumbers && <WeekNumber>{getWeekNumber(week[0])}</WeekNumber>}
                {week.map((date) => {
                  const state = resolveDayState(date);
                  const dayMarkers = markers?.filter((m: CalendarMarker) => isSameDay(m.date, date)) ?? [];
                  const dataState = state.isRangeStart && state.isRangeEnd
                    ? 'selected'
                    : state.isRangeStart
                      ? 'range-start'
                      : state.isRangeEnd
                        ? 'range-end'
                        : state.isInRange
                          ? 'range-middle'
                          : state.isSelected
                            ? 'selected'
                            : state.isToday
                              ? 'today'
                              : state.isDisabled
                                ? 'disabled'
                                : state.isOutsideMonth
                                  ? 'outside-month'
                                  : 'default';

                  return (
                    <Day
                      key={date.toISOString()}
                      data-state={dataState}
                      disabled={state.isDisabled}
                      onPress={() => handleDayPress(date)}
                    >
                      <DayText state={state}>{date.getDate()}</DayText>
                      {dayMarkers.length > 0 && (
                        <DayIndicator data-type={dayMarkers.length > 1 ? 'multi-dot' : 'dot'}>
                          {dayMarkers.map((m: CalendarMarker, mi: number) => (
                            <View
                              key={mi}
                              style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: m.color ?? '#999' }}
                            />
                          ))}
                        </DayIndicator>
                      )}
                    </Day>
                  );
                })}
              </Week>
            ))}
          </Grid>
        </Body>

        {showFooter && (
          <Footer>
            <Pressable onPress={() => setDisplayedMonth(startOfMonthDate(new Date()))}>
              <Text>Today</Text>
            </Pressable>
          </Footer>
        )}
      </Root>
    );
  });

  const Compound = Calendar as typeof Calendar & CreateCalendarConfig;
  Compound.Header = Header;
  Compound.HeaderPrevButton = HeaderPrevButton;
  Compound.HeaderNextButton = HeaderNextButton;
  Compound.HeaderTitle = slots.HeaderTitle;
  Compound.HeaderMonthSelect = HeaderMonthSelect;
  Compound.HeaderYearSelect = HeaderYearSelect;
  Compound.WeekDaysHeader = WeekDaysHeader;
  Compound.WeekDay = WeekDay;
  Compound.Body = Body;
  Compound.Grid = Grid;
  Compound.Week = Week;
  Compound.Day = Day;
  Compound.DayText = DayText;
  Compound.DayIndicator = DayIndicator;
  Compound.WeekNumber = WeekNumber;
  Compound.Footer = Footer;

  return Compound;
}
