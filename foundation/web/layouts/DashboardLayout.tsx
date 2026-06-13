/**
 * DashboardLayout — Web Layout
 *
 * Header fixe, sidebar collapsible, contenu scrollable, footer optionnel.
 */

import React, { CSSProperties, useState } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { spacing, SpacingToken } from "../../tokens";
import { applyDefaults, getLayoutMeta } from "../../layout/registry";

const META = getLayoutMeta("DashboardLayout")!;

export interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  sidebarWidth?: number;
  sidebarCollapsedWidth?: number;
  headerHeight?: number;
  footerHeight?: number;
  background?: string;
  headerBackground?: string;
  sidebarBackground?: string;
  contentBackground?: string;
  footerBackground?: string;
  headerPaddingX?: SpacingToken;
  disableContentScroll?: boolean;
  defaultSidebarCollapsed?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    header, sidebar, footer, sidebarWidth, sidebarCollapsedWidth, headerHeight,
    footerHeight, background, headerBackground, sidebarBackground, contentBackground,
    footerBackground, headerPaddingX, disableContentScroll, defaultSidebarCollapsed,
    children, style, ...rest
  } = applyDefaults(rawProps, META, theme) as Required<DashboardLayoutProps> & typeof rawProps;

  const [collapsed, setCollapsed] = useState(defaultSidebarCollapsed ?? false);
  const sw = collapsed ? (sidebarCollapsedWidth ?? 70) : (sidebarWidth ?? 260);
  const hh = headerHeight ?? 70;
  const fh = footerHeight ?? 60;
  const hpx = headerPaddingX != null ? spacing[headerPaddingX] : spacing[4];

  const rootStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: sidebar ? `${sw}px 1fr` : "1fr",
    gridTemplateRows: `${hh}px 1fr${footer ? ` ${fh}px` : ""}`,
    minHeight: "100vh",
    width: "100%",
    backgroundColor: background ?? theme.background,
    transition: "grid-template-columns 0.25s ease",
    ...style,
  };

  const headerStyle: CSSProperties = {
    gridColumn: "1 / -1",
    height: hh,
    backgroundColor: headerBackground ?? theme.card,
    borderBottom: `1px solid ${theme.border}`,
    display: "flex",
    alignItems: "center",
    paddingLeft: hpx,
    paddingRight: hpx,
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxSizing: "border-box",
    gap: 12,
  };

  const sidebarStyle: CSSProperties = {
    gridRow: "2",
    height: "100%",
    backgroundColor: sidebarBackground ?? theme.card,
    borderRight: `1px solid ${theme.border}`,
    overflowY: "auto",
    overflowX: "hidden",
    transition: "width 0.25s ease",
    width: sw,
    position: "sticky",
    top: hh,
    maxHeight: `calc(100vh - ${hh}px)`,
    boxSizing: "border-box",
  };

  const contentStyle: CSSProperties = {
    gridRow: "2",
    backgroundColor: contentBackground ?? theme.card,
    overflowY: disableContentScroll ? "hidden" : "auto",
    boxSizing: "border-box",
  };

  const footerStyle: CSSProperties = {
    gridColumn: "1 / -1",
    height: fh,
    backgroundColor: footerBackground ?? theme.card,
    borderTop: `1px solid ${theme.border}`,
    display: "flex",
    alignItems: "center",
    paddingLeft: hpx,
    paddingRight: hpx,
    position: "sticky",
    bottom: 0,
    boxSizing: "border-box",
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .flipova-dashboard-sidebar { display: none !important; }
          .flipova-dashboard-root { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div {...rest} className={`flipova-dashboard-root ${rest.className || ""}`} style={rootStyle}>
        {header && <div style={headerStyle}>{header}</div>}
        {sidebar && (
          <div className="flipova-dashboard-sidebar" style={sidebarStyle}>
            {sidebar}
          </div>
        )}
        <div style={contentStyle}>{children}</div>
        {footer && <div style={footerStyle}>{footer}</div>}
      </div>
    </>
  );
};

export default DashboardLayout;
