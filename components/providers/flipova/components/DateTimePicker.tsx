import React, { useState } from 'react';
import { Modal as RNModal, Pressable, Text, View } from 'react-native';
import { inputRecipe, modalRecipe, type DateTimePickerProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';
import { Calendar } from './Calendar';

/** Date only ('YYYY-MM-DD'): a field that opens a calendar. */
export function DateTimePicker(p: DateTimePickerProps) {
  const t = useResolvedTheme();
  const field = inputRecipe({ disabled: p.disabled }, t);
  const m = modalRecipe({ visible: true }, t);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable
        testID={p.testID}
        accessibilityRole="button"
        accessibilityLabel={p.accessibilityLabel ?? p.placeholder ?? 'Pick a date'}
        aria-disabled={p.disabled || undefined}
        disabled={p.disabled}
        onPress={() => setOpen(true)}
        style={field.container as never}
      >
        <Text style={field.field as never}>{p.value || p.placeholder || 'YYYY-MM-DD'}</Text>
      </Pressable>
      <RNModal transparent animationType="fade" visible={open} onRequestClose={() => setOpen(false)}>
        <Pressable accessibilityLabel="Close" onPress={() => setOpen(false)} style={m.backdrop as never}>
          <Pressable accessible={false} onPress={() => {}}>
            <View>
              <Calendar
                value={p.value}
                min={p.min}
                max={p.max}
                onChange={(d) => {
                  p.onChange?.(d);
                  setOpen(false);
                }}
              />
            </View>
          </Pressable>
        </Pressable>
      </RNModal>
    </>
  );
}
