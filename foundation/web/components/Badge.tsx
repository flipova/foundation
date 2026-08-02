import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';

export interface WebBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md';
  children?: React.ReactNode;
}

export const Badge: React.FC<WebBadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  style,
  children,
  ...rest
}) => {
  const { theme } = useTheme();

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: theme.secondary, color: theme.secondaryForeground, border: 'none' };
      case 'success':
        return { backgroundColor: theme.success, color: '#ffffff', border: 'none' };
      case 'warning':
        return { backgroundColor: theme.warning, color: '#ffffff', border: 'none' };
      case 'error':
        return { backgroundColor: theme.error, color: '#ffffff', border: 'none' };
      case 'outline':
        return { backgroundColor: 'transparent', color: theme.foreground, border: `1px solid ${theme.border}` };
      case 'primary':
      default:
        return { backgroundColor: theme.primary, color: theme.primaryForeground, border: 'none' };
    }
  };

  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isSmall ? '2px 8px' : '4px 10px',
        fontSize: isSmall ? '11px' : '12px',
        fontWeight: 600,
        borderRadius: '9999px',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...getVariantStyles(),
        ...style,
      }}
      {...rest}
    >
      {children || label}
    </span>
  );
};
