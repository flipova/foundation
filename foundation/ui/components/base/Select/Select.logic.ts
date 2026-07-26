import { useState } from 'react';
import SelectMeta from './Select.meta.yaml';

/**
 * Props for the Select component.
 */
export interface SelectProps {
  /**
   * The currently selected value.
   */
  value?: string;
  
  /**
   * Callback fired when a new option is selected.
   */
  onValueChange?: (value: string) => void;
  
  /**
   * List of available choices to pick from.
   */
  options: { label: string; value: string }[];
  
  /**
   * Temporary text shown when no value is selected.
   */
  placeholder?: string;
  
  /**
   * Disables interaction with the picker.
   */
  disabled?: boolean;
  
  /**
   * Error message to display. Styles the picker with error appearance.
   */
  error?: string;
  
  /**
   * Additional props to pass to the container view.
   */
  [key: string]: any;
}

const META_DEFAULTS: Record<string, any> = {};
if (SelectMeta?.props) {
  SelectMeta.props.forEach((p: any) => {
    if (p.default !== undefined) META_DEFAULTS[p.name] = p.default;
  });
}

export function useSelectLogic(props: SelectProps) {
  const merged = { ...META_DEFAULTS, ...props };
  const { value, onValueChange, options = [], placeholder, disabled, error, ...rest } = merged;
  const [isFocused, setIsFocused] = useState(false);

  return { value, onValueChange, options, placeholder, disabled, error, isFocused, setIsFocused, rest };
}
