import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';

export interface WebAuthLayoutProps {
  title?: string;
  subtitle?: string;
  logo?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const AuthLayout: React.FC<WebAuthLayoutProps> = ({
  title,
  subtitle,
  logo,
  children,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.background,
        padding: '24px',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: theme.card,
          borderRadius: '16px',
          border: `1px solid ${theme.border}`,
          padding: '32px',
          boxSizing: 'border-box',
        }}
      >
        {logo && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>{logo}</div>}
        {title && <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: theme.foreground, textAlign: 'center' }}>{title}</h1>}
        {subtitle && <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: theme.mutedForeground, textAlign: 'center' }}>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};
