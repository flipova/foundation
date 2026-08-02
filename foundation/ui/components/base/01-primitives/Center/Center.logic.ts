import React, { useMemo } from 'react';
import CenterMeta from './Center.meta.yaml';

/**
 * Properties for the Center component.
 */
export interface CenterProps {
  /** The content to be centered horizontally and vertically. */
  children?: React.ReactNode;
  /** Any other props (including style and accessibility props) to spread onto the root element. */
  [key: string]: any;
}

export function useCenterLogic(props: CenterProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (CenterMeta?.props) {
      CenterMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { children, ...rest } = merged;

  return { children, rest };
}
