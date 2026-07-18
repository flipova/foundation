import { useMemo } from 'react';
import TextMeta from './Text.meta.yaml';

/**
 * Props for the Text component.
 */
export interface TextProps {
  /**
   * The content to be rendered inside the Text component.
   */
  children?: React.ReactNode;

  /**
   * The typography variant determining font size, weight, and default margins.
   */
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small' | 'muted';

  /**
   * Horizontal text alignment.
   */
  align?: 'left' | 'center' | 'right';

  /**
   * Override for the font weight. If omitted, the variant's default weight is used.
   */
  weight?: 'normal' | 'bold' | '600';

  /**
   * Additional custom props that will be passed down to the underlying Text component.
   */
  [key: string]: any;
}

export function useTextLogic(props: TextProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (TextMeta?.props) {
      TextMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { children, variant = 'p', align = 'left', weight, ...rest } = merged;

  return { children, variant, align, weight, rest };
}
