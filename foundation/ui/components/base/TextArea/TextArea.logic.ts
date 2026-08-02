import { useMemo, useState, useCallback } from 'react';
import TextAreaMeta from './TextArea.meta.yaml';

/**
 * Props for the TextArea component.
 */
export interface TextAreaProps {
  /** The controlled text value of the text area. */
  value?: string;
  /** The default text value for an uncontrolled text area. */
  defaultValue?: string;
  /** Callback invoked when the text changes. */
  onChangeText?: (text: string) => void;
  /** Placeholder text shown when the text area is empty. */
  placeholder?: string;
  /** Disables the text area, preventing user input. */
  disabled?: boolean;
  /** Error message to display below the text area. */
  error?: string;
  /** Approximate number of lines to dictate the initial minimum height. */
  lines?: number;
  /** Additional custom props that will be passed to the container View. */
  [key: string]: any;
}

export function useTextAreaLogic(props: TextAreaProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (TextAreaMeta?.props) {
      TextAreaMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { value, defaultValue, onChangeText, placeholder, disabled, error, lines = 3, ...rest } = merged;

  const [isFocused, setIsFocused] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const handleContentSizeChange = useCallback((e: any) => {
    setContentHeight(e.nativeEvent.contentSize.height);
  }, []);

  return { 
    value, defaultValue, onChangeText, placeholder, disabled, error, lines, 
    isFocused, setIsFocused, contentHeight, handleContentSizeChange, rest 
  };
}
