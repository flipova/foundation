import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { toastRecipe, type ToastProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

/** The toast itself; where and when it appears (a queue, a timer) is up to the app. */
export function Toast(p: ToastProps) {
  const t = useResolvedTheme();
  const r = toastRecipe(p, t);
  return (
    <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={r.container as never} testID={p.testID}>
      <View style={{ flex: 1, gap: t.scale.spacing['0.5'] }}>
        {p.title ? <Text style={r.title as never}>{p.title}</Text> : null}
        {p.description ? <Text style={r.body as never}>{p.description}</Text> : null}
      </View>
      {p.onClose ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          onPress={p.onClose}
          hitSlop={t.scale.spacing['2']}
        >
          <Text style={r.body as never}>✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
