import React, { useMemo } from 'react';
import InlineMeta from './Inline.meta.yaml';

/**
 * Properties for the Inline component.
 */
export interface InlineProps {
  /** The spacing between children items. Uses React Native gap. Defaults to 8. */
  gap?: number;
  /** The items to be laid out horizontally with wrapping. */
  children?: React.ReactNode;
  /** Any other props (including style and accessibility props) to spread onto the root element. */
  [key: string]: any;
}

export function useInlineLogic(props: InlineProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (InlineMeta?.props) {
      InlineMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { gap = 8, children, ...rest } = merged;

  return { gap, children, rest };
}
