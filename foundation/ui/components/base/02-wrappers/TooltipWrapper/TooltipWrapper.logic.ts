import { useMemo, useEffect, useState } from 'react';
import TooltipWrapperMeta from './TooltipWrapper.meta.yaml';

export interface TooltipWrapperProps {
  /** Tooltip text */
  text?: string;
  /** Whether tooltip is visible */
  isVisible?: boolean;
  [key: string]: any;
}

export function useTooltipWrapperLogic(props: TooltipWrapperProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (TooltipWrapperMeta?.props) {
      TooltipWrapperMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { text, isVisible, ...rest } = merged;

  return { text: merged.text, isVisible: merged.isVisible, rest, children: merged.children };

}
