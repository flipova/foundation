import { useMemo } from 'react';
import MasonryLayoutMeta from './MasonryLayout.meta.yaml';

/**
 * Props for the MasonryLayout component.
 */
export interface MasonryLayoutProps {
  /**
   * The React elements to render within the masonry layout.
   */
  children?: React.ReactNode;
  /**
   * The total number of columns to divide the content into.
   */
  columns?: number;
  /**
   * The spacing between both columns and rows of items.
   */
  gap?: number;
  /**
   * Additional properties to pass to the underlying React Native View component.
   */
  [key: string]: any;
}

export function useMasonryLayoutLogic(props: MasonryLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (MasonryLayoutMeta?.props) {
      MasonryLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { children, columns = 2, gap = 16, ...rest } = merged;

  return { children, columns, gap, rest };
}
