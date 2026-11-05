import React from 'react';
import { Text } from 'react-native';
import { iconRecipe, type IconProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Icon(p: IconProps) {
  const t = useResolvedTheme();
  const r = iconRecipe(p, t);
  return (
    <Text
      testID={p.testID}
      accessibilityLabel={p.accessibilityLabel}
      accessible={!!p.accessibilityLabel}
      importantForAccessibility={p.accessibilityLabel ? 'yes' : 'no-hide-descendants'}
      style={r.style as never}
    >
      {r.glyph}
    </Text>
  );
}
