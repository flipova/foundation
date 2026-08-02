import { useMemo } from 'react';
import SidebarLayoutMeta from './SidebarLayout.meta.yaml';

/**
 * Properties for the SidebarLayout component.
 */
export interface SidebarLayoutProps {
  /**
   * The React node to render inside the sidebar pane.
   */
  sidebar?: React.ReactNode;
  /**
   * The main content node to render in the primary pane.
   */
  children?: React.ReactNode;
  /**
   * Determines whether the sidebar appears on the 'left' or 'right'.
   * Defaults to 'left'.
   */
  sidebarPosition?: 'left' | 'right';
  /**
   * The width of the sidebar in logical pixels.
   * Defaults to 250.
   */
  sidebarWidth?: number;
  /**
   * Additional generic properties to pass to the container wrapper.
   */
  [key: string]: any;
}

export function useSidebarLayoutLogic(props: SidebarLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (SidebarLayoutMeta?.props) {
      SidebarLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { sidebar, children, sidebarPosition = 'left', sidebarWidth = 250, ...rest } = merged;

  return { sidebar, children, sidebarPosition, sidebarWidth, rest };
}
