import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';

export interface SelectOption {
  label: string;
  value: string;
}

export interface WebSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  error?: string;
  containerStyle?: React.CSSProperties;
}

export const Select: React.FC<WebSelectProps> = ({
  label,
  options = [],
  error,
  containerStyle,
  style,
  disabled,
  children,
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
      <select
        disabled={disabled}
        style={{
          width: '100%',
          height: '40px',
          padding: '0 12px',
          borderRadius: '8px',
          border: `1px solid ${error ? theme.error : theme.border}`,
          backgroundColor: theme.card,
          color: theme.foreground,
          fontSize: '14px',
          fontFamily: 'inherit',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          boxSizing: 'border-box',
          ...style,
        }}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
        {children}
      </select>
      {error && (
        <span style={{ fontSize: '12px', color: theme.error }}>
          {error}
        </span>
      )}
    </div>
  );
};
