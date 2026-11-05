import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { buttonRecipe, type ButtonProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Button(p: ButtonProps) {
  const t = useResolvedTheme();
  const r = buttonRecipe(p, t);
  const inactive = !!(p.disabled || p.loading);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={p.accessibilityLabel}
      aria-disabled={inactive}
      aria-busy={!!p.loading}
      disabled={inactive}
      onPress={p.onPress}
      testID={p.testID}
      style={({ pressed }) => [r.container, pressed && !inactive ? { opacity: 0.85 } : null] as never}
    >
      {p.loading ? <ActivityIndicator size="small" color={r.spinner.color} /> : null}
      {typeof p.children === 'string' || typeof p.children === 'number' ? (
        <Text style={[r.label, p.variant === 'link' ? { textDecorationLine: 'underline' } : null] as never}>
          {p.children}
        </Text>
      ) : (
        p.children
      )}
    </Pressable>
  );
}
