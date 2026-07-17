import { useMemo } from 'react';
import ScrollLayoutMeta from './ScrollLayout.meta.yaml';

/**
 * Properties for the ScrollLayout component.
 */
export interface ScrollLayoutProps {
  /**
   * The elements to be rendered inside the scroll view.
   */
  children?: React.ReactNode;
  /**
   * If true, the layout scrolls horizontally instead of vertically.
   * Defaults to false.
   */
  horizontal?: boolean;
  /**
   * Additional properties to pass to the underlying ScrollView.
   */
  [key: string]: any;
}

export function useScrollLayoutLogic(props: ScrollLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (ScrollLayoutMeta?.props) {
      ScrollLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { children, horizontal, ...rest } = merged;

  return { children, horizontal, rest };
}
