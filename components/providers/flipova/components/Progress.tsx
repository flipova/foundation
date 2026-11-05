import React from 'react';
import { View } from 'react-native';
import { progressRecipe, type ProgressProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Progress(p: ProgressProps) {
  const t = useResolvedTheme();
  const r = progressRecipe(p, t);
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={p.accessibilityLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={r.value}
      style={r.track as never}
      testID={p.testID}
    >
      <View style={r.bar as never} />
    </View>
  );
}
