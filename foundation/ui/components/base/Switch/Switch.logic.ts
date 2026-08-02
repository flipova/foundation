import { useMemo, useState, useCallback } from 'react';
import SwitchMeta from './Switch.meta.yaml';

/**
 * Props for the Switch component.
 */
export interface SwitchProps {
  /**
   * The controlled checked state of the switch.
   * If provided, the switch operates in controlled mode and relies on `onCheckedChange` to update its state.
   */
  checked?: boolean;

  /**
   * Callback invoked when the switch's checked state changes.
   * Receives the new boolean state as its argument.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Disables the switch, preventing user interaction and altering its visual opacity.
   */
  disabled?: boolean;

  /**
   * Optional text label rendered alongside the switch track.
   * Also serves as the primary accessibility label if provided.
   */
  label?: string;

  /**
   * Additional custom props that will be passed down to the root Pressable element.
   */
  [key: string]: any;
}

export function useSwitchLogic(props: SwitchProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (SwitchMeta?.props) {
      SwitchMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { checked: controlledChecked, onCheckedChange, disabled, label, ...rest } = merged;

  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState(false);
  const checked = isControlled ? controlledChecked : internalChecked;

  const handlePress = useCallback(() => {
    if (disabled) return;
    const nextState = !checked;
    if (!isControlled) {
      setInternalChecked(nextState);
    }
    onCheckedChange?.(nextState);
  }, [disabled, checked, isControlled, onCheckedChange]);

  return { checked, handlePress, disabled, label, rest };
}
