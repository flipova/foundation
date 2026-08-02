import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface WebTabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  style?: React.CSSProperties;
}

export const Tabs: React.FC<WebTabsProps> = ({
  items,
  activeId,
  onChange,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: `1px solid ${theme.border}`,
        ...style,
      }}
    >
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? theme.primary : theme.mutedForeground,
              border: 'none',
              borderBottom: `2px solid ${isActive ? theme.primary : 'transparent'}`,
              backgroundColor: 'transparent',
              cursor: 'pointer',
              marginBottom: '-1px',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
