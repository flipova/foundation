/**
 * Badge — Small status indicator or label.
 */
import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Box from "../primitives/Box";

const META = getComponentMeta("Badge")!;

export interface BadgeProps {
  children?: React.ReactNode; label?: string; variant?: "solid" | "outline" | "subtle";
  size?: "sm" | "md"; color?: string; borderRadius?: string;
}

const Badge: React.FC<BadgeProps> = (rawProps) => {
  const { theme } = useTheme();
  const { children, label, variant, size, color, borderRadius } = applyDefaults(rawProps, META, theme) as Required<BadgeProps>;
  const colorMap: Record<string, { bg: string; text: string }> = {
    primary: { bg: theme.primary, text: theme.primaryForeground },
    secondary: { bg: theme.secondary, text: theme.secondaryForeground },
    success: { bg: theme.success, text: "#fff" },
    warning: { bg: theme.warning, text: "#fff" },
    error: { bg: theme.error, text: "#fff" },
    info: { bg: theme.info, text: "#fff" },
  };
  const c = colorMap[color] || colorMap.primary;
  const bg = variant === "outline" ? "transparent" : variant === "subtle" ? c.bg + "20" : c.bg;
  const textColor = variant === "solid" ? c.text : c.bg;
  const fs = size === "sm" ? 10 : 12;
  const px = size === "sm" ? 6 : 8;
  const py = size === "sm" ? 1 : 2;

  return (
    <Box bg={bg} borderRadius={borderRadius as any} px={0} py={0}
      style={{ paddingHorizontal: px, paddingVertical: py, alignSelf: "flex-start", ...(variant === "outline" ? { borderWidth: 1, borderColor: c.bg } : {}) }}>
      {children || <Text style={{ fontSize: fs, fontWeight: "600", color: textColor }}>{label || ""}</Text>}
    </Box>
  );
};

export default Badge;
