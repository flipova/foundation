import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';

export interface WebAvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  shape?: 'circle' | 'square';
  style?: React.CSSProperties;
}

export const Avatar: React.FC<WebAvatarProps> = ({
  src,
  name,
  size = 'md',
  shape = 'circle',
  style,
}) => {
  const { theme } = useTheme();

  const getSizePx = (): number => {
    if (typeof size === 'number') return size;
    const map = { sm: 32, md: 40, lg: 56, xl: 72 };
    return map[size] || 40;
  };

  const dim = getSizePx();

  const getInitials = (n?: string): string => {
    if (!n) return '?';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div
      style={{
        width: `${dim}px`,
        height: `${dim}px`,
        borderRadius: shape === 'circle' ? '50%' : '8px',
        backgroundColor: theme.primary,
        color: theme.primaryForeground,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: `${Math.round(dim * 0.4)}px`,
        overflow: 'hidden',
        flexShrink: 0,
        ...style,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        getInitials(name)
      )}
    </div>
  );
};
