import * as import_react from 'react';
const { useMemo, useState, useCallback } = import_react;
import PasswordInputMeta from './PasswordInput.meta.yaml';
import { ViewStyle } from 'react-native';

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordInputProps {
  /** The current password value */
  value?: string;
  /** Callback fired when the text changes */
  onChangeText?: (val: string) => void;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Whether to show the strength meter. Default: true */
  showStrengthMeter?: boolean;
  /** Additional styling */
  style?: ViewStyle;
  [key: string]: any;
}

export function usePasswordInputLogic(props: PasswordInputProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (PasswordInputMeta?.props) {
      PasswordInputMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };

  const { value = '', onChangeText, placeholder = 'Enter password', showStrengthMeter = true, ...rest } = merged;
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = useCallback(() => setIsVisible((v: boolean) => !v), []);

  const calculateStrength = (pwd: string): { score: number, label: PasswordStrength } => {
    let score = 0;
    if (!pwd) return { score: 0, label: 'weak' };
    if (pwd.length >= 8) score += 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^a-zA-Z\d]/.test(pwd)) score += 1;

    if (score <= 1) return { score, label: 'weak' };
    if (score === 2) return { score, label: 'fair' };
    if (score === 3) return { score, label: 'good' };
    return { score, label: 'strong' };
  };

  const strength = useMemo(() => calculateStrength(value), [value]);

  return { value, onChangeText, placeholder, isVisible, toggleVisibility, showStrengthMeter, strength, rest };
}
