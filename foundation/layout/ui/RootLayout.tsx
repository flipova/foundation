/**
 * RootLayout — Root page container with full flex control.
 *
 * Unlike VoidLayout, this layout is a single flex container that directly
 * passes justifyContent/alignItems to its children. No nested Box wrappers.
 * Designed to be the root node of every page in the studio.
 */

import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getLayoutMeta } from "../registry";

const META = getLayoutMeta("RootLayout")!;

export interface RootLayoutProps {
  children: React.ReactNode;
  background?: string;
  scrollable?: boolean;
  padding?: number;
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
  alignItems?: "stretch" | "flex-start" | "center" | "flex-end" | "baseline";
  flexDirection?: "column" | "row";
  gap?: number;
}

const RootLayout: React.FC<RootLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    children, background, scrollable, padding,
    justifyContent, alignItems, flexDirection, gap,
  } = applyDefaults(rawProps, META, theme) as Required<RootLayoutProps>;

  const bg = background || theme.background;
  const containerStyle = {
    flex: 1,
    backgroundColor: bg,
    justifyContent: justifyContent || "flex-start",
    alignItems: alignItems || "stretch",
    flexDirection: flexDirection || "column",
    gap: gap || undefined,
    padding: padding ? padding * 4 : undefined,
  } as const;

  if (scrollable) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: bg }}
        contentContainerStyle={[containerStyle, { flexGrow: 1 }]}
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={containerStyle}>{children}</View>;
};

export default RootLayout;
