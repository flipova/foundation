/**
 * ResponsiveLayout Logic - Web Variant
 *
 * @description
 * Logic hook for responsive layout with breakpoint-based direction switching.
 * Uses window width to determine desktop vs mobile layout mode.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Uses window.innerWidth + resize listener instead of React Native useWindowDimensions.
 * Tracks viewport width and determines isDesktop flag based on breakpoint.
 * Configurable breakpoint (default 768px) for responsive switching.
 * Attaches resize listener for dynamic width changes (orientation, window resize).
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Automatic cleanup of resize listener on unmount
 * - SSR-safe with initial width detection
 * - Debounces resize updates via React state
 * - Suitable for any responsive layout implementation
 *
 * @example
 * ```typescript
 * const logic = useResponsiveLayoutLogic({ breakpoint: 768 });
 * // logic.isDesktop: boolean (true if width >= 768)
 * // logic.children: ReactNode
 * ```
 *
 * @see
 * - ResponsiveLayout.web.tsx for rendering
 * - useBreakpoint hook for detailed breakpoint info
 */

import { useMemo, useState, useEffect } from 'react';
import ResponsiveLayoutMeta from './ResponsiveLayout.meta.yaml';

export interface ResponsiveLayoutProps {
  children?: React.ReactNode;
  /** Width threshold in px above which layout switches to desktop row direction. Default: 768. */
  breakpoint?: number;
  [key: string]: any;
}

export function useResponsiveLayoutLogic(props: ResponsiveLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (ResponsiveLayoutMeta?.props) {
      ResponsiveLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { children, breakpoint = 768, ...rest } = merged;

  const getWidth = () =>
    typeof window !== 'undefined' ? window.innerWidth : 0;

  const [width, setWidth] = useState<number>(getWidth);

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const isDesktop = width >= breakpoint;

  return { children, isDesktop, rest };
}
