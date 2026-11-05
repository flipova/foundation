import React from 'react';
import { Text as RNText } from 'react-native';
import { textRecipe, type TextProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Text(p: TextProps) {
  const t = useResolvedTheme();
  return (
    <RNText style={textRecipe(p, t) as never} numberOfLines={p.isTruncated ? 1 : undefined} testID={p.testID}>
      {p.children}
    </RNText>
  );
}
