import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';

export interface WebHeaderContentLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
  headerHeight?: number | string;
  style?: React.CSSProperties;
}

export const HeaderContentLayout: React.FC<WebHeaderContentLayoutProps> = ({
  header,
  children,
  headerHeight = 64,
  style,
}) => {
  const { theme } = useTheme();
  const heightVal = typeof headerHeight === 'number' ? `${headerHeight}px` : headerHeight;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: theme.background,
        ...style,
      }}
    >
      <header
        style={{
          height: heightVal,
          borderBottom: `1px solid ${theme.border}`,
          backgroundColor: theme.card,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          flexShrink: 0,
        }}
      >
        {header}
      </header>
      <main style={{ flex: 1, padding: '24px' }}>{children}</main>
    </div>
  );
};
