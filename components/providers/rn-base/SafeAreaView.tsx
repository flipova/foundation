import React from 'react';
import { SafeAreaView as RNSafeAreaView } from 'react-native';
import type { SafeAreaViewProps } from '../../contract';

export function SafeAreaView({ children, testID }: SafeAreaViewProps) {
  return (
    <RNSafeAreaView testID={testID} style={{ flex: 1 }}>
      {children}
    </RNSafeAreaView>
  );
}
