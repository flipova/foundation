/**
 * GridLayout Logic - Web Variant
 *
 * @description
 * Logic hook for responsive grid layout with configurable columns and gap.
 * Manages grid parameters without native dimension calculations.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Removes unused useWindowDimensions import from react-native.
 * Grid width on web is determined by CSS flex-wrap, not JavaScript.
 * Manages columns and gap configuration for grid rendering.
 * Processes component props with YAML metadata defaults.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Pure logic layer for configuration management
 * - CSS flexbox handles responsive wrapping automatically
 * - Columns and gap values passed to renderer
 * - Suitable for any grid-based layout implementation
 *
 * @example
 * ```typescript
 * const logic = useGridLayoutLogic({ columns: 2, gap: 16 });
 * // logic.columns: number
 * // logic.gap: number
 * // logic.children: ReactNode
 * ```
 *
 * @see
 * - GridLayout.web.tsx for rendering with CSS flexbox
 */

import { useMemo } from 'react';
import GridLayoutMeta from './GridLayout.meta.yaml';

export interface GridLayoutProps {
  children?: React.ReactNode;
  columns?: number;
  gap?: number;
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
