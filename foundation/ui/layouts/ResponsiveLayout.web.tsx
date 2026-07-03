/**
 * ResponsiveLayout — Web Layout
 *
 * Layout adaptatif header/sidebar/content/footer avec 3 modes.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken, spacing } from "../../tokens";
import { applyDefaults, getLayoutMeta } from "../../registry";
import type { ExtractLayoutProps } from "../../registry";

const META = getLayoutMeta("ResponsiveLayout")!;

export interface ResponsiveLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color" | "content">, ExtractLayoutProps<"ResponsiveLayout"> {
  content?: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
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
  const gap = spacingToken != null ? spacing[spacingToken as unknown as keyof typeof spacing] : 0;
  const cPad = contentPadToken != null ? spacing[contentPadToken as unknown as keyof typeof spacing] : undefined;
  const hasSidebar = sidebar && (adaptiveMode === "sidebar" || adaptiveMode === "full");

  const rootStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: background ?? theme.background,
    borderRadius: borderRadius ? radii[borderRadius as RadiusToken] : undefined,
    overflow: "hidden",
    boxSizing: "border-box",
    ...style,
  };

  const headerStyle: CSSProperties = {
    height: hh,
    backgroundColor: headerBackground ?? theme.card,
    flexShrink: 0,
    boxSizing: "border-box",
  };

  const middleStyle: CSSProperties = {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    gap,
    overflow: "hidden",
  };

  const sidebarStyle: CSSProperties = {
    width: sw,
    backgroundColor: sidebarBackground ?? theme.card,
    overflowY: "auto",
    boxSizing: "border-box",
  };

  const contentWrapStyle: CSSProperties = {
    flex: 1,
    backgroundColor: contentBackground ?? "transparent",
    padding: cPad,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  };

  const footerStyle: CSSProperties = {
    height: fh,
    backgroundColor: footerBackground ?? theme.card,
    flexShrink: 0,
    boxSizing: "border-box",
  };

  return (
    <div style={rootStyle} {...rest}>
      {!hideHeader && header && <header style={headerStyle}>{header}</header>}
      <div style={middleStyle}>
        {hasSidebar && <aside style={sidebarStyle}>{sidebar}</aside>}
        <main style={contentWrapStyle}>
          {content || children}
        </main>
      </div>
      {!hideFooter && footer && <footer style={footerStyle}>{footer}</footer>}
    </div>
  );
};

export default ResponsiveLayout;
