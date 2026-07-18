import { useMemo, useState } from 'react';
import TextInputMeta from './TextInput.meta.yaml';

/**
 * Props for the TextInput component.
 */
export interface TextInputProps {
  /**
   * The controlled text value of the input.
   */
  value?: string;

  /**
   * The default text value for an uncontrolled input.
   */
  defaultValue?: string;

  /**
   * Callback invoked when the text changes.
   */
  onChangeText?: (text: string) => void;

  /**
   * Placeholder text shown when the input is empty.
   */
  placeholder?: string;

  /**
   * Disables the input, preventing user interaction.
   */
  disabled?: boolean;

  /**
   * Error message to display below the input. Also styles the border red.
   */
  error?: string;

  /**
   * Additional custom props that will be passed to the container View.
   */
  [key: string]: any;
}

export function useTextInputLogic(props: TextInputProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (TextInputMeta?.props) {
      TextInputMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { value, defaultValue, onChangeText, placeholder, disabled, error, ...rest } = merged;

  const [isFocused, setIsFocused] = useState(false);

  return { value, defaultValue, onChangeText, placeholder, disabled, error, isFocused, setIsFocused, rest };
}
