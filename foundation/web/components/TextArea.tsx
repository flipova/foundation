import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';

export interface WebTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: React.CSSProperties;
}

export const TextArea: React.FC<WebTextAreaProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  style,
  disabled,
  rows = 4,
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
      <textarea
        disabled={disabled}
        rows={rows}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: `1px solid ${error ? theme.error : theme.border}`,
          backgroundColor: theme.card,
          color: theme.foreground,
          fontSize: '14px',
          fontFamily: 'inherit',
          outline: 'none',
          resize: 'vertical',
          opacity: disabled ? 0.6 : 1,
          boxSizing: 'border-box',
          ...style,
        }}
        {...rest}
      />
      {(error || helperText) && (
        <span style={{ fontSize: '12px', color: error ? theme.error : theme.mutedForeground }}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};
