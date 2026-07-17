import { useMemo } from 'react';
import LottieAnimationMeta from './LottieAnimation.meta.yaml';

/**
 * Props for the LottieAnimation component.
 */
export interface LottieAnimationProps {
  /**
   * The source of the animation. Can be a local JSON file (via `require`) or a remote URI string.
   */
  source: any;
  /**
   * Indicates whether the animation should start playing automatically when mounted. Defaults to true.
   */
  autoPlay?: boolean;
  /**
   * Indicates whether the animation should loop continuously. Defaults to true.
   */
  loop?: boolean;
  /**
   * Additional properties to pass to the underlying container View.
   */
  [key: string]: any;
}

export function useLottieAnimationLogic(props: LottieAnimationProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (LottieAnimationMeta?.props) {
      LottieAnimationMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { source, autoPlay = true, loop = true, ...rest } = merged;

  return { source, autoPlay, loop, rest };
}
