import React from 'react';
import { View } from 'react-native';
import type { BoxProps } from '../../contract';

export function Box({ children, testID }: BoxProps) {
  return <View testID={testID}>{children}</View>;
}
