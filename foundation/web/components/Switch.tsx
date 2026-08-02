import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';

export interface WebSwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  style?: React.CSSProperties;
}

export const Switch: React.FC<WebSwitchProps> = ({
  checked = false,
  onCheckedChange,
  disabled = false,
  label,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        userSelect: 'none',
        ...style,
      }}
    >
      <div
        onClick={() => !disabled && onCheckedChange?.(!checked)}
        style={{
          width: '40px',
          height: '22px',
          borderRadius: '11px',
          backgroundColor: checked ? theme.primary : theme.border,
          position: 'relative',
          transition: 'background-color 0.2s ease',
          padding: '2px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: checked ? 'translateX(18px)' : 'translateX(0)',
            transition: 'transform 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </div>
      {label && <span style={{ fontSize: '14px', color: theme.foreground }}>{label}</span>}
    </label>
  );
};
