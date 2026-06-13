/**
 * ResponsiveLayout — Web Layout
 *
 * Layout adaptatif header/sidebar/content/footer avec 3 modes.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken, spacing, SpacingToken } from "../../tokens";
import { applyDefaults, getLayoutMeta } from "../../layout/registry";

const META = getLayoutMeta("ResponsiveLayout")!;

export interface ResponsiveLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  content?: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  spacing?: SpacingToken;
  headerHeight?: number;
  sidebarWidth?: number;
  footerHeight?: number;
  adaptiveMode?: "basic" | "sidebar" | "full";
  hideHeader?: boolean;
  hideFooter?: boolean;
  collapseFooterOnTablet?: boolean;
  background?: string;
  borderRadius?: RadiusToken;
  headerBackground?: string;
  sidebarBackground?: string;
  footerBackground?: string;
  contentBackground?: string;
  padding?: SpacingToken;
  contentPadding?: SpacingToken;
  mobileHeaderHeight?: number;
  tabletFooterHeight?: number;
  sidebarMaxWidth?: number;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    content, header, sidebar, footer, spacing: spacingToken, headerHeight,
    sidebarWidth, footerHeight, adaptiveMode, hideHeader, hideFooter,
    background, borderRadius, headerBackground, sidebarBackground,
    footerBackground, contentBackground, contentPadding: contentPadToken,
    sidebarMaxWidth, children, style, ...rest
  } = applyDefaults(rawProps, META, theme) as Required<ResponsiveLayoutProps> & typeof rawProps;

  const hh = headerHeight ?? 60;
  const sw = Math.min(sidebarWidth ?? 260, sidebarMaxWidth ?? 320);
  const fh = footerHeight ?? 60;
  const gap = spacingToken != null ? spacing[spacingToken] : 0;
  const cPad = contentPadToken != null ? spacing[contentPadToken] : undefined;
  const hasSidebar = sidebar && (adaptiveMode === "sidebar" || adaptiveMode === "full");

  const rootStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: background ?? theme.background,
    borderRadius: borderRadius ? radii[borderRadius] : undefined,
    boxSizing: "border-box",
    ...style,
  };

  const headerStyle: CSSProperties = {
    height: hh,
    backgroundColor: headerBackground ?? theme.background,
    borderBottom: `1px solid ${theme.border}`,
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    position: "sticky",
    top: 0,
    zIndex: 50,
    boxSizing: "border-box",
  };

  const bodyStyle: CSSProperties = {
    display: "flex",
    flex: 1,
    gap,
    overflow: "hidden",
  };

  const sidebarStyle: CSSProperties = {
    width: sw,
    flexShrink: 0,
    backgroundColor: sidebarBackground ?? theme.background,
    borderRight: `1px solid ${theme.border}`,
    overflowY: "auto",
    boxSizing: "border-box",
  };

  const contentStyle: CSSProperties = {
    flex: 1,
    overflowY: "auto",
    backgroundColor: contentBackground ?? undefined,
    padding: cPad,
    minWidth: 0,
    boxSizing: "border-box",
  };

  const footerStyle: CSSProperties = {
    height: fh,
    backgroundColor: footerBackground ?? theme.background,
    borderTop: `1px solid ${theme.border}`,
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    boxSizing: "border-box",
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .flipova-responsive-sidebar { display: none !important; }
        }
      `}</style>
      <div style={rootStyle} {...rest}>
        {!hideHeader && header && <div style={headerStyle}>{header}</div>}
        <div style={bodyStyle}>
          {hasSidebar && (
            <div className="flipova-responsive-sidebar" style={sidebarStyle}>
              {sidebar}
            </div>
          )}
          <div style={contentStyle}>{content ?? children}</div>
        </div>
        {!hideFooter && footer && <div style={footerStyle}>{footer}</div>}
      </div>
    </>
  );
};

export default ResponsiveLayout;
