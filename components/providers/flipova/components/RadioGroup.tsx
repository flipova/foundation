import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { radioRecipe, type RadioGroupProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function RadioGroup(p: RadioGroupProps) {
  const t = useResolvedTheme();
  const r = radioRecipe(p, t);
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={p.accessibilityLabel}
      style={r.group as never}
      testID={p.testID}
    >
      {p.options.map((o) => {
        const selected = o.value === p.value;
        const off = !!(p.disabled || o.disabled);
        return (
          <Pressable
            key={o.value}
            accessibilityRole="radio"
            aria-checked={selected}
            aria-disabled={off}
            disabled={off}
            onPress={() => p.onValueChange?.(o.value)}
            style={r.row as never}
          >
            <View style={r.circle(selected) as never}>{selected ? <View style={r.dot as never} /> : null}</View>
            <Text style={r.label as never}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
