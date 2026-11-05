import React from 'react';
import { Linking, Text } from 'react-native';
import { linkRecipe, type LinkProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Link({ href, onPress, children, testID }: LinkProps) {
  const t = useResolvedTheme();
  return (
    <Text
      testID={testID}
      accessibilityRole="link"
      style={linkRecipe(t) as never}
      onPress={() => {
        onPress?.();
        if (href) void Linking.openURL(href);
      }}
    >
      {children}
    </Text>
  );
}
