import { useMemo, useEffect, useState } from 'react';
import SafeAreaWrapperMeta from './SafeAreaWrapper.meta.yaml';

export interface SafeAreaWrapperProps {
  /** Edges to apply safe area (top, bottom, left, right) */
  edges?: string[];
  [key: string]: any;
}

export function useSafeAreaWrapperLogic(props: SafeAreaWrapperProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (SafeAreaWrapperMeta?.props) {
      SafeAreaWrapperMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { edges, ...rest } = merged;

  return { edges: merged.edges, rest, children: merged.children };

}
