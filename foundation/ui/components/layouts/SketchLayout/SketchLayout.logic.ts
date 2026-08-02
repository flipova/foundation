import { useMemo } from 'react';
import SketchLayoutMeta from './SketchLayout.meta.yaml';

/**
 * Properties for the SketchLayout component.
 */
export interface SketchLayoutProps {
  /**
   * The content to be rendered on the 2D scrollable canvas.
   */
  children?: React.ReactNode;
  /**
   * Additional properties applied to the innermost content wrapper view.
   */
  [key: string]: any;
}

export function useSketchLayoutLogic(props: SketchLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (SketchLayoutMeta?.props) {
      SketchLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { children, ...rest } = merged;

  return { children, rest };
}
