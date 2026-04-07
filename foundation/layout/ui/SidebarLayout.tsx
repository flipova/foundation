/**
 * SidebarLayout
 *
 * Main content with a lateral sidebar (left or right).
 * Collapsible on mobile, resizable on web/desktop. Supports gradient backgrounds.
 */

import React from "react";
import { Platform } from "react-native";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken, SpacingToken } from "../../tokens";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { LayoutPadding, LayoutBackground } from "../types";
import { applyDefaults, getLayoutMeta } from "../registry";
import Box from "./primitives/Box";
import Inline from "./primitives/Inline";
import Scroll from "./primitives/Scroll";

const META = getLayoutMeta("SidebarLayout")!;

export interface SidebarLayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
  sidebarWidth?: number;
  position?: "left" | "right";
  collapsible?: boolean;
  spacing?: SpacingToken;
  maxWidth?: number;
  scrollable?: boolean;
  background?: LayoutBackground;
  borderRadius?: RadiusToken;
  sidebarBackground?: LayoutBackground;
  sidebarBorderRadius?: RadiusToken;
  padding?: LayoutPadding;
  resizable?: boolean;
  sidebarMinWidth?: number;
  sidebarMaxWidth?: number;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    sidebar, content, sidebarWidth, position, collapsible, spacing,
    maxWidth, scrollable, background, borderRadius,
    sidebarBackground, sidebarBorderRadius, padding, resizable,
    sidebarMinWidth, sidebarMaxWidth,
  } = applyDefaults(rawProps, META, theme) as Required<SidebarLayoutProps>;

  const { isMobile } = useBreakpoint();
  const showSidebar = !(collapsible && isMobile);
  const canResize = resizable && Platform.OS === "web" && !isMobile;

  const rootBg = Array.isArray(background)
    ? undefined
    : background ?? theme.background;
  const rootGradient =
    Array.isArray(background) && background.length >= 2
      ? (background.slice(0, 2) as [string, string])
      : undefined;

  const sidebarBg = Array.isArray(sidebarBackground)
    ? undefined
    : sidebarBackground ?? theme.card;
  const sidebarGradient =
    Array.isArray(sidebarBackground) && sidebarBackground.length >= 2
      ? (sidebarBackground.slice(0, 2) as [string, string])
      : undefined;

  const side = (
    <Box
      bg={sidebarBg}
      gradient={sidebarGradient}
      borderRadius={sidebarBorderRadius}
      overflow="hidden"
      width={showSidebar ? sidebarWidth : 0}
      style={
        canResize
          ? ({
              resize: position === "left" ? "horizontal" : "none",
              minWidth: sidebarMinWidth,
              maxWidth: sidebarMaxWidth,
              borderRightWidth: position === "left" ? 1 : 0,
              borderLeftWidth: position === "right" ? 1 : 0,
              borderColor: theme.border,
            } as any)
          : undefined
      }
    >
      {scrollable ? <Scroll>{sidebar}</Scroll> : sidebar}
    </Box>
  );

  const main = (
    <Box flex={1} overflow="hidden">
      {scrollable ? <Scroll>{content}</Scroll> : content}
    </Box>
  );

  return (
    <Box
      flex={1}
      bg={rootBg}
      gradient={rootGradient}
      borderRadius={borderRadius}
      width="100%"
      maxWidth={maxWidth}
      alignSelf="center"
      overflow="hidden"
      pt={padding?.top ?? padding?.vertical}
      pb={padding?.bottom ?? padding?.vertical}
      pl={padding?.left ?? padding?.horizontal}
      pr={padding?.right ?? padding?.horizontal}
    >
      <Inline
        flex={1}
        spacing={showSidebar && !canResize ? spacing : 0}
        align="stretch"
      >
        {position === "left" ? (
          <>
            {showSidebar && side}
            {main}
          </>
        ) : (
          <>
            {main}
            {showSidebar && side}
          </>
        )}
      </Inline>
    </Box>
  );
};

export default SidebarLayout;
