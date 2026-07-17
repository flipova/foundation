import { useMemo } from 'react';
import TopDrawerLayoutMeta from './TopDrawerLayout.meta.yaml';

/**
 * Props for the TopDrawerLayout component.
 */
export interface TopDrawerLayoutProps {
  /**
   * The content to display inside the drawer panel when it is open.
   */
  drawer?: React.ReactNode;
  /**
   * The primary screen content behind the drawer.
   */
  children?: React.ReactNode;
  /**
   * Controls whether the top drawer is currently visible.
   */
  isOpen?: boolean;
  /**
   * Callback fired when the user taps the background overlay to dismiss the drawer.
   */
  onClose?: () => void;
  /**
   * Any additional properties to spread onto the main View container.
   */
  [key: string]: any;
}

export function useTopDrawerLayoutLogic(props: TopDrawerLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (TopDrawerLayoutMeta?.props) {
      TopDrawerLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { drawer, children, isOpen = false, onClose, ...rest } = merged;

  return { drawer, children, isOpen, onClose, rest };
}
