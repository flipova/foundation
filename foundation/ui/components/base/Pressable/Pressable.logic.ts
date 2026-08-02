import { useMemo } from 'react';
import PressableMeta from './Pressable.meta.yaml';

/**
 * Props for the Pressable component.
 * Defines the contract for external interactions.
 */
export interface PressableProps {
  /**
   * Callback invoked when the user presses the component.
   */
  onPress?: () => void;
  
  /**
   * If true, disables all touch interactions and visually dims the component.
   */
  disabled?: boolean;
  
  /**
   * The content to be rendered inside the pressable area.
   */
  children?: React.ReactNode;
  
  /**
   * Additional props to pass down to the underlying React Native Pressable.
   */
  [key: string]: any;
}

// Compute meta defaults once outside the hook to save rendering overhead
const META_DEFAULTS: Record<string, any> = {};
if (PressableMeta?.props) {
  PressableMeta.props.forEach((p: any) => {
    if (p.default !== undefined) META_DEFAULTS[p.name] = p.default;
  });
}

export function usePressableLogic(props: PressableProps) {
  const merged = { ...META_DEFAULTS, ...props };
  const { onPress, disabled, children, ...rest } = merged;

  return { onPress, disabled, children, rest };
}
