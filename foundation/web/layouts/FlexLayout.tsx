import React from 'react';

export interface WebFlexLayoutProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  gap?: number | string;
  wrap?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const FlexLayout: React.FC<WebFlexLayoutProps> = ({
  direction = 'row',
  align = 'stretch',
  justify = 'flex-start',
  gap = 0,
  wrap = false,
  children,
  style,
}) => {
  const gapVal = typeof gap === 'number' ? `${gap}px` : gap;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        gap: gapVal,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
