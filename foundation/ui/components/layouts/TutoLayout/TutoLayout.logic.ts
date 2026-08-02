import { useMemo, useState, useCallback, useRef } from 'react';
import { LayoutRectangle, View } from 'react-native';
import { TutoElementRegistry } from './TutoContext';
import TutoLayoutMeta from './TutoLayout.meta.yaml';

export type TutoAnimationType = 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | 'tap' | 'double-tap' | 'none';

export interface TutoStep {
  /** The ID of the TutoElement to highlight */
  targetId: string;
  /** Title text for the tooltip */
  title?: string;
  /** Description text for the tooltip */
  description?: string;
  /** Animation gesture to display over the highlight */
  animation?: TutoAnimationType;
}

export interface TutoLayoutProps {
  /** Array of tutorial steps */
  steps?: TutoStep[];
  /** Whether the tutorial overlay is currently active */
  isActive?: boolean;
  /** Callback fired when a step changes */
  onStepChange?: (stepIndex: number) => void;
  /** Callback fired when the tutorial completes */
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

  const rootRef = useRef<View>(null);
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

  const registerElement = useCallback((id: string, layout: LayoutRectangle) => {
    setRegistry(prev => {
      const newMap = new Map(prev);
      newMap.set(id, layout);
      return newMap;
    });
  }, []);

  const unregisterElement = useCallback((id: string) => {
    setRegistry(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
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
    rest 
  };
}
