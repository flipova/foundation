import React from 'react';
import { View } from 'react-native';
import { stackRecipe, type HStackProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function HStack(p: HStackProps) {
  const t = useResolvedTheme();
  return (
    <View testID={p.testID} style={stackRecipe('row', p, t) as never}>
      {p.children}
    </View>
  );
}
