import { useMemo } from 'react';
import CardMeta from './Card.meta.yaml';

/**
 * Properties for the Card component.
 */
export interface CardProps {
  /**
   * The content to display inside the card.
   */
  children?: React.ReactNode;
  /**
   * Additional style or functional properties to pass to the underlying View.
   */
  [key: string]: any;
}

export function useCardLogic(props: CardProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (CardMeta?.props) {
      CardMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { children, ...rest } = merged;

  return { children, rest };
}
