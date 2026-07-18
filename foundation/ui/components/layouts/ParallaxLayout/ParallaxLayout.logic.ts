import { useMemo } from 'react';
import ParallaxLayoutMeta from './ParallaxLayout.meta.yaml';

/**
 * Properties for the ParallaxLayout component.
 */
export interface ParallaxLayoutProps {
  /**
   * The React Node representing the header content (often an image) to display with a parallax effect.
   */
  headerImage?: React.ReactNode;
  /**
   * The main content to display below the parallax header inside a scrollable area.
   */
  children?: React.ReactNode;
  /**
   * The height of the header image area in logical pixels.
   * Defaults to 250.
   */
  headerHeight?: number;
  /**
   * Additional generic properties to pass to the container view.
   */
  [key: string]: any;
}

export function useParallaxLayoutLogic(props: ParallaxLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (ParallaxLayoutMeta?.props) {
      ParallaxLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { headerImage, children, headerHeight = 250, ...rest } = merged;

  return { headerImage, children, headerHeight, rest };
}
