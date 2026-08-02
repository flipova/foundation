import { useMemo } from 'react';
import VoidLayoutMeta from './VoidLayout.meta.yaml';

/**
 * Props for the VoidLayout component.
 */
export interface VoidLayoutProps {
  /**
   * Content to render inside the raw unstyled container.
   */
  children?: React.ReactNode;
  /**
   * Any additional properties to spread onto the underlying View.
   */
  [key: string]: any;
}

export function useVoidLayoutLogic(props: VoidLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (VoidLayoutMeta?.props) {
      VoidLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { children, ...rest } = merged;

  return { children, rest };
}
