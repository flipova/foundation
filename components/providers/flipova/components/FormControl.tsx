import React from 'react';
import { Text, View } from 'react-native';
import { formControlRecipe, type FormControlProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function FormControl(p: FormControlProps) {
  const t = useResolvedTheme();
  const r = formControlRecipe(!!p.disabled, t);
  return (
    <View testID={p.testID} style={r.root as never}>
      {p.label ? (
        <Text style={r.label as never}>
          {p.label}
          {p.required ? <Text style={r.required as never}> *</Text> : null}
        </Text>
      ) : null}
      {p.children}
      {p.error ? (
        <Text accessibilityRole="alert" style={r.error as never}>
          {p.error}
        </Text>
      ) : p.helper ? (
        <Text style={r.helper as never}>{p.helper}</Text>
      ) : null}
    </View>
  );
}
