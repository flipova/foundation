/**
 * SidebarLayout — Web Layout
 *
 * Contenu avec sidebar latérale, collapsible sur mobile.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken, spacing, SpacingToken } from "../../tokens";
import { applyDefaults, getLayoutMeta } from "../../layout/registry";

const META = getLayoutMeta("SidebarLayout")!;

export interface SidebarLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar?: React.ReactNode;
  sidebarWidth?: number;
  position?: "left" | "right";
  collapsible?: boolean;
  spacing?: SpacingToken;
  maxWidth?: number;
  scrollable?: boolean;
  background?: string;
  borderRadius?: RadiusToken;
  sidebarBackground?: string;
  sidebarBorderRadius?: RadiusToken;
  padding?: SpacingToken;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    sidebar, sidebarWidth, position, collapsible, spacing: spacingToken,
    maxWidth, scrollable, background, borderRadius, sidebarBackground,
    sidebarBorderRadius, padding: paddingToken, children, style, ...rest
  } = applyDefaults(rawProps, META, theme) as Required<SidebarLayoutProps> & typeof rawProps;

  const sw = sidebarWidth ?? 280;
  const gap = spacingToken != null ? spacing[spacingToken] : spacing[4];
  const pad = paddingToken != null ? spacing[paddingToken] : undefined;

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: position === "right" ? "row-reverse" : "row",
    width: "100%",
    maxWidth: maxWidth ?? undefined,
    gap,
    backgroundColor: background ?? undefined,
    borderRadius: borderRadius ? radii[borderRadius] : undefined,
    padding: pad,
    boxSizing: "border-box",
    minHeight: "100vh",
    ...style,
  };

  const sidebarStyle: CSSProperties = {
    width: sw,
    flexShrink: 0,
    backgroundColor: sidebarBackground ?? theme.card,
    borderRadius: sidebarBorderRadius ? radii[sidebarBorderRadius] : undefined,
    overflowY: "auto",
    alignSelf: "flex-start",
    position: "sticky",
    top: 0,
    maxHeight: "100vh",
    boxSizing: "border-box",
  };

  const contentStyle: CSSProperties = {
    flex: 1,
    overflowY: scrollable ? "auto" : undefined,
    minWidth: 0,
    boxSizing: "border-box",
  };

  return (
    <>
      {collapsible && (
        <style>{`
          @media (max-width: 768px) {
            .flipova-sidebar { display: none !important; }
          }
        `}</style>
      )}
      <div style={containerStyle} {...rest}>
        {sidebar && <div className="flipova-sidebar" style={sidebarStyle}>{sidebar}</div>}
        <div style={contentStyle}>{children}</div>
      </div>
    </>
  );
};

export default SidebarLayout;
