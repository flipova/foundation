import React from 'react';
import { Text } from 'react-native';
import { headingRecipe, type HeadingProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Heading(p: HeadingProps) {
  const t = useResolvedTheme();
  return (
    <Text
      accessibilityRole="header"
      aria-level={p.level ?? 2}
      style={headingRecipe(p, t) as never}
      numberOfLines={p.isTruncated ? 1 : undefined}
      testID={p.testID}
    >
      {p.children}
    </Text>
  );
}
