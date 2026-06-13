/**
 * FlexLayout — Web Layout
 *
 * Direction, wrap et espacement adaptatifs. Scroll optionnel.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken, spacing, SpacingToken } from "../../tokens";
import { applyDefaults, getLayoutMeta } from "../../layout/registry";

const META = getLayoutMeta("FlexLayout")!;

export interface FlexLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
  wrap?: boolean;
  spacing?: SpacingToken;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  maxWidth?: number;
  scrollable?: boolean;
  padding?: SpacingToken;
  background?: string;
  borderRadius?: RadiusToken;
}

const FlexLayout: React.FC<FlexLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    direction, wrap, spacing: spacingToken, align, justify, maxWidth,
    scrollable, padding: paddingToken, background, borderRadius,
    children, style, ...rest
  } = applyDefaults(rawProps, META, theme) as Required<FlexLayoutProps> & typeof rawProps;

  const flexStyle: CSSProperties = {
    display: "flex",
    flexDirection: direction ?? "row",
    flexWrap: wrap ? "wrap" : "nowrap",
    gap: spacingToken != null ? spacing[spacingToken] : spacing[4],
    alignItems: align ?? "stretch",
    justifyContent: justify ?? "flex-start",
    maxWidth: maxWidth ?? undefined,
    padding: paddingToken != null ? spacing[paddingToken] : undefined,
    backgroundColor: background ?? "transparent",
    borderRadius: borderRadius ? radii[borderRadius] : undefined,
    overflowX: scrollable && direction === "row" ? "auto" : undefined,
    overflowY: scrollable && direction === "column" ? "auto" : undefined,
    boxSizing: "border-box",
    width: "100%",
    ...style,
  };

  return (
    <div style={flexStyle} {...rest}>
      {children}
    </div>
  );
};

export default FlexLayout;
