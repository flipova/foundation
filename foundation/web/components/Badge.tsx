/**
 * Badge — Web Component
 *
 * Petit indicateur de statut ou label. Miroir web du composant RN Badge.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken } from "../../tokens";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
  variant?: "solid" | "outline" | "subtle";
  size?: "sm" | "md";
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  borderRadius?: RadiusToken;
  children?: React.ReactNode;
}

const COLOR_MAP: Record<string, { solid: [string, string]; subtle: [string, string] }> = {
  primary:   { solid: ["primary", "primaryForeground"],   subtle: ["primary", "primaryForeground"] },
  secondary: { solid: ["secondary", "secondaryForeground"], subtle: ["secondary", "secondaryForeground"] },
  success:   { solid: ["#16a34a", "#fff"],   subtle: ["#dcfce7", "#166534"] },
  warning:   { solid: ["#d97706", "#fff"],   subtle: ["#fef3c7", "#92400e"] },
  error:     { solid: ["destructive", "destructiveForeground"], subtle: ["destructive", "destructiveForeground"] },
  info:      { solid: ["#0ea5e9", "#fff"],   subtle: ["#e0f2fe", "#0369a1"] },
};

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "solid",
  size = "md",
  color = "primary",
  borderRadius = "full",
  children,
  style,
  ...rest
}) => {
  const { theme } = useTheme();

  const resolveColor = (c: string) =>
    c in (theme as object) ? ((theme as unknown as Record<string, string>)[c]) : c;

  const colorDef = COLOR_MAP[color] ?? COLOR_MAP.primary;
  const radius = radii[borderRadius];

  const bgColor = variant === "solid"
    ? resolveColor(colorDef.solid[0])
    : variant === "subtle"
    ? resolveColor(colorDef.subtle[0]) + "22"
    : "transparent";

  const textColor = variant === "solid"
    ? resolveColor(colorDef.solid[1])
    : resolveColor(colorDef.subtle[1]);

  const badgeStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: size === "sm" ? 6 : 10,
    paddingRight: size === "sm" ? 6 : 10,
    paddingTop: size === "sm" ? 2 : 4,
    paddingBottom: size === "sm" ? 2 : 4,
    fontSize: size === "sm" ? 11 : 12,
    fontWeight: 600,
    fontFamily: "inherit",
    borderRadius: radius,
    backgroundColor: bgColor,
    color: textColor,
    border: variant === "outline" ? `1px solid ${resolveColor(colorDef.solid[0])}` : "none",
    whiteSpace: "nowrap",
    lineHeight: 1,
    ...style,
  };

  return (
    <span style={badgeStyle} {...rest}>
      {children ?? label}
    </span>
  );
};

export default Badge;
