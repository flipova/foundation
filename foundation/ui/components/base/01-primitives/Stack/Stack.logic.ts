import React, { useMemo } from 'react';
import StackMeta from './Stack.meta.yaml';

/**
 * Properties for the Stack component.
 */
export interface StackProps {
  /** The axis along which to stack the children. Defaults to 'column'. */
  direction?: 'row' | 'column';
  /** The size of the gap between children. Defaults to 16. */
  gap?: number;
  /** The items to be stacked. */
  children?: React.ReactNode;
  /** Any other props (including style and View props) to spread onto the root element. */
  [key: string]: any;
}

export function useStackLogic(props: StackProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (StackMeta?.props) {
      StackMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { direction = 'column', gap = 16, children, ...rest } = merged;

  return { direction, gap, children, rest };
}
