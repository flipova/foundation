/**
 * CollapsibleWrapper Logic - Web Variant
 *
 * @description
 * Logic hook for managing collapsible container state and configuration.
 * Provides expansion state and content height tracking for CSS transitions.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * No native animation library dependency. Web variant uses CSS max-height transition.
 * Returns collapsed state and content height for use by web component renderer.
 * Processes component props with metadata defaults from YAML configuration.
 * No Animated.Value or react-native-reanimated usage.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Uses HTML/CSS transitions instead of native animation APIs
 * - Separates logic from rendering for reusability
 * - Content height tracking supports future advanced animations
 *
 * @example
 * ```typescript
 * const logic = useCollapsibleWrapperLogic({
 *   isExpanded: true,
 *   children: <div>Content</div>,
 * });
 *
 * // logic.isExpanded: boolean
 * // logic.contentHeight: number
 * // logic.rest: remaining props
 * ```
 *
 * @see
 * - CollapsibleWrapper.web.tsx for rendering
 * - useCollapsibleWrapperLogic for hook definition
 */

import { useMemo, useState } from 'react';
import CollapsibleWrapperMeta from './CollapsibleWrapper.meta.yaml';

export interface CollapsibleWrapperProps {
  /** Whether the container is expanded */
  isExpanded?: boolean;
  [key: string]: any;
}

export function useCollapsibleWrapperLogic(props: CollapsibleWrapperProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (CollapsibleWrapperMeta?.props) {
      CollapsibleWrapperMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { isExpanded, ...rest } = merged;

  // Web: no shared value - the web renderer applies a CSS transition directly
  const [contentHeight, setContentHeight] = useState<number>(0);

  return {
    isExpanded: !!isExpanded,
    contentHeight,
    setContentHeight,
    rest,
    children: merged.children,
  };
}
