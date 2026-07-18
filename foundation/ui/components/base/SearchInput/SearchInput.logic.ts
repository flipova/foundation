import * as import_react from 'react';
const { useMemo, useState, useEffect, useCallback, useRef } = import_react;
import SearchInputMeta from './SearchInput.meta.yaml';
import { ViewStyle } from 'react-native';

export interface SearchInputProps {
  /** The search text */
  value?: string;
  /** Callback on text change */
  onChangeText?: (val: string) => void;
  /** Debounce time in ms. Default 300 */
  debounceMs?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Additional styling */
  style?: ViewStyle;
  [key: string]: any;
}

export function useSearchInputLogic(props: SearchInputProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (SearchInputMeta?.props) {
      SearchInputMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { value, onChangeText, debounceMs = 300, placeholder = 'Search...', ...rest } = merged;

  const [localValue, setLocalValue] = useState(value || '');
  const onChangeTextRef = useRef(onChangeText);
  
  useEffect(() => {
    onChangeTextRef.current = onChangeText;
  }, [onChangeText]);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value !== undefined && value !== localValue) {
      setLocalValue(value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChangeText = useCallback((text: string) => {
    setLocalValue(text);
    
    if (timerRef.current) clearTimeout(timerRef.current);
    
    if (debounceMs > 0) {
      timerRef.current = setTimeout(() => {
        onChangeTextRef.current?.(text);
      }, debounceMs);
    } else {
      onChangeTextRef.current?.(text);
    }
  }, [debounceMs]);

  const clear = useCallback(() => {
    setLocalValue('');
    if (timerRef.current) clearTimeout(timerRef.current);
    onChangeTextRef.current?.('');
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { value: localValue, handleChangeText, placeholder, clear, rest };
}
