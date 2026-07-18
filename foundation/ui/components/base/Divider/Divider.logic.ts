import { useMemo } from 'react';
import DividerMeta from './Divider.meta.yaml';

/**
 * Properties for the Divider component.
 */
export interface DividerProps {
  /**
   * The axis along which the divider should render.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * The thickness (height for horizontal, width for vertical) of the divider in points/pixels.
   * @default 1
   */
  thickness?: number;
  /**
   * An optional custom color for the divider. Can be a theme token or a literal color string.
   * If omitted, falls back to the theme's border color.
   */
  color?: string;
  /**
   * Additional properties to pass to the underlying View.
   */
  [key: string]: any;
}

export function useDividerLogic(props: DividerProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (DividerMeta?.props) {
      DividerMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { orientation = 'horizontal', thickness = 1, color, ...rest } = merged;

  return { orientation, thickness, color, rest };
}
