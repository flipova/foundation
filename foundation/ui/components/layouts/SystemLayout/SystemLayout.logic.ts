import { useMemo } from 'react';
import SystemLayoutMeta from './SystemLayout.meta.yaml';

/**
 * Props for the SystemLayout component.
 */
export interface SystemLayoutProps {
  /**
   * The content to be rendered inside the safe area container.
   */
  children?: React.ReactNode;
  /**
   * The visual style of the system status bar ('light', 'dark', or 'auto').
   */
  statusBarMode?: 'light' | 'dark' | 'auto';
  /**
   * Any additional properties to spread onto the SafeAreaView container.
   */
  [key: string]: any;
}

export function useSystemLayoutLogic(props: SystemLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (SystemLayoutMeta?.props) {
      SystemLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { children, statusBarMode = 'auto', ...rest } = merged;

  return { children, statusBarMode, rest };
}
