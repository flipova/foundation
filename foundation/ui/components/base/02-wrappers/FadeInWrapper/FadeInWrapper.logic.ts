import { useMemo, useEffect, useState } from 'react';
import { useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import FadeInWrapperMeta from './FadeInWrapper.meta.yaml';

export interface FadeInWrapperProps {
  /** Animation duration in ms */
  duration?: number;
  /** Animation delay in ms */
  delay?: number;
  [key: string]: any;
}

export function useFadeInWrapperLogic(props: FadeInWrapperProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (FadeInWrapperMeta?.props) {
      FadeInWrapperMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { duration, delay, ...rest } = merged;

  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withDelay(merged.delay || 0, withTiming(1, { duration: merged.duration || 300 }));
  }, []);
  return { opacity, rest, children: merged.children };

}
