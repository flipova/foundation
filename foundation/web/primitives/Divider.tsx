import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';

export interface WebDividerProps {
  orientation?: 'horizontal' | 'vertical';
  color?: string;
  size?: number | string;
  style?: React.CSSProperties;
}

export const Divider: React.FC<WebDividerProps> = ({
  orientation = 'horizontal',
  color,
  size = 1,
  style,
}) => {
  const { theme } = useTheme();
  const borderCol = color ? ((color in theme) ? (theme as any)[color] : color) : theme.border;
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      style={{
        backgroundColor: borderCol,
        width: isHorizontal ? '100%' : typeof size === 'number' ? `${size}px` : size,
        height: isHorizontal ? (typeof size === 'number' ? `${size}px` : size) : '100%',
        margin: 0,
        padding: 0,
        border: 'none',
        flexShrink: 0,
        ...style,
      }}
    />
  );
};
