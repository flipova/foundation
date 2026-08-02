import { useMemo, useState, useCallback } from 'react';
import CheckboxMeta from './Checkbox.meta.yaml';

/**
 * Properties for the Checkbox component.
 */
export interface CheckboxProps {
  /**
   * Whether the checkbox is checked. If provided, the component operates in controlled mode.
   */
  checked?: boolean;
  /**
   * Callback fired when the checkbox state changes.
   * @param checked The new checked state.
   */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Whether the checkbox is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The text label to display next to the checkbox.
   */
  label?: string;
  /**
   * Additional properties to pass to the wrapper component.
   */
  [key: string]: any;
}

export function useCheckboxLogic(props: CheckboxProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (CheckboxMeta?.props) {
      CheckboxMeta.props.forEach((p: any) => {
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
