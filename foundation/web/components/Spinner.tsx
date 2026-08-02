import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';

export interface WebSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | number;
  color?: string;
  style?: React.CSSProperties;
}

export const Spinner: React.FC<WebSpinnerProps> = ({
  size = 'md',
  color,
  style,
}) => {
  const { theme } = useTheme();

  const getSizePx = (): number => {
    if (typeof size === 'number') return size;
    const map = { sm: 16, md: 24, lg: 36 };
    return map[size] || 24;
  };

  const dim = getSizePx();
  const strokeCol = color ? (color in theme ? (theme as any)[color] : color) : theme.primary;

  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeCol}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        animation: 'spin 0.8s linear infinite',
        ...style,
      }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};
