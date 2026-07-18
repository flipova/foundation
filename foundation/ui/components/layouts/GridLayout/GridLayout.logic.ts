import { useMemo } from 'react';
import GridLayoutMeta from './GridLayout.meta.yaml';
import { useWindowDimensions } from 'react-native';

/**
 * Props for the GridLayout component.
 */
export interface GridLayoutProps {
  /**
   * The React elements to render as items in the grid.
   */
  children?: React.ReactNode;
  /**
   * The number of columns to display in the grid. Defaults to 2.
   */
  columns?: number;
  /**
   * The gap (spacing) between items in the grid. Defaults to 16.
   */
  gap?: number;
  /**
   * Additional properties to pass to the underlying React Native View component.
   */
  [key: string]: any;
}

export function useGridLayoutLogic(props: GridLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (GridLayoutMeta?.props) {
      GridLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { children, columns = 2, gap = 16, ...rest } = merged;

  return { children, columns, gap, rest };
}
