import { useMemo } from 'react';
import RadioGroupMeta from './RadioGroup.meta.yaml';

/**
 * Props for the RadioGroup component.
 */
export interface RadioGroupProps {
  /**
   * The currently selected value.
   */
  value?: string;
  
  /**
   * Callback fired when a new radio option is selected.
   */
  onValueChange?: (value: string) => void;
  
  /**
   * Array of options to display in the radio group.
   */
  options: { label: string; value: string }[];
  
  /**
   * If true, disables the entire group and prevents selection changes.
   */
  disabled?: boolean;
  
  /**
   * Additional props to pass to the container view.
   */
  [key: string]: any;
}

const META_DEFAULTS: Record<string, any> = {};
if (RadioGroupMeta?.props) {
  RadioGroupMeta.props.forEach((p: any) => {
    if (p.default !== undefined) META_DEFAULTS[p.name] = p.default;
  });
}

export function useRadioGroupLogic(props: RadioGroupProps) {
  const merged = { ...META_DEFAULTS, ...props };
  const { value, onValueChange, options = [], disabled, ...rest } = merged;

  return { value, onValueChange, options, disabled, rest };
}
