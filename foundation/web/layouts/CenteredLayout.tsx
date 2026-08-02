import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';

export interface WebCenteredLayoutProps {
  maxWidth?: number | string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const CenteredLayout: React.FC<WebCenteredLayoutProps> = ({
  maxWidth = 1200,
  children,
  style,
}) => {
  const { theme } = useTheme();
  const maxW = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: theme.background,
        display: 'flex',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{ width: '100%', maxWidth: maxW, boxSizing: 'border-box' }}>
        {children}
      </div>
    </div>
  );
};
