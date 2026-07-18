import { useMemo } from 'react';
import BlurViewMeta from './BlurView.meta.yaml';

/**
 * Properties for the BlurView component.
 */
export interface BlurViewProps {
  /**
   * A number from 1 to 100 to control the intensity of the blur effect.
   * Higher values mean more blur.
   * @default 50
   */
  intensity?: number;
  /**
   * The tint color of the blur effect.
   * Can be 'light', 'dark', or 'default'.
   * @default 'default'
   */
  tint?: 'light' | 'dark' | 'default';
  /**
   * The content to render inside the blurred container.
   */
  children?: React.ReactNode;
  /**
   * Additional properties to pass down to the container.
   */
  [key: string]: any;
}

export function useBlurViewLogic(props: BlurViewProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (BlurViewMeta?.props) {
      BlurViewMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { intensity = 50, tint = 'default', children, ...rest } = merged;

  return { intensity, tint, children, rest };
}
