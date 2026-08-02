import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';

export interface WebTextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: React.CSSProperties;
}

export const TextInput: React.FC<WebTextInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  disabled,
  ...rest
}) => {
  const { theme } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', ...containerStyle }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 600, color: theme.foreground }}>
          {label}
        </label>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0 12px',
          height: '40px',
          borderRadius: '8px',
          border: `1px solid ${error ? theme.error : theme.border}`,
          backgroundColor: theme.card,
          color: theme.foreground,
          opacity: disabled ? 0.6 : 1,
          boxSizing: 'border-box',
        }}
      >
        {leftIcon}
        <input
          disabled={disabled}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            color: 'inherit',
            fontSize: '14px',
            fontFamily: 'inherit',
            width: '100%',
            ...style,
          }}
          {...rest}
        />
        {rightIcon}
      </div>
      {(error || helperText) && (
        <span style={{ fontSize: '12px', color: error ? theme.error : theme.mutedForeground }}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};
