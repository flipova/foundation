import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { buttonRecipe, menuRecipe, type MenuProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Menu({ label, items, testID }: MenuProps) {
  const t = useResolvedTheme();
  const r = menuRecipe(t);
  const b = buttonRecipe({ variant: 'outline' }, t);
  const [open, setOpen] = useState(false);
  return (
    <View testID={testID} style={{ position: 'relative', alignSelf: 'flex-start' }}>
      <Pressable
        accessibilityRole="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onPress={() => setOpen(!open)}
        style={b.container as never}
      >
        <Text style={b.label as never}>{label}</Text>
      </Pressable>
      {open ? (
        <View accessibilityRole={'menu' as never} style={r.panel as never}>
          {items.map((it) => (
            <Pressable
              key={it.key}
              accessibilityRole={'menuitem' as never}
              aria-disabled={it.disabled || undefined}
              disabled={it.disabled}
              onPress={() => {
                setOpen(false);
                it.onSelect?.();
              }}
              style={r.item(!!it.disabled) as never}
            >
              <Text style={r.label(!!it.destructive) as never}>{it.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
