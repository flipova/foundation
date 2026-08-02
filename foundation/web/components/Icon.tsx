import React from 'react';
import * as LucideIcons from 'lucide-react';
import { useTheme } from '../../theme/providers/ThemeProvider';
import { resolveWebColor } from '../utils/themeUtils';

export interface WebIconProps {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<WebIconProps> = ({
  name,
  size = 20,
  color,
  style,
  ...rest
}) => {
  const { theme } = useTheme();
  const iconColor = color ? resolveWebColor(theme, color) : theme.foreground;

  // Format icon name from kebab-case/snake_case to PascalCase
  const formatName = (str: string) =>
    str
      .replace(/(^\w|-\w|_\w)/g, (m) => m.replace(/[-_]/, '').toUpperCase());

  const pascalName = formatName(name);
  const IconComponent = (LucideIcons as any)[pascalName] || LucideIcons.HelpCircle;

  return <IconComponent size={size} color={iconColor} style={style} {...rest} />;
};
