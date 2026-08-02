import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';

export interface WebCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox: React.FC<WebCheckboxProps> = ({
  label,
  checked,
  onCheckedChange,
  onChange,
  disabled,
  style,
  ...rest
}) => {
  const { theme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onCheckedChange?.(e.target.checked);
  };

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        fontSize: '14px',
        color: theme.foreground,
        userSelect: 'none',
        ...style,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        style={{
          width: '18px',
          height: '18px',
          accentColor: theme.primary,
          cursor: 'inherit',
          borderRadius: '4px',
        }}
        {...rest}
      />
      {label && <span>{label}</span>}
    </label>
  );
};
