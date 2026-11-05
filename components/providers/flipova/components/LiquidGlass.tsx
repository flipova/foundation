import React from 'react';
import { View } from 'react-native';
import { liquidGlassRecipe, type LiquidGlassProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function LiquidGlass({ children, testID }: LiquidGlassProps) {
  const t = useResolvedTheme();
  return (
    <View testID={testID} style={liquidGlassRecipe(t) as never}>
      {children}
    </View>
  );
}
