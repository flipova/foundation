import { useMemo, useState, useEffect } from 'react';
import NumberInputMeta from './NumberInput.meta.yaml';

/**
 * Props for the NumberInput component.
 */
export interface NumberInputProps {
  /** The current numeric value */
  value?: number;
  /** Callback when value changes */
  onChange?: (val: number) => void;
  /** Minimum value allowed */
  min?: number;
  /** Maximum value allowed */
  max?: number;
  /** Step amount for the increment/decrement buttons */
  step?: number;
  /** Whether decimal values are allowed */
  allowDecimal?: boolean;
  /** Error message to display below the input */
  error?: string;
  /** Additional styling or wrapper props */
  [key: string]: any;
}

/**
 * Custom hook to encapsulate NumberInput business logic.
 */
export function useNumberInputLogic(props: NumberInputProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (NumberInputMeta?.props) {
      NumberInputMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { value = 0, onChange, min, max, step = 1, allowDecimal = false, error, ...rest } = merged;

  const [textValue, setTextValue] = useState<string>(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused && Number(textValue) !== value) {
      setTextValue(value.toString());
    }
  }, [value, isFocused, textValue]);

  const updateValue = (newVal: number) => {
    let constrained = newVal;
    if (min !== undefined) constrained = Math.max(min, constrained);
    if (max !== undefined) constrained = Math.min(max, constrained);
    if (onChange && constrained !== value) {
      onChange(constrained);
    }
    setTextValue(constrained.toString());
  };

  const handleTextChange = (text: string) => {
    let filtered = text;
    if (!allowDecimal) {
      filtered = text.replace(/[^0-9-]/g, '');
    } else {
      filtered = text.replace(/[^0-9.-]/g, '');
      const parts = filtered.split('.');
      if (parts.length > 2) {
        filtered = parts[0] + '.' + parts.slice(1).join('');
      }
    }
    setTextValue(filtered);
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseFloat(textValue);
    if (!isNaN(parsed)) {
      updateValue(parsed);
    } else {
      setTextValue(value.toString());
    }
  };

  const increment = () => {
    const current = parseFloat(textValue) || 0;
    updateValue(current + step);
  };

  const decrement = () => {
    const current = parseFloat(textValue) || 0;
    updateValue(current - step);
  };

  return { textValue, handleTextChange, handleBlur, isFocused, setIsFocused, increment, decrement, error, allowDecimal, rest };
}
