/**
 * Badge — Web Component
 *
 * Petit indicateur de statut ou label. Miroir web du composant RN Badge.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken } from "../../tokens";
import { applyDefaults, getComponentMeta } from "../../registry";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("Badge")!;

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">, ExtractComponentProps<"Badge"> {
  children?: React.ReactNode;
}



const Badge: React.FC<BadgeProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    label,
    variant,
    size,
    color,
    borderRadius,
    children,
    style,
    ...rest
  } = applyDefaults(rawProps, META, theme) as Required<BadgeProps> & typeof rawProps;

  const resolveColor = (c: string) =>
    c in (theme as object) ? ((theme as unknown as Record<string, string>)[c]) : c;

  const colorDef = (META.colorMap?.[color] ?? META.colorMap?.["primary"]) as any;
  const radius = radii[borderRadius as keyof typeof radii];

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
