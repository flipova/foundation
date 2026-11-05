import React from 'react';
import { ActivityIndicator } from 'react-native';
import { spinnerRecipe, type SpinnerProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Spinner(p: SpinnerProps) {
  const t = useResolvedTheme();
  const r = spinnerRecipe(p, t);
  return (
    <ActivityIndicator
      size={r.size}
      color={r.color}
      accessibilityRole="progressbar"
      accessibilityLabel={p.accessibilityLabel ?? 'Loading'}
      style={{ transform: [{ scale: r.scale }] }}
      testID={p.testID}
    />
  );
}
