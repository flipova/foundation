import { useMemo, useState } from 'react';
import FlipLayoutMeta from './FlipLayout.meta.yaml';

/**
 * Props for the FlipLayout component.
 */
export interface FlipLayoutProps {
  /**
   * The React node to render on the front side of the layout.
   */
  front?: React.ReactNode;
  /**
   * The React node to render on the back side of the layout.
   */
  back?: React.ReactNode;
  /**
   * Additional properties to pass to the underlying Pressable container.
   */
  [key: string]: any;
}

export function useFlipLayoutLogic(props: FlipLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (FlipLayoutMeta?.props) {
      FlipLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { front, back, ...rest } = merged;
  const [isFlipped, setIsFlipped] = useState(false);

  return { front, back, isFlipped, setIsFlipped, rest };
}
