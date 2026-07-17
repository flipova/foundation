import { useMemo } from 'react';
import ResponsiveLayoutMeta from './ResponsiveLayout.meta.yaml';
import { useWindowDimensions } from 'react-native';

/**
 * Properties for the ResponsiveLayout component.
 */
export interface ResponsiveLayoutProps {
  /**
   * The React nodes to be rendered inside this layout.
   */
  children?: React.ReactNode;
  /**
   * The width threshold in logical pixels above which the layout switches to desktop mode (row direction).
   * Defaults to 768.
   */
  breakpoint?: number;
  /**
   * Additional properties to pass to the underlying view.
   */
  [key: string]: any;
}

export function useResponsiveLayoutLogic(props: ResponsiveLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (ResponsiveLayoutMeta?.props) {
      ResponsiveLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { children, breakpoint = 768, ...rest } = merged;
  
  const { width } = useWindowDimensions();
  const isDesktop = width >= breakpoint;

  return { children, isDesktop, rest };
}
