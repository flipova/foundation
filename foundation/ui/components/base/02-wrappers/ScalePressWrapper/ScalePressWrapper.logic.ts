import { useMemo, useEffect, useState } from 'react';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import ScalePressWrapperMeta from './ScalePressWrapper.meta.yaml';

export interface ScalePressWrapperProps {
  /** Scale factor when pressed */
  scaleTo?: number;
  [key: string]: any;
}

export function useScalePressWrapperLogic(props: ScalePressWrapperProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (ScalePressWrapperMeta?.props) {
      ScalePressWrapperMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { scaleTo, ...rest } = merged;

  const scale = useSharedValue(1);
  const onPressIn = () => { scale.value = withSpring(merged.scaleTo ?? 0.95) as any; };
  const onPressOut = () => { scale.value = withSpring(1) as any; };
  return { scale, onPressIn, onPressOut, rest, children: merged.children };

}
