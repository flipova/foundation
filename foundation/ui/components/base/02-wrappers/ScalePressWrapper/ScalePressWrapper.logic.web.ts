/**
 * ScalePressWrapper Logic - Web Variant
 *
 * @description
 * Logic hook managing press state and scale transformation configuration.
 * Tracks pointer down/up state for interactive feedback animations.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * No native animation library dependency. Uses CSS transform transition via web renderer.
 * Manages press state with pointer event callbacks.
 * Calculates scale value based on configuration (default 0.95 for 5% shrink).
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Uses CSS transform for hardware-accelerated animation
 * - Pointer events provide more accurate touch/mouse feedback than click
 * - Scale value configurable via props
 *
 * @example
 * ```typescript
 * const logic = useScalePressWrapperLogic({ scaleTo: 0.9 });
 * // logic.isPressed: boolean
 * // logic.scale: number (0.9)
 * // logic.onPressIn: () => void
 * // logic.onPressOut: () => void
 * ```
 *
 * @see
 * - ScalePressWrapper.web.tsx for rendering with pointer events
 */

import { useMemo, useState, useCallback } from 'react';
import ScalePressWrapperMeta from './ScalePressWrapper.meta.yaml';

export interface ScalePressWrapperProps {
  /** Scale factor when pressed */
  scaleTo?: number;
  [key: string]: any;
}

export function useScalePressWrapperLogic(props: ScalePressWrapperProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (ScalePressWrapperMeta?.props) {
      ScalePressWrapperMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { scaleTo, ...rest } = merged;

  const [isPressed, setIsPressed] = useState(false);
  const scale = merged.scaleTo ?? 0.95;

  const onPressIn = useCallback(() => setIsPressed(true), []);
  const onPressOut = useCallback(() => setIsPressed(false), []);

  return {
    isPressed,
    scale,
    onPressIn,
    onPressOut,
    rest,
    children: merged.children,
  };
}
