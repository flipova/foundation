import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';
import { SpacingToken, RadiusToken } from '../../tokens';
import { resolveWebSpacing, resolveWebRadius } from '../utils/themeUtils';

export interface WebCardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: SpacingToken | number | string;
  borderRadius?: RadiusToken | number | string;
  bordered?: boolean;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export const Card: React.FC<WebCardProps> = ({
  padding = 'lg',
  borderRadius = 'md',
  bordered = true,
  elevation = 'none',
  style,
  children,
  ...rest
}) => {
  const { theme } = useTheme();

  const paddingVal = resolveWebSpacing(padding) || '16px';
  const radiusVal = resolveWebRadius(borderRadius) || '8px';

  const shadowMap = {
    none: 'none',
    sm: '0 1px 3px rgba(0,0,0,0.1)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
  };

  return (
    <div
      style={{
        backgroundColor: theme.card,
        color: theme.foreground,
        padding: paddingVal,
        borderRadius: radiusVal,
        border: bordered ? `1px solid ${theme.border}` : 'none',
        boxShadow: shadowMap[elevation],
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
