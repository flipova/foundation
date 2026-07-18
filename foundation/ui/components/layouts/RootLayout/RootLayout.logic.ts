import { useMemo } from 'react';
import RootLayoutMeta from './RootLayout.meta.yaml';

/**
 * Properties for the RootLayout component.
 */
export interface RootLayoutProps {
  /**
   * The top-level children of the application or screen.
   */
  children?: React.ReactNode;
  /**
   * Any additional generic view props.
   */
  [key: string]: any;
}

export function useRootLayoutLogic(props: RootLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (RootLayoutMeta?.props) {
      RootLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { children, ...rest } = merged;

  return { children, rest };
}
