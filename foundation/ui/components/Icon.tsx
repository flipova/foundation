/**
 * Icon — Web Component
 *
 * Icône vectorielle depuis lucide-react.
 * Miroir du composant RN Icon (qui utilise lucide-react-native).
 */

import React from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import * as LucideIcons from "lucide-react";
import { applyDefaults, getComponentMeta } from "../../registry";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("Icon")!;

export interface IconProps extends ExtractComponentProps<"Icon"> {

}

// Capitalize first letter helper (lucide uses PascalCase)
function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

const Icon: React.FC<IconProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    name, size, color, strokeWidth, className, style,
  } = applyDefaults(rawProps, META, theme) as Required<IconProps> & { className?: string; style?: React.CSSProperties };
  
  const resolvedColor = color ?? theme.foreground;
  const key = toPascalCase(name) as keyof typeof LucideIcons;
  const IconComponent = LucideIcons[key] as React.FC<React.SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }> | undefined;

  if (!IconComponent) {
    console.warn(`[Icon] Unknown icon: "${name}". Check lucide-react docs.`);
    return null;
  }

  return (
    <IconComponent
      size={size as number}
      color={resolvedColor}
      strokeWidth={strokeWidth as number}
      className={className}
      style={style}
    />
  );
};

export default Icon;
