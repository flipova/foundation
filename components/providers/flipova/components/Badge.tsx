import React from 'react';
import { Text, View } from 'react-native';
import { badgeRecipe, type BadgeProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Badge(p: BadgeProps) {
  const t = useResolvedTheme();
  const r = badgeRecipe(p, t);
  return (
    <View style={r.container as never} testID={p.testID}>
      <Text style={r.label as never}>{p.children}</Text>
    </View>
  );
}
