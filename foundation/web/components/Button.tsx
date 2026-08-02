import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';
import { resolveWebSpacing, resolveWebRadius } from '../utils/themeUtils';

export interface WebButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<WebButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  children,
  ...rest
}) => {
  const { theme } = useTheme();

  // Size configurations
  const sizeMap = {
    sm: { padding: '4px 12px', fontSize: '13px', height: '32px' },
    md: { padding: '8px 16px', fontSize: '14px', height: '40px' },
    lg: { padding: '12px 24px', fontSize: '16px', height: '48px' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Variant configurations
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: theme.secondary,
          color: theme.secondaryForeground,
          border: 'none',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: theme.foreground,
          border: `1px solid ${theme.border}`,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: theme.foreground,
          border: 'none',
        };
      case 'destructive':
        return {
          backgroundColor: theme.destructive,
          color: theme.destructiveForeground,
          border: 'none',
        };
      case 'primary':
      default:
        return {
          backgroundColor: theme.primary,
          color: theme.primaryForeground,
          border: 'none',
        };
    }
  };

  const variantStyle = getVariantStyles();

  return (
    <button
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        borderRadius: resolveWebRadius('md') || '8px',
        fontWeight: 600,
        fontFamily: 'inherit',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.15s ease-in-out',
        width: fullWidth ? '100%' : 'auto',
        ...currentSize,
        ...variantStyle,
        ...style,
      }}
      {...rest}
    >
      {loading ? (
        <span
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      ) : (
        <>
          {leftIcon}
          {children || label}
          {rightIcon}
        </>
      )}
    </button>
  );
};
