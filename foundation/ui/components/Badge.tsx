/**
 * Badge — Small status indicator or label.
 */
import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../theme/providers/ThemeProvider";
import Box from "../primitives/Box";
import { applyDefaults, getComponentMeta } from "../../registry";
import { BadgeColorMap } from "../../registry";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("Badge")!;

export interface BadgeProps extends ExtractComponentProps<"Badge"> {
  children?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = (rawProps) => {
  const { theme } = useTheme();
  const { children, label, variant, size, color, borderRadius } = applyDefaults(rawProps, META, theme) as Required<BadgeProps>;
  const c = BadgeColorMap[color] || BadgeColorMap.primary;
  const solid = c.solid;
  const subtle = c.subtle;

  // Resolve against theme manually since it uses string identifiers like 'primary' etc.
  const bgColors = {
    solid: (theme as any)[solid[0]] || solid[0],
    subtle: (theme as any)[subtle[0]] || subtle[0],
  };
  const textColors = {
    solid: (theme as any)[solid[1]] || solid[1],
    subtle: (theme as any)[subtle[1]] || subtle[1],
  };

  const bg = variant === "outline" ? "transparent" : variant === "subtle" ? bgColors.subtle : bgColors.solid;
  const fg = variant === "outline" ? bgColors.solid : variant === "subtle" ? textColors.subtle : textColors.solid;
  const border = variant === "outline" ? bgColors.solid : "transparent";
  const px = size === "sm" ? 6 : 8;
  const py = size === "sm" ? 1 : 2;
  const fs = size === "sm" ? 10 : 12;

  return (
    <Box bg={bg} borderRadius={borderRadius as any} px={0} py={0}
      style={{ paddingHorizontal: px, paddingVertical: py, alignSelf: "flex-start", ...(variant === "outline" ? { borderWidth: 1, borderColor: bgColors.solid } : {}) }}>
      {children || <Text style={{ fontSize: fs, fontWeight: "600", color: fg }}>{label || ""}</Text>}
    </Box>
  );
};

export default Badge;
