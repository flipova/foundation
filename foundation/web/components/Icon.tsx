/**
 * Icon — Web Component
 *
 * Icône vectorielle depuis lucide-react.
 * Miroir du composant RN Icon (qui utilise lucide-react-native).
 */

import React from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import * as LucideIcons from "lucide-react";

export interface IconProps {
  /** Nom de l'icône Lucide (ex: "Star", "Home", "User"). Case-sensitive. */
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Capitalize first letter helper (lucide uses PascalCase)
function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  strokeWidth = 2,
  className,
  style,
}) => {
  const { theme } = useTheme();
  const resolvedColor = color ?? theme.foreground;
  const key = toPascalCase(name) as keyof typeof LucideIcons;
  const IconComponent = LucideIcons[key] as React.FC<React.SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }> | undefined;

  if (!IconComponent) {
    console.warn(`[Icon] Unknown icon: "${name}". Check lucide-react docs.`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      color={resolvedColor}
      strokeWidth={strokeWidth}
      className={className}
      style={style}
    />
  );
};

export default Icon;
