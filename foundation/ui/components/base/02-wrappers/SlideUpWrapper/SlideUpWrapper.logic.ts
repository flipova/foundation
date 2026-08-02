import { useMemo, useEffect, useState } from 'react';
import { useSharedValue, withDelay, withTiming, Easing } from 'react-native-reanimated';
import SlideUpWrapperMeta from './SlideUpWrapper.meta.yaml';

export interface SlideUpWrapperProps {
  /** Animation duration in ms */
  duration?: number;
  /** Animation delay in ms */
  delay?: number;
  /** Distance to slide from in pixels */
  distance?: number;
  [key: string]: any;
}

export function useSlideUpWrapperLogic(props: SlideUpWrapperProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (SlideUpWrapperMeta?.props) {
      SlideUpWrapperMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { duration, delay, distance, ...rest } = merged;

  const translateY = useSharedValue(merged.distance ?? 50);
  const opacity = useSharedValue(0);
  useEffect(() => {
    translateY.value = withDelay(merged.delay ?? 0, withTiming(0, { duration: merged.duration ?? 300, easing: Easing.out(Easing.back(1.5)) }));
    opacity.value = withDelay(merged.delay ?? 0, withTiming(1, { duration: merged.duration ?? 300 }));
  }, []);
  return { translateY, opacity, rest, children: merged.children };

}
