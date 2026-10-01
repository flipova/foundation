/**
 * Local replacement for the (unpublished) `@gluestack-ui/core/date-time-picker/creator`
 * module. Provides the open/closed + field state shared between the trigger,
 * input, and native picker surfaces via context.
 */
import React from 'react';

export interface DateTimePickerContextValue {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  mode: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
  locale?: string;
  timeZoneOffsetInMinutes?: number;
  is24Hour?: boolean;
  disabled?: boolean;
  placeholder?: string;
  format?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DateTimePickerContext = React.createContext<DateTimePickerContextValue | null>(null);

export interface DateTimePickerProviderProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  mode: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
  locale?: string;
  timeZoneOffsetInMinutes?: number;
  is24Hour?: boolean;
  disabled?: boolean;
  placeholder?: string;
  format?: string;
  children?: React.ReactNode;
}

export function DateTimePickerProvider({
  children,
  value,
  onChange,
  mode,
  minimumDate,
  maximumDate,
  locale,
  timeZoneOffsetInMinutes,
  is24Hour,
  disabled,
  placeholder,
  format,
}: DateTimePickerProviderProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const contextValue = React.useMemo<DateTimePickerContextValue>(
    () => ({
      value,
      onChange,
      mode,
      minimumDate,
      maximumDate,
      locale,
      timeZoneOffsetInMinutes,
      is24Hour,
      disabled,
      placeholder,
      format,
      isOpen,
      setIsOpen,
    }),
    [value, onChange, mode, minimumDate, maximumDate, locale, timeZoneOffsetInMinutes, is24Hour, disabled, placeholder, format, isOpen]
  );

  return <DateTimePickerContext.Provider value={contextValue}>{children}</DateTimePickerContext.Provider>;
}

export function useDateTimePicker(): DateTimePickerContextValue {
  const context = React.useContext(DateTimePickerContext);
  if (!context) {
    throw new Error('useDateTimePicker must be used within a DateTimePickerProvider');
  }
  return context;
}

export interface CreateDateTimePickerConfig {
  Root: React.ComponentType<any>;
  Trigger: React.ComponentType<any>;
  Input: React.ComponentType<any>;
  Icon: React.ComponentType<any>;
}

export function createDateTimePicker({ Root, Trigger, Input, Icon }: CreateDateTimePickerConfig) {
  const DateTimePickerRoot = React.forwardRef<any, any>(function DateTimePickerRoot(props, ref) {
    return <Root ref={ref} {...props} />;
  });

  const Compound = DateTimePickerRoot as typeof DateTimePickerRoot & {
    Trigger: typeof Trigger;
    Input: typeof Input;
    Icon: typeof Icon;
  };
  Compound.Trigger = Trigger;
  Compound.Input = Input;
  Compound.Icon = Icon;

  return Compound;
}
