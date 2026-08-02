import { useMemo, useEffect, useState } from 'react';
import { useSharedValue, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import ShimmerWrapperMeta from './ShimmerWrapper.meta.yaml';

export interface ShimmerWrapperProps {
  /** Whether to show the shimmer */
  isLoading?: boolean;
  [key: string]: any;
}

export function useShimmerWrapperLogic(props: ShimmerWrapperProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (ShimmerWrapperMeta?.props) {
      ShimmerWrapperMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { isLoading, ...rest } = merged;

  const opacity = useSharedValue(0.5);
  useEffect(() => {
    if (merged.isLoading) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1, true
      );
    } else {
      opacity.value = withTiming(1);
    }
  }, [merged.isLoading]);
  return { opacity, isLoading: merged.isLoading, rest, children: merged.children };

}
