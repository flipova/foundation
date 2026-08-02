import { useMemo } from 'react';
import CenteredLayoutMeta from './CenteredLayout.meta.yaml';

/**
 * Props for the CenteredLayout component.
 */
export interface CenteredLayoutProps {
  /**
   * The content to be centered horizontally and vertically.
   */
  children?: React.ReactNode;
  /**
   * Additional styles or View properties for the container.
   */
  [key: string]: any;
}

export function useCenteredLayoutLogic(props: CenteredLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (CenteredLayoutMeta?.props) {
      CenteredLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { children, ...rest } = merged;

  return { children, rest };
}
