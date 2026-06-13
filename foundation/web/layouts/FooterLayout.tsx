/**
 * FooterLayout — Web Layout
 *
 * Contenu principal avec footer fixe ou en bas.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken, spacing, SpacingToken } from "../../tokens";
import { applyDefaults, getLayoutMeta } from "../../layout/registry";

const META = getLayoutMeta("FooterLayout")!;

export interface FooterLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  footer?: React.ReactNode;
  footerHeight?: number;
  spacing?: SpacingToken;
  sticky?: boolean;
  maxWidth?: number;
  scrollable?: boolean;
  footerBackground?: string;
  footerBorderRadius?: RadiusToken;
  contentBorderRadius?: RadiusToken;
  background?: string;
  borderRadius?: RadiusToken;
  padding?: SpacingToken;
  footerPadding?: SpacingToken;
  compact?: boolean;
}

const FooterLayout: React.FC<FooterLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    footer, footerHeight, spacing: spacingToken, sticky, maxWidth, scrollable,
    footerBackground, footerBorderRadius, contentBorderRadius, background,
    borderRadius, padding: paddingToken, footerPadding, compact,
    children, style, ...rest
  } = applyDefaults(rawProps, META, theme) as Required<FooterLayoutProps> & typeof rawProps;

  const fh = footerHeight ?? 60;
  const gap = spacingToken != null ? spacing[spacingToken] : 0;
  const pad = paddingToken != null ? spacing[paddingToken] : spacing[5];
  const fPad = footerPadding != null ? spacing[footerPadding] : spacing[5];

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100%",
    maxWidth: maxWidth ?? undefined,
    backgroundColor: background ?? theme.background,
    borderRadius: borderRadius ? radii[borderRadius] : undefined,
    boxSizing: "border-box",
    ...style,
  };

  const contentStyle: CSSProperties = {
    flex: 1,
    padding: pad,
    overflowY: scrollable ? "auto" : undefined,
    borderRadius: contentBorderRadius ? radii[contentBorderRadius] : undefined,
    marginBottom: sticky ? fh + gap : gap,
    boxSizing: "border-box",
  };

  const footerStyle: CSSProperties = {
    height: fh,
    padding: compact ? fPad / 2 : fPad,
    backgroundColor: footerBackground ?? theme.background,
    borderRadius: footerBorderRadius ? radii[footerBorderRadius] : undefined,
    borderTop: `1px solid ${theme.border}`,
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    ...(sticky
      ? { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100 }
      : {}),
    boxSizing: "border-box",
  };

  return (
    <div style={containerStyle} {...rest}>
      <div style={contentStyle}>{children}</div>
      {footer && <div style={footerStyle}>{footer}</div>}
    </div>
  );
};

export default FooterLayout;
