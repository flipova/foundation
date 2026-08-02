import React from 'react';
import { Icon } from './Icon';
import { useTheme } from '../../theme/providers/ThemeProvider';

export interface WebIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  disabled?: boolean;
}

export const IconButton: React.FC<WebIconButtonProps> = ({
  name,
  size = 'md',
  variant = 'ghost',
  disabled = false,
  style,
  ...rest
}) => {
  const { theme } = useTheme();

  const dimMap = { sm: 32, md: 40, lg: 48 };
  const iconSizeMap = { sm: 16, md: 20, lg: 24 };

  const dim = dimMap[size];
  const iconSize = iconSizeMap[size];

  const getVariantStyle = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: theme.primary, color: theme.primaryForeground, border: 'none' };
      case 'secondary':
        return { backgroundColor: theme.secondary, color: theme.secondaryForeground, border: 'none' };
      case 'outline':
        return { backgroundColor: 'transparent', color: theme.foreground, border: `1px solid ${theme.border}` };
      case 'ghost':
      default:
        return { backgroundColor: 'transparent', color: theme.foreground, border: 'none' };
    }
  };

  return (
    <button
      disabled={disabled}
      style={{
        width: `${dim}px`,
        height: `${dim}px`,
        borderRadius: '8px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background-color 0.15s ease',
        boxSizing: 'border-box',
        ...getVariantStyle(),
        ...style,
      }}
      {...rest}
    >
      <Icon name={name} size={iconSize} color="currentColor" />
    </button>
  );
};
