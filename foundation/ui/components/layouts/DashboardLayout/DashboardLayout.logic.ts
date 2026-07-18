import { useMemo } from 'react';
import DashboardLayoutMeta from './DashboardLayout.meta.yaml';

/**
 * Props for the DashboardLayout component.
 */
export interface DashboardLayoutProps {
  /**
   * The React node to render in the left-hand sidebar container.
   */
  sidebar?: React.ReactNode;
  /**
   * The React node to render in the top header container above the main content.
   */
  header?: React.ReactNode;
  /**
   * The primary application content rendered below the header.
   */
  children?: React.ReactNode;
  /**
   * The fixed width of the sidebar. Defaults to 250.
   */
  sidebarWidth?: number;
  /**
   * Additional properties to spread onto the outermost container.
   */
  [key: string]: any;
}

export function useDashboardLayoutLogic(props: DashboardLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (DashboardLayoutMeta?.props) {
      DashboardLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { sidebar, header, children, sidebarWidth = 250, ...rest } = merged;

  return { sidebar, header, children, sidebarWidth, rest };
}
