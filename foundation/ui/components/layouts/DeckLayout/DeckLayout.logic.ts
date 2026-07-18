import { useMemo } from 'react';
import DeckLayoutMeta from './DeckLayout.meta.yaml';

/**
 * Props for the DeckLayout component.
 */
export interface DeckLayoutProps {
  /**
   * The individual cards to be rendered within the deck stack.
   * Each child represents a swipable card.
   */
  children?: React.ReactNode;
  /**
   * Additional styles or View properties for the background container.
   */
  [key: string]: any;
}

export function useDeckLayoutLogic(props: DeckLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (DeckLayoutMeta?.props) {
      DeckLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { children, ...rest } = merged;

  return { children, rest };
}
