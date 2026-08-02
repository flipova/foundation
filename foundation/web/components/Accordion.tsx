import React, { useState } from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';

export interface WebAccordionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Accordion: React.FC<WebAccordionProps> = ({
  title,
  defaultOpen = false,
  children,
  style,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: theme.card,
        ...style,
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          backgroundColor: 'transparent',
          border: 'none',
          color: theme.foreground,
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span>{title}</span>
        <span
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div style={{ padding: '16px', borderTop: `1px solid ${theme.border}` }}>
          {children}
        </div>
      )}
    </div>
  );
};
