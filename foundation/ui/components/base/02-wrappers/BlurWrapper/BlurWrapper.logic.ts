import { useMemo, useEffect, useState } from 'react';
import BlurWrapperMeta from './BlurWrapper.meta.yaml';

export interface BlurWrapperProps {
  /** Blur intensity (1-100) */
  intensity?: number;
  /** Tint color (light, dark, default) */
  tint?: string;
  [key: string]: any;
}

export function useBlurWrapperLogic(props: BlurWrapperProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (BlurWrapperMeta?.props) {
      BlurWrapperMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { intensity, tint, ...rest } = merged;

  return { intensity: merged.intensity, tint: merged.tint, rest, children: merged.children };

}
