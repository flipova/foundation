import React from 'react';
import { View as RNView } from 'react-native';
import type { ViewProps } from '../../contract';

export function View({ children, testID }: ViewProps) {
  return <RNView testID={testID}>{children}</RNView>;
}
