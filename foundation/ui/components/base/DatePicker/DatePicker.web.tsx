import React from 'react';
import { useDatePickerLogic, DatePickerProps } from './DatePicker.logic';
import { useDatePickerStyle } from './DatePicker.style';

/**
 * @component DatePicker (Web)
 * @description A control for selecting a specific date.
 * @useCases Forms requiring birthdates, event scheduling, or filtering by a date range.
 * @structure A container wrapping a native HTML date input element.
 * @accessibility Inherits accessibility features from the native date input, though custom styles should ensure adequate contrast and focus indicators.
 */
const DatePicker: React.FC<DatePickerProps> = (rawProps) => {
  const logic = useDatePickerLogic(rawProps);
  const styles = useDatePickerStyle(logic);

  const formattedDate = logic.value.toISOString().split('T')[0];

  return (
    <div style={{ ...styles.container, display: 'flex', padding: 0 } as React.CSSProperties} {...logic.rest}>
      <input
        type="date"
        value={formattedDate}
        onChange={(e) => logic.onDateChange?.(new Date(e.target.value))}
        disabled={logic.disabled}
        style={{
          width: '100%',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          padding: '10px 12px',
          color: styles.text.color,
          fontSize: styles.text.fontSize,
          cursor: logic.disabled ? 'not-allowed' : 'pointer',
        }}
      />
    </div>
  );
};

export default DatePicker;
