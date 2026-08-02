import React, { useState } from 'react';
import { View, Text, Pressable, Platform as RNPlatform } from 'react-native';
import { useDatePickerLogic, DatePickerProps } from './DatePicker.logic';
import { useDatePickerStyle } from './DatePicker.style';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';

/**
 * A cross-platform component for selecting dates.
 * 
 * @description
 * This component provides a unified date selection interface across Web, iOS, and Android.
 * It uses the native HTML5 date input on the web, and `@react-native-community/datetimepicker` on native platforms.
 * 
 * @useCases
 * - Selecting birth dates or appointment dates.
 * - Filtering lists by a date range.
 * - Providing date input for form fields.
 * 
 * @structure
 * - Manages the visibility state (`show`) of the native date picker modal.
 * - On Web: Renders an `<input type="date">`.
 * - On Native: Renders a `Pressable` trigger that displays the selected date alongside a Calendar icon. 
 *   Tapping it opens the `DateTimePicker`.
 * 
 * @accessibility
 * - The native trigger acts as a button and could benefit from `accessibilityRole="button"`.
 * - For web, the native input manages its own accessibility.
 */
const DatePicker: React.FC<DatePickerProps> = (rawProps) => {
  const logic = useDatePickerLogic(rawProps);
  const styles = useDatePickerStyle(logic);
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    if (RNPlatform.OS === 'android') {
      setShow(false);
    }
    if (selectedDate && logic.onDateChange) {
      logic.onDateChange(selectedDate);
    }
  };

  return (
    <View style={[styles.container as any, logic.rest.style]}>
      {RNPlatform.OS === 'web' ? (
        <input 
          type="date"
          value={logic.value.toISOString().split('T')[0]}
          onChange={(e) => logic.onDateChange?.(new Date(e.target.value))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
      ) : (
        <>
          <Pressable 
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 }}
            onPress={() => setShow(true)}
          >
            <Calendar size={20} color={styles.text?.color as string || '#000'} />
            <Text style={styles.text as any}>{logic.value.toLocaleDateString()}</Text>
          </Pressable>
          {show && (
            <DateTimePicker
              value={logic.value}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}
        </>
      )}
    </View>
  );
};

export default DatePicker;
