import { useMemo } from 'react';
import SplitLayoutMeta from './SplitLayout.meta.yaml';

/**
 * Properties for the SplitLayout component.
 */
export interface SplitLayoutProps {
  /**
   * The React node to render in the left pane.
   */
  left?: React.ReactNode;
  /**
   * The React node to render in the right pane.
   */
  right?: React.ReactNode;
  /**
   * The percentage (0-100) of the width that the left pane should consume.
   * The right pane will consume the remainder.
   * Defaults to 50.
   */
  ratio?: number;
  /**
   * Additional generic properties to pass to the top-level container.
   */
  [key: string]: any;
}

export function useSplitLayoutLogic(props: SplitLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (SplitLayoutMeta?.props) {
      SplitLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { 
    left, right, ratio = 0.5, 
    spacing, leftWidth, orientation, hideLeftOnMobile,
    background, borderRadius,
    leftBackground, rightBackground,
    leftBorderRadius, rightBorderRadius,
    ...rest 
  } = merged;

  const validRatio = Math.max(0, Math.min(1, ratio));

  return { 
    left, right, ratio: validRatio, 
    spacing, leftWidth, orientation, hideLeftOnMobile,
    background, borderRadius,
    leftBackground, rightBackground,
    leftBorderRadius, rightBorderRadius,
    rest 
  };
}
