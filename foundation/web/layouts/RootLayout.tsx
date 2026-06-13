/**
 * RootLayout — Web Layout
 *
 * Conteneur racine de page. Équivalent web de RootLayout RN.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { spacing, SpacingToken } from "../../tokens";
import { applyDefaults, getLayoutMeta } from "../../layout/registry";

const META = getLayoutMeta("RootLayout")!;

export interface RootLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  background?: string;
  scrollable?: boolean;
  padding?: SpacingToken;
  justifyContent?: CSSProperties["justifyContent"];
  alignItems?: CSSProperties["alignItems"];
  flexDirection?: "row" | "column";
  gap?: SpacingToken;
}

const RootLayout: React.FC<RootLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    background, scrollable, padding: paddingToken, justifyContent,
    alignItems, flexDirection, gap: gapToken, children, style, ...rest
  } = applyDefaults(rawProps, META, theme) as Required<RootLayoutProps> & typeof rawProps;

  const layoutStyle: CSSProperties = {
    display: "flex",
    flexDirection: flexDirection ?? "column",
    justifyContent,
    alignItems,
    gap: gapToken != null ? spacing[gapToken] : undefined,
    minHeight: "100vh",
    width: "100%",
    backgroundColor: background ?? theme.background,
    padding: paddingToken != null ? spacing[paddingToken] : undefined,
    overflowY: scrollable ? "auto" : "hidden",
    boxSizing: "border-box",
    ...style,
  };

  return (
    <div style={layoutStyle} {...rest}>
      {children}
    </div>
  );
};

export default RootLayout;
