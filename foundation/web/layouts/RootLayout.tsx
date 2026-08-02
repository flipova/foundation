import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';

export interface WebRootLayoutProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const RootLayout: React.FC<WebRootLayoutProps> = ({ children, style }) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: theme.background,
        color: theme.foreground,
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
