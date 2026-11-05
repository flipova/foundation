import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { accordionRecipe, iconRecipe, type AccordionProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Accordion({ items, type = 'single', value, defaultValue = [], onValueChange, testID }: AccordionProps) {
  const t = useResolvedTheme();
  const r = accordionRecipe(t);
  const [inner, setInner] = useState<string[]>(defaultValue);
  const open = value ?? inner;
  const toggle = (key: string) => {
    const next = open.includes(key) ? open.filter((k) => k !== key) : type === 'single' ? [key] : [...open, key];
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };
  return (
    <View testID={testID} style={r.container as never}>
      {items.map((it, i) => {
        const isOpen = open.includes(it.key);
        return (
          <View key={it.key} style={(i === items.length - 1 ? {} : r.item) as never}>
            <Pressable
              accessibilityRole="button"
              aria-expanded={isOpen}
              aria-disabled={it.disabled || undefined}
              disabled={it.disabled}
              onPress={() => toggle(it.key)}
              style={r.header(isOpen, !!it.disabled) as never}
            >
              <Text style={r.title as never}>{it.title}</Text>
              <Text style={r.chevron as never}>
                {iconRecipe({ name: isOpen ? 'chevron-up' : 'chevron-down' }, t).glyph}
              </Text>
            </Pressable>
            {isOpen ? <View style={r.content as never}>{it.content}</View> : null}
          </View>
        );
      })}
    </View>
  );
}
