import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { tabsRecipe, type TabsProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

/** Controlled with `value`, or uncontrolled (starts on the first enabled tab). */
export function Tabs(p: TabsProps) {
  const t = useResolvedTheme();
  const r = tabsRecipe(p, t);
  const [inner, setInner] = useState(() => p.tabs.find((x) => !x.disabled)?.key);
  const active = p.value ?? inner;
  const current = p.tabs.find((x) => x.key === active);
  return (
    <View testID={p.testID}>
      <View accessibilityRole="tablist" style={r.list as never}>
        {p.tabs.map((tab) => {
          const on = tab.key === active;
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              aria-selected={on}
              aria-disabled={!!tab.disabled}
              disabled={tab.disabled}
              onPress={() => {
                setInner(tab.key);
                p.onValueChange?.(tab.key);
              }}
              style={r.tab(on, !!tab.disabled) as never}
            >
              <Text style={r.label(on) as never}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {current?.content != null ? <View style={r.panel as never}>{current.content}</View> : null}
    </View>
  );
}
