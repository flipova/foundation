import { useMemo } from 'react';
import SwiperLayoutMeta from './SwiperLayout.meta.yaml';

/**
 * Props for the SwiperLayout component.
 */
export interface SwiperLayoutProps {
  /**
   * The child nodes to be rendered as distinct swipable pages.
   */
  children?: React.ReactNode;
  /**
   * Any additional properties to spread onto the underlying ScrollView container.
   */
  [key: string]: any;
}

export function useSwiperLayoutLogic(props: SwiperLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (SwiperLayoutMeta?.props) {
      SwiperLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { children, ...rest } = merged;

  return { children, rest };
}
