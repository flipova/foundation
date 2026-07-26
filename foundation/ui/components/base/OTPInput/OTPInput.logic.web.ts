/**
 * OTPInput Logic - Web Variant
 *
 * @description
 * Logic hook for one-time password input with multi-cell support.
 * Manages individual cell state and handles paste/backspace navigation.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Uses HTMLInputElement refs instead of React Native TextInput refs.
 * Manages array of individual cell values for secure OTP entry.
 * Handles paste of multiple characters across cells.
 * Supports keyboard navigation (backspace moves focus backward).
 * No react-native imports or platform-specific APIs.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Uses HTML input refs for direct DOM access
 * - Handles paste events intelligently
 * - Backspace navigation for better UX
 * - Focus tracking for visual feedback
 *
 * @example
 * ```typescript
 * const logic = useOTPInputLogic({ length: 6, value: '123456' });
 * // logic.internalValue: string[] (6 cells)
 * // logic.handleChange: (text, index) => void
 * // logic.inputsRef: HTMLInputElement refs
 * ```
 *
 * @see
 * - OTPInput.style.web.ts for styling
 * - OTPInput.web.tsx for component rendering
 */

import { useMemo, useState, useRef, useEffect } from 'react';
import OTPInputMeta from './OTPInput.meta.yaml';

export interface OTPInputProps {
  /** The length of the OTP (number of cells) */
  length?: number;
  /** Current value of the OTP */
  value?: string;
  /** Callback when the value changes */
  onChangeText?: (val: string) => void;
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
  const { length = 4, value, onChangeText, ...rest } = merged;

  const [internalValue, setInternalValue] = useState<string[]>(() =>
    (value || '').padEnd(length, ' ').split('').slice(0, length).map((c: string) => c === ' ' ? '' : c)
  );

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(
        (value || '').padEnd(length, ' ').split('').slice(0, length).map((c: string) => c === ' ' ? '' : c)
      );
    }
  }, [value, length]);

  // Web: HTMLInputElement refs
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const focusInput = (index: number) => {
    if (index >= 0 && index < length) {
      inputsRef.current[index]?.focus();
    }
  };

  const handleChange = (text: string, index: number) => {
    // Handle paste of multiple characters
    if (text.length > 1) {
      const chars = text.split('').slice(0, length - index);
      const newValues = [...internalValue];
      chars.forEach((char, i) => { newValues[index + i] = char; });
      setInternalValue(newValues);
      onChangeText?.(newValues.join(''));
      focusInput(Math.min(index + chars.length, length - 1));
      return;
    }

    const newValues = [...internalValue];
    newValues[index] = text;
    setInternalValue(newValues);
    onChangeText?.(newValues.join(''));

    if (text !== '' && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !internalValue[index] && index > 0) {
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
    handleKeyDown,
    handleFocus,
    handleBlur,
    focusedIndex,
    inputsRef,
    rest,
  };
}
