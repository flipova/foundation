import { useMemo, useEffect, useState } from 'react';
import BadgeWrapperMeta from './BadgeWrapper.meta.yaml';

export interface BadgeWrapperProps {
  /** Number to display in badge. If 0, no badge is shown unless showZero is true. */
  count?: number;
  /** Show badge even if count is 0 */
  showZero?: boolean;
  /** Badge background color */
  color?: string;
  [key: string]: any;
}

export function useBadgeWrapperLogic(props: BadgeWrapperProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (BadgeWrapperMeta?.props) {
      BadgeWrapperMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { count, showZero, color, ...rest } = merged;

  const isVisible = (merged.count ?? 0) > 0 || merged.showZero;
  return { isVisible, count: merged.count, color: merged.color, rest, children: merged.children };

}
