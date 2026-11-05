import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { selectRecipe, type SelectProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

/** A trigger and an inline list: no native picker, so it looks and behaves the same everywhere. */
export function Select(p: SelectProps) {
  const t = useResolvedTheme();
  const r = selectRecipe(p, t);
  const [open, setOpen] = useState(false);
  const current = p.options.find((o) => o.value === p.value);
  return (
    <View testID={p.testID}>
      <Pressable
        accessibilityRole="combobox"
        accessibilityLabel={p.accessibilityLabel}
        aria-expanded={open}
        aria-disabled={!!p.disabled}
        disabled={p.disabled}
        onPress={() => setOpen((o) => !o)}
        style={[r.trigger, open ? { borderColor: r.focusBorderColor } : null] as never}
      >
        <Text style={[r.triggerLabel, current ? null : { color: r.placeholderColor }] as never} numberOfLines={1}>
          {current ? current.label : (p.placeholder ?? '')}
        </Text>
        <Text style={{ color: r.placeholderColor }}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open ? (
        <View style={r.menu as never}>
          <ScrollView>
            {p.options.map((o) => {
              const selected = o.value === p.value;
              return (
                <Pressable
                  key={o.value}
                  accessibilityRole="menuitem"
                  aria-selected={selected}
                  aria-disabled={!!o.disabled}
                  disabled={o.disabled}
                  onPress={() => {
                    p.onValueChange?.(o.value);
                    setOpen(false);
                  }}
                  style={
                    [
                      r.option,
                      selected ? r.optionSelected : null,
                      o.disabled ? { opacity: r.disabledOptionOpacity } : null,
                    ] as never
                  }
                >
                  <Text style={[r.optionLabel, selected ? r.optionLabelSelected : null] as never}>{o.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}
