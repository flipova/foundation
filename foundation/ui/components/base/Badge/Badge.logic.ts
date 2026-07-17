import React, { useMemo } from 'react';
import BadgeMeta from './Badge.meta.yaml';

/**
 * Properties for the Badge component.
 */
export interface BadgeProps {
  /** The text content to display inside the badge. */
  label: string;
  /** The visual style variant of the badge, mapped to theme colors. Defaults to 'default'. */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  /** Any other props to spread onto the container element. */
  [key: string]: any;
}

export function useBadgeLogic(props: BadgeProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (BadgeMeta?.props) {
      BadgeMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { label, variant = 'default', ...rest } = merged;

  return { label, variant, rest };
}
