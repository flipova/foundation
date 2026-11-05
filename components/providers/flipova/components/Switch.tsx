import React from 'react';
import { Switch as RNSwitch } from 'react-native';
import { switchRecipe, type SwitchProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Switch(p: SwitchProps) {
  const t = useResolvedTheme();
  const r = switchRecipe(p, t);
  return (
    <RNSwitch
      value={!!p.value}
      onValueChange={p.onValueChange}
      disabled={p.disabled}
      trackColor={{ true: r.trackOn, false: r.trackOff }}
      thumbColor={r.thumb}
      style={{ opacity: r.opacity, transform: [{ scale: r.scale }] }}
      accessibilityLabel={p.accessibilityLabel}
      testID={p.testID}
    />
  );
}
