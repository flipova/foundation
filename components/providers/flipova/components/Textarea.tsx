import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { textareaRecipe, type TextareaProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Textarea(p: TextareaProps) {
  const t = useResolvedTheme();
  const r = textareaRecipe(p, t);
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      multiline
      numberOfLines={p.rows ?? 4}
      style={[r.field, focused ? { borderColor: r.focusBorderColor } : null] as never}
      value={p.value}
      defaultValue={p.defaultValue}
      placeholder={p.placeholder}
      placeholderTextColor={r.placeholderTextColor}
      onChangeText={p.onChangeText}
      editable={!p.disabled}
      accessibilityLabel={p.accessibilityLabel}
      aria-invalid={p.invalid || undefined}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      testID={p.testID}
    />
  );
}
