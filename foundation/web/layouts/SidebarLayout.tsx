import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';

export interface WebSidebarLayoutProps {
  sidebar: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  width?: number | string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const SidebarLayout: React.FC<WebSidebarLayoutProps> = ({
  sidebar,
  sidebarPosition = 'left',
  width = 280,
  children,
  style,
}) => {
  const { theme } = useTheme();
  const widthVal = typeof width === 'number' ? `${width}px` : width;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: sidebarPosition === 'left' ? 'row' : 'row-reverse',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: theme.background,
        ...style,
      }}
    >
      <aside
        style={{
          width: widthVal,
          flexShrink: 0,
          backgroundColor: theme.card,
          borderRight: sidebarPosition === 'left' ? `1px solid ${theme.border}` : 'none',
          borderLeft: sidebarPosition === 'right' ? `1px solid ${theme.border}` : 'none',
        }}
      >
        {sidebar}
      </aside>
      <main style={{ flex: 1, minWidth: 0, padding: '24px' }}>{children}</main>
    </div>
  );
};
