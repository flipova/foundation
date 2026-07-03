/**
 * RootLayout — Web Layout
 *
 * Conteneur racine de page. Équivalent web de RootLayout RN.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { spacing } from "../../tokens";
import { applyDefaults, getLayoutMeta } from "../../registry";
import type { ExtractLayoutProps } from "../../registry";

const META = getLayoutMeta("RootLayout")!;

export interface RootLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color" | "size">, ExtractLayoutProps<"RootLayout"> {

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
    gap: gapToken != null ? spacing[gapToken as keyof typeof spacing] : undefined,
    minHeight: "100vh",
    width: "100%",
    backgroundColor: background ?? theme.background,
    padding: paddingToken != null ? spacing[paddingToken as keyof typeof spacing] : undefined,
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
