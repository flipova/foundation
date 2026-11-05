import React from 'react';
import { View } from 'react-native';
import { cardRecipe, type CardProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Card(p: CardProps) {
  const t = useResolvedTheme();
  return (
    <View style={cardRecipe(p, t) as never} testID={p.testID}>
      {p.children}
    </View>
  );
}
