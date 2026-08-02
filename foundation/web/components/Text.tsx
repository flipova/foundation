import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';
import { resolveWebColor } from '../utils/themeUtils';

export interface WebTextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'heading' | 'subheading' | 'body' | 'caption' | 'code' | 'label';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'error' | 'success' | string;
  align?: 'left' | 'center' | 'right' | 'justify';
  as?: React.ElementType;
  children?: React.ReactNode;
}

export const Text: React.FC<WebTextProps> = ({
  variant = 'body',
  size,
  weight,
  color = 'primary',
  align,
  as,
  style,
  children,
  ...rest
}) => {
  const { theme } = useTheme();

  const resolveColor = (): string => {
    if (color === 'primary') return theme.foreground;
    if (color === 'secondary') return theme.secondary;
    if (color === 'muted') return theme.mutedForeground;
    if (color === 'error') return theme.error;
    if (color === 'success') return theme.success;
    return resolveWebColor(theme, color);
  };

  const getVariantStyles = (): { fontSize: string; fontWeight: number; Component: React.ElementType } => {
    switch (variant) {
      case 'heading':
        return { fontSize: size ? getSize(size) : '24px', fontWeight: 700, Component: as || 'h2' };
      case 'subheading':
        return { fontSize: size ? getSize(size) : '18px', fontWeight: 600, Component: as || 'h3' };
      case 'caption':
        return { fontSize: size ? getSize(size) : '12px', fontWeight: 400, Component: as || 'span' };
      case 'code':
        return { fontSize: size ? getSize(size) : '13px', fontWeight: 400, Component: as || 'code' };
      case 'label':
        return { fontSize: size ? getSize(size) : '14px', fontWeight: 600, Component: as || 'label' };
      case 'body':
      default:
        return { fontSize: size ? getSize(size) : '14px', fontWeight: 400, Component: as || 'p' };
    }
  };

  const getSize = (s: string): string => {
    const map: Record<string, string> = {
      xs: '11px',
      sm: '13px',
      md: '15px',
      lg: '18px',
      xl: '24px',
      xxl: '32px',
    };
    return map[s] || '14px';
  };

  const weightMap: Record<string, number> = {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  };

  const variantInfo = getVariantStyles();
  const Tag = variantInfo.Component;

  return (
    <Tag
      style={{
        margin: 0,
        padding: 0,
        color: resolveColor(),
        fontSize: variantInfo.fontSize,
        fontWeight: weight ? weightMap[weight] : variantInfo.fontWeight,
        fontFamily: variant === 'code' ? 'monospace' : 'inherit',
        textAlign: align,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
};
