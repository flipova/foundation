import React from 'react';
import { View } from 'react-native';
import { stackRecipe, type VStackProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function VStack(p: VStackProps) {
  const t = useResolvedTheme();
  return (
    <View testID={p.testID} style={stackRecipe('column', p, t) as never}>
      {p.children}
    </View>
  );
}
