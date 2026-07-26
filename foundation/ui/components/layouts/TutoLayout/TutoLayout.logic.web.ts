/**
 * TutoLayout Logic - Web Variant
 *
 * @description
 * Logic hook for tutorial layout managing steps, navigation, and element registration.
 * Replaces React Native View refs with HTMLDivElement refs.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Replaces react-native LayoutRectangle and View ref with web equivalents.
 * Uses HTMLDivElement ref and DOMRect-compatible LayoutRect from TutoContext.web.ts.
 * Manages tutorial steps, current step tracking, and element dimension registry.
 * Provides next/prev navigation callbacks and context value for provider.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Root ref enables precise overlay positioning
 * - ResizeObserver could enhance dimension tracking
 * - Element registry allows targeting specific UI elements for highlighting
 * - Supports custom animation types (swipe, tap, double-tap)
 *
 * @example
 * ```typescript
 * const logic = useTutoLayoutLogic({
 *   steps: [{ targetId: 'btn1', title: 'Click me' }],
 *   isActive: true,
 * });
 * // logic.currentStep: TutoStep
 * // logic.nextStep: () => void
 * // logic.rootRef: React.RefObject<HTMLDivElement>
 * ```
 *
 * @see
 * - TutoContext.web.ts for context interface
 * - TutoLayout.web.tsx for provider and rendering
 */

import { useMemo, useState, useCallback, useRef } from 'react';
import { type LayoutRect, type TutoElementRegistry } from './TutoContext';
import TutoLayoutMeta from './TutoLayout.meta.yaml';

export type TutoAnimationType =
  | 'swipe-left'
  | 'swipe-right'
  | 'swipe-up'
  | 'swipe-down'
  | 'tap'
  | 'double-tap'
  | 'none';

export interface TutoStep {
  targetId: string;
  title?: string;
  description?: string;
  animation?: TutoAnimationType;
}

export interface TutoLayoutProps {
  steps?: TutoStep[];
  isActive?: boolean;
  onStepChange?: (stepIndex: number) => void;
  onComplete?: () => void;
  [key: string]: any;
}

export function useTutoLayoutLogic(props: TutoLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (TutoLayoutMeta?.props) {
      TutoLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { steps = [], isActive, onStepChange, onComplete, children, ...rest } = merged;

  // Web: HTMLDivElement ref instead of React Native View ref
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [registry, setRegistry] = useState<TutoElementRegistry>(new Map());

  const currentStep = steps[currentStepIndex];
  const targetId = currentStep?.targetId;

  const nextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onStepChange?.(nextIndex);
    } else {
      onComplete?.();
    }
  }, [currentStepIndex, steps.length, onStepChange, onComplete]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      onStepChange?.(prevIndex);
    }
  }, [currentStepIndex, onStepChange]);

  const registerElement = useCallback((id: string, layout: LayoutRect) => {
    setRegistry((prev) => {
      const next = new Map(prev);
      next.set(id, layout);
      return next;
    });
  }, []);

  const unregisterElement = useCallback((id: string) => {
    setRegistry((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const targetLayout = targetId ? registry.get(targetId) : undefined;

  return {
    steps,
    currentStep,
    currentStepIndex,
    nextStep,
    prevStep,
    isActive,
    targetLayout,
    children,
    rootRef,
    contextValue: { registerElement, unregisterElement, registry, rootRef },
    rest,
  };
}
