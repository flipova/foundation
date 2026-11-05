import React from 'react';
import { Image as RNImage } from 'react-native';
import { imageRecipe, type ImageProps } from '../../contract';
import { useResolvedTheme } from '../provider';

export function Image(p: ImageProps) {
  const t = useResolvedTheme();
  return (
    <RNImage
      testID={p.testID}
      source={{ uri: p.source }}
      accessibilityLabel={p.alt}
      alt={p.alt}
      resizeMode={p.resizeMode ?? 'cover'}
      style={imageRecipe(p, t) as never}
    />
  );
}
