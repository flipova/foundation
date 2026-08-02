import React, { useMemo } from 'react';
import ScrollMeta from './Scroll.meta.yaml';

/**
 * Properties for the Scroll component.
 */
export interface ScrollProps {
  /** If true, the scroll view's children are arranged horizontally in a row. */
  horizontal?: boolean;
  /** The content to be rendered inside the scrollable view. */
  children?: React.ReactNode;
  /** Any other props (including style and ScrollView props) to spread onto the root element. */
  [key: string]: any;
}

export function useScrollLogic(props: ScrollProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (ScrollMeta?.props) {
      ScrollMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { horizontal, children, ...rest } = merged;

  return { horizontal, children, rest };
}
