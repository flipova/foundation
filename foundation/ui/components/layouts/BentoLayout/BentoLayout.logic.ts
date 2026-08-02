import { useMemo } from 'react';
import BentoLayoutMeta from './BentoLayout.meta.yaml';

/**
 * Props for the BentoLayout component.
 */
export interface BentoLayoutProps {
  /**
   * The grid items to be displayed in the bento layout.
   */
  children?: React.ReactNode;
  /**
   * The spacing gap between bento items, measured in pixels.
   * Controls both the row and column gaps equivalently.
   */
  gap?: number;
  /**
   * Allows overriding standard View properties and extending with custom layout attributes.
   */
  [key: string]: any;
}

export function useBentoLayoutLogic(props: BentoLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (BentoLayoutMeta?.props) {
      BentoLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { children, gap = 16, ...rest } = merged;

  return { children, gap, rest };
}
