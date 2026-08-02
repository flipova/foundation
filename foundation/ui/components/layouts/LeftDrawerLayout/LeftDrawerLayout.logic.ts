import { useMemo, useState } from 'react';
import LeftDrawerLayoutMeta from './LeftDrawerLayout.meta.yaml';

/**
 * Props for the LeftDrawerLayout component.
 */
export interface LeftDrawerLayoutProps {
  /**
   * The React elements to display inside the drawer panel when it is open.
   */
  drawer?: React.ReactNode;
  /**
   * The main screen content to display beneath the drawer.
   */
  children?: React.ReactNode;
  /**
   * A boolean indicating whether the drawer is currently open and visible.
   */
  isOpen?: boolean;
  /**
   * A callback function invoked when the overlay backdrop is pressed to close the drawer.
   */
  onClose?: () => void;
  /**
   * Additional properties to pass to the underlying React Native View component.
   */
  [key: string]: any;
}

export function useLeftDrawerLayoutLogic(props: LeftDrawerLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (LeftDrawerLayoutMeta?.props) {
      LeftDrawerLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { drawer, children, isOpen = false, onClose, ...rest } = merged;

  return { drawer, children, isOpen, onClose, rest };
}
