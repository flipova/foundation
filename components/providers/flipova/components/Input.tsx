import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { inputRecipe, type InputProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Input(p: InputProps) {
  const t = useResolvedTheme();
  const r = inputRecipe(p, t);
  const [focused, setFocused] = useState(false);
  return (
    <View style={[r.container, focused ? { borderColor: r.focusBorderColor } : null] as never}>
      <TextInput
        style={r.field as never}
        value={p.value}
        defaultValue={p.defaultValue}
        placeholder={p.placeholder}
        placeholderTextColor={r.placeholderTextColor}
        onChangeText={p.onChangeText}
        editable={!p.disabled}
        secureTextEntry={p.secureTextEntry}
        accessibilityLabel={p.accessibilityLabel}
        aria-invalid={p.invalid || undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        testID={p.testID}
      />
    </View>
  );
}
