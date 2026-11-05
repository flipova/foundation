import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { checkboxRecipe, type CheckboxProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Checkbox(p: CheckboxProps) {
  const t = useResolvedTheme();
  const r = checkboxRecipe(p, t);
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={p.accessibilityLabel ?? p.label}
      aria-checked={!!p.checked}
      aria-disabled={!!p.disabled}
      disabled={p.disabled}
      onPress={() => p.onCheckedChange?.(!p.checked)}
      style={r.row as never}
      testID={p.testID}
    >
      <View style={r.box as never}>{p.checked ? <Text style={r.mark as never}>✓</Text> : null}</View>
      {p.label ? <Text style={r.label as never}>{p.label}</Text> : null}
    </Pressable>
  );
}
