/**
 * CenteredLayout — Web Layout
 *
 * Contenu centré avec carte optionnelle et maxWidth.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken, shadows, spacing, SpacingToken } from "../../tokens";
import { applyDefaults, getLayoutMeta } from "../../layout/registry";

const META = getLayoutMeta("CenteredLayout")!;

export interface CenteredLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: number;
  padding?: SpacingToken;
  background?: string;
  cardBackground?: string;
  borderRadius?: RadiusToken;
  shadowed?: boolean;
  mobilePadding?: SpacingToken;
  desktopPadding?: SpacingToken;
}

const CenteredLayout: React.FC<CenteredLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    maxWidth, padding: paddingToken, background, cardBackground,
    borderRadius, shadowed, children, style, ...rest
  } = applyDefaults(rawProps, META, theme) as Required<CenteredLayoutProps> & typeof rawProps;

  const outerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: background ?? theme.background,
    padding: 16,
    boxSizing: "border-box",
    ...style,
  };

  const cardStyle: CSSProperties = {
    width: "100%",
    maxWidth: maxWidth ?? 500,
    padding: paddingToken != null ? spacing[paddingToken] : spacing[4],
    backgroundColor: cardBackground ?? theme.card,
    borderRadius: borderRadius ? radii[borderRadius] : radii["3xl"],
    boxShadow: shadowed ? `0 4px 32px rgba(0,0,0,0.12)` : "none",
    boxSizing: "border-box",
  };

  return (
    <div style={outerStyle} {...rest}>
      <div style={cardStyle}>
        {children}
      </div>
    </div>
  );
};

export default CenteredLayout;
