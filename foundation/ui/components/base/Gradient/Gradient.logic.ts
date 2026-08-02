import { useMemo } from 'react';
import GradientMeta from './Gradient.meta.yaml';

/**
 * Props for the Gradient component.
 */
export interface GradientProps {
  /**
   * An array of colors that represent the stops in the gradient.
   * e.g., ['#ff0000', '#00ff00']
   */
  colors: string[];
  /**
   * Optional starting coordinate of the gradient, specified as { x, y } where x and y are between 0 and 1.
   */
  start?: { x: number; y: number };
  /**
   * Optional ending coordinate of the gradient, specified as { x, y } where x and y are between 0 and 1.
   */
  end?: { x: number; y: number };
  /**
   * Child components to render inside the gradient view.
   */
  children?: React.ReactNode;
  /**
   * Additional properties to spread to the underlying linear gradient component.
   */
  [key: string]: any;
}

export function useGradientLogic(props: GradientProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (GradientMeta?.props) {
      GradientMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { colors = ['#000', '#fff'], start, end, children, ...rest } = merged;

  return { colors, start, end, children, rest };
}
