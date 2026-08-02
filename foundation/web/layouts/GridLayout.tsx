import React from 'react';

export interface WebGridLayoutProps {
  columns?: number | string;
  gap?: number | string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const GridLayout: React.FC<WebGridLayoutProps> = ({
  columns = 3,
  gap = 16,
  children,
  style,
}) => {
  const gapVal = typeof gap === 'number' ? `${gap}px` : gap;
  const colVal = typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: colVal,
        gap: gapVal,
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
