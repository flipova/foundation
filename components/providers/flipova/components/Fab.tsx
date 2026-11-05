import React from 'react';
import { Pressable, Text } from 'react-native';
import { fabRecipe, iconRecipe, type FabProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Fab(p: FabProps) {
  const t = useResolvedTheme();
  const r = fabRecipe(p, t);
  const glyph = iconRecipe({ name: p.icon ?? 'plus' }, t).glyph;
  return (
    <Pressable
      testID={p.testID}
      accessibilityRole="button"
      accessibilityLabel={p.accessibilityLabel ?? p.label ?? 'Action'}
      onPress={p.onPress}
      style={r.container as never}
    >
      <Text style={r.icon as never}>{glyph}</Text>
      {p.label ? <Text style={r.label as never}>{p.label}</Text> : null}
    </Pressable>
  );
}
