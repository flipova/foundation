import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { tooltipRecipe, type TooltipProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

/** Shown on hover / focus (web) or on long press (native). */
export function Tooltip({ content, children, testID }: TooltipProps) {
  const t = useResolvedTheme();
  const r = tooltipRecipe(t);
  const [show, setShow] = useState(false);
  const web = {
    onHoverIn: () => setShow(true),
    onHoverOut: () => setShow(false),
    onFocus: () => setShow(true),
    onBlur: () => setShow(false),
  };
  return (
    <View testID={testID} style={{ position: 'relative', alignSelf: 'flex-start' }}>
      <Pressable
        {...(web as object)}
        onLongPress={() => setShow(true)}
        onPressOut={() => setShow(false)}
        aria-describedby={show ? 'tooltip' : undefined}
      >
        {children}
      </Pressable>
      {show ? (
        <View accessibilityRole={'tooltip' as never} style={r.bubble as never}>
          <Text style={r.label as never}>{content}</Text>
        </View>
      ) : null}
    </View>
  );
}
