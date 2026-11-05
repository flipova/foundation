import React from 'react';
import { View } from 'react-native';
import { centerRecipe, type CenterProps } from '../../../contract';

export function Center({ children, testID }: CenterProps) {
  return (
    <View testID={testID} style={centerRecipe() as never}>
      {children}
    </View>
  );
}
