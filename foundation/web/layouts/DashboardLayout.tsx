import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';

export interface WebDashboardLayoutProps {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  children?: React.ReactNode;
  sidebarWidth?: number | string;
  headerHeight?: number | string;
  style?: React.CSSProperties;
}

export const DashboardLayout: React.FC<WebDashboardLayoutProps> = ({
  sidebar,
  header,
  children,
  sidebarWidth = 260,
  headerHeight = 64,
  style,
}) => {
  const { theme } = useTheme();

  const widthVal = typeof sidebarWidth === 'number' ? `${sidebarWidth}px` : sidebarWidth;
  const heightVal = typeof headerHeight === 'number' ? `${headerHeight}px` : headerHeight;

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: theme.background,
        color: theme.foreground,
        ...style,
      }}
    >
      {sidebar && (
        <aside
          style={{
            width: widthVal,
            flexShrink: 0,
            borderRight: `1px solid ${theme.border}`,
            backgroundColor: theme.card,
          }}
        >
          {sidebar}
        </aside>
      )}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {header && (
          <header
            style={{
              height: heightVal,
              flexShrink: 0,
              borderBottom: `1px solid ${theme.border}`,
              backgroundColor: theme.card,
              display: 'flex',
              alignItems: 'center',
              padding: '0 24px',
            }}
          >
            {header}
          </header>
        )}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  );
};
