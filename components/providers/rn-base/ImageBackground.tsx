import React from 'react';
import { ImageBackground as RNImageBackground } from 'react-native';
import type { ImageBackgroundProps } from '../../contract';

export function ImageBackground({ source, children, testID }: ImageBackgroundProps) {
  return (
    <RNImageBackground testID={testID} source={{ uri: source }} resizeMode="cover">
      {children}
    </RNImageBackground>
  );
}
