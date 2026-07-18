import { useMemo } from 'react';
import FlexLayoutMeta from './FlexLayout.meta.yaml';

/**
 * Props for the FlexLayout component.
 */
export interface FlexLayoutProps {
  /**
   * The React elements to render inside the layout.
   */
  children?: React.ReactNode;
  /**
   * Defines the primary axis of the flex container.
   * 'row' arranges children horizontally, 'column' vertically.
   * Defaults to 'column'.
   */
  direction?: 'row' | 'column';
  /**
   * The spacing between adjacent flex items in pixels.
   * Defaults to 0.
   */
  gap?: number;
  /**
   * Additional properties to pass to the underlying React Native View component.
   */
  [key: string]: any;
}

export function useFlexLayoutLogic(props: FlexLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (FlexLayoutMeta?.props) {
      FlexLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { children, direction = 'column', gap = 0, ...rest } = merged;

  return { children, direction, gap, rest };
}
