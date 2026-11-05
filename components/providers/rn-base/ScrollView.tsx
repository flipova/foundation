import React from 'react';
import { ScrollView as RNScrollView } from 'react-native';
import type { ScrollViewProps } from '../../contract';

export function ScrollView({ children, horizontal, testID }: ScrollViewProps) {
  return (
    <RNScrollView testID={testID} horizontal={horizontal}>
      {children}
    </RNScrollView>
  );
}
