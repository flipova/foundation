import React from 'react';
import { View } from 'react-native';
import { gridRecipe, type GridProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Grid(p: GridProps) {
  const t = useResolvedTheme();
  const r = gridRecipe(p, t);
  return (
    <View testID={p.testID} style={r.container as never}>
      {React.Children.toArray(p.children).map((child, i) => (
        <View key={i} style={r.cell as never}>
          {child}
        </View>
      ))}
    </View>
  );
}
