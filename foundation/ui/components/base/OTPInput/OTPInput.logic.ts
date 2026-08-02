import * as import_react from 'react';
const { useMemo, useState, useRef, useEffect } = import_react;
import type { TextInput, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import OTPInputMeta from './OTPInput.meta.yaml';

export interface OTPInputProps {
  /** The length of the OTP (number of cells) */
  length?: number;
  /** Current value of the OTP */
  value?: string;
  /** Callback when the value changes */
  onChangeText?: (val: string) => void;
  /** Whether the input is in an error state */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Callback fired when OTP is complete (length reached) */
  onComplete?: (otp: string) => void;
  [key: string]: any;
}

export function useOTPInputLogic(props: OTPInputProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (OTPInputMeta?.props) {
      OTPInputMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { length = 4, value, onChangeText, error, errorMessage, onComplete, ...rest } = merged;

  const [internalValue, setInternalValue] = useState<string[]>(
    (value || '').padEnd(length, ' ').split('').slice(0, length).map(c => c === ' ' ? '' : c)
  );

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue((value || '').padEnd(length, ' ').split('').slice(0, length).map(c => c === ' ' ? '' : c));
    }
  }, [value, length]);

  const inputsRef = useRef<Array<TextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const focusInput = (index: number) => {
    if (index >= 0 && index < length) {
      inputsRef.current[index]?.focus();
    }
  };

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      const chars = text.split('').slice(0, length - index);
      const newValues = [...internalValue];
      chars.forEach((char, i) => {
        newValues[index + i] = char;
      });
      setInternalValue(newValues);
      const otpString = newValues.join('');
      onChangeText?.(otpString);
      
      // Check if OTP is complete
      if (newValues.every(v => v !== '') && onComplete) {
        onComplete(otpString);
      }
      
      focusInput(Math.min(index + chars.length, length - 1));
      return;
    }

    const newValues = [...internalValue];
    newValues[index] = text;
    setInternalValue(newValues);
    const otpString = newValues.join('');
    onChangeText?.(otpString);

    // Check if OTP is complete
    if (newValues.every(v => v !== '') && onComplete) {
      onComplete(otpString);
    }

    if (text !== '' && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !internalValue[index] && index > 0) {
      focusInput(index - 1);
      const newValues = [...internalValue];
      newValues[index - 1] = '';
      setInternalValue(newValues);
      onChangeText?.(newValues.join(''));
    }
  };

  const handleFocus = (index: number) => setFocusedIndex(index);
  const handleBlur = (index: number) => {
    if (focusedIndex === index) setFocusedIndex(null);
  };

  return {
    length,
    internalValue,
    handleChange,
    handleKeyPress,
    handleFocus,
    handleBlur,
    focusedIndex,
    inputsRef,
    error,
    errorMessage,
    rest,
  };
}
