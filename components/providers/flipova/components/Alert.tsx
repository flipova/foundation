import React from 'react';
import { Text, View } from 'react-native';
import { alertRecipe, type AlertProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Alert(p: AlertProps) {
  const t = useResolvedTheme();
  const r = alertRecipe(p, t);
  return (
    <View accessibilityRole="alert" style={r.container as never} testID={p.testID}>
      {p.title ? <Text style={r.title as never}>{p.title}</Text> : null}
      {typeof p.children === 'string' ? <Text style={r.body as never}>{p.children}</Text> : p.children}
    </View>
  );
}
