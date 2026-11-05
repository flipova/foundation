import React, { useRef, useState } from 'react';
import { PanResponder, View, type LayoutChangeEvent } from 'react-native';
import { sliderFraction, sliderRecipe, sliderValue, type SliderProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Slider(p: SliderProps) {
  const { value, onValueChange, min = 0, max = 100, step = 1, disabled, accessibilityLabel, testID } = p;
  const t = useResolvedTheme();
  const r = sliderRecipe(p, t);
  const [width, setWidth] = useState(0);
  const live = useRef({ width, min, max, step, disabled, onValueChange });
  live.current = { width, min, max, step, disabled, onValueChange };

  const move = (x: number) => {
    const c = live.current;
    if (c.disabled || !c.width) return;
    c.onValueChange?.(sliderValue(x / c.width, c.min, c.max, c.step));
  };
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !live.current.disabled,
      onMoveShouldSetPanResponder: () => !live.current.disabled,
      onPanResponderGrant: (e) => move(e.nativeEvent.locationX),
      onPanResponderMove: (e) => move(e.nativeEvent.locationX),
    }),
  ).current;

  const f = sliderFraction(value, min, max);
  const adjust = (dir: 1 | -1) =>
    !disabled && onValueChange?.(sliderValue(sliderFraction(value + dir * step, min, max), min, max, step));
  return (
    <View
      testID={testID}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-disabled={disabled || undefined}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => adjust(e.nativeEvent.actionName === 'increment' ? 1 : -1)}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      style={r.root as never}
      {...pan.panHandlers}
    >
      <View style={r.track as never}>
        <View style={[r.filled as never, { width: `${f * 100}%` }]} />
      </View>
      <View style={[r.thumb as never, { left: Math.max(0, f * (width - r.thumbSize)) }]} />
    </View>
  );
}
