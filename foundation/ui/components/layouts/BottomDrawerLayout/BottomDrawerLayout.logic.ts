import { useMemo } from 'react';
import BottomDrawerLayoutMeta from './BottomDrawerLayout.meta.yaml';

/**
 * Props for the BottomDrawerLayout component.
 */
export interface BottomDrawerLayoutProps {
  /**
   * The content to display inside the bottom drawer when it is open.
   */
  drawer?: React.ReactNode;
  /**
   * The primary screen content displayed behind the drawer.
   */
  children?: React.ReactNode;
  /**
   * Determines whether the drawer is currently visible (true) or hidden (false).
   */
  isOpen?: boolean;
  /**
   * Callback invoked when the user taps the background overlay to dismiss the drawer.
   */
  onClose?: () => void;
  /**
   * Additional properties to spread onto the main container.
   */
  [key: string]: any;
}

export function useBottomDrawerLayoutLogic(props: BottomDrawerLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (BottomDrawerLayoutMeta?.props) {
      BottomDrawerLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { drawer, children, isOpen = false, onClose, ...rest } = merged;

  return { drawer, children, isOpen, onClose, rest };
}
