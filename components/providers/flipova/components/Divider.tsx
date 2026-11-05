import React from 'react';
import { View } from 'react-native';
import { dividerRecipe, type DividerProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Divider(p: DividerProps) {
  const t = useResolvedTheme();
  return <View accessibilityRole="none" style={dividerRecipe(p, t) as never} testID={p.testID} />;
}
