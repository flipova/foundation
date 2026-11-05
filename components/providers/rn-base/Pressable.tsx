import React from 'react';
import { Pressable as RNPressable } from 'react-native';
import type { PressableProps } from '../../contract';

export function Pressable(p: PressableProps) {
  return (
    <RNPressable
      testID={p.testID}
      accessibilityRole="button"
      accessibilityLabel={p.accessibilityLabel}
      disabled={p.disabled}
      aria-disabled={p.disabled || undefined}
      onPress={p.onPress}
      style={({ pressed }) => ({ opacity: p.disabled ? 0.4 : pressed ? 0.7 : 1 })}
    >
      {p.children}
    </RNPressable>
  );
}
