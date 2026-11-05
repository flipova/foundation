import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { skeletonRecipe, type SkeletonProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Skeleton(p: SkeletonProps) {
  const t = useResolvedTheme();
  const r = skeletonRecipe(p, t);
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: r.pulse.minOpacity,
          duration: r.pulse.durationMs / 2,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, { toValue: 1, duration: r.pulse.durationMs / 2, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity, r.pulse.minOpacity, r.pulse.durationMs]);
  return <Animated.View accessibilityRole="none" aria-busy style={[r.block, { opacity }] as never} testID={p.testID} />;
}
