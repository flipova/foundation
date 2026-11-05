import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { popoverRecipe, type PopoverProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Popover({ trigger, open, onOpenChange, children, testID }: PopoverProps) {
  const t = useResolvedTheme();
  const r = popoverRecipe(t);
  const [inner, setInner] = useState(false);
  const isOpen = open ?? inner;
  const set = (v: boolean) => {
    if (open === undefined) setInner(v);
    onOpenChange?.(v);
  };
  return (
    <View testID={testID} style={{ position: 'relative', alignSelf: 'flex-start' }}>
      <Pressable accessibilityRole="button" aria-expanded={isOpen} onPress={() => set(!isOpen)}>
        {trigger}
      </Pressable>
      {isOpen ? <View style={r.panel as never}>{children}</View> : null}
    </View>
  );
}
