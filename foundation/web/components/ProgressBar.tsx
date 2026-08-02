import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';

export interface WebProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  height?: number;
  style?: React.CSSProperties;
}

export const ProgressBar: React.FC<WebProgressBarProps> = ({
  progress,
  color,
  height = 8,
  style,
}) => {
  const { theme } = useTheme();
  const clamped = Math.min(Math.max(progress, 0), 100);
  const barColor = color ? (color in theme ? (theme as any)[color] : color) : theme.primary;

  return (
    <div
      style={{
        width: '100%',
        height: `${height}px`,
        backgroundColor: theme.border,
        borderRadius: `${height / 2}px`,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: '100%',
          backgroundColor: barColor,
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
};
