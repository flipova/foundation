import { useMemo } from 'react';
import Swipe2ScreenLayoutMeta from './Swipe2ScreenLayout.meta.yaml';

/**
 * Props for the Swipe2ScreenLayout component.
 */
export interface Swipe2ScreenLayoutProps {
  /**
   * The React node representing the content of the first screen (left side).
   */
  screen1?: React.ReactNode;
  /**
   * The React node representing the content of the second screen (right side).
   */
  screen2?: React.ReactNode;
  /**
   * Any additional properties to spread onto the underlying ScrollView container.
   */
  [key: string]: any;
}

export function useSwipe2ScreenLayoutLogic(props: Swipe2ScreenLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (Swipe2ScreenLayoutMeta?.props) {
      Swipe2ScreenLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { screen1, screen2, ...rest } = merged;

  return { screen1, screen2, rest };
}
