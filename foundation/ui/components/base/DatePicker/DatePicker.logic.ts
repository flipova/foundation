import { useMemo } from 'react';
import DatePickerMeta from './DatePicker.meta.yaml';

/**
 * Properties for the DatePicker component.
 */
export interface DatePickerProps {
  /**
   * The currently selected date.
   * @default new Date()
   */
  value?: Date;
  /**
   * Callback fired when the user selects a new date.
   * @param date The newly selected Date object.
   */
  onDateChange?: (date: Date) => void;
  /**
   * Whether the date picker is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Additional properties to pass to the underlying container or picker component.
   */
  [key: string]: any;
}

export function useDatePickerLogic(props: DatePickerProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (DatePickerMeta?.props) {
      DatePickerMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { value = new Date(), onDateChange, disabled, ...rest } = merged;

  return { value, onDateChange, disabled, rest };
}
