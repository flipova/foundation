/**
 * FlexLayout
 *
 * Flexible layout with adaptive direction, wrap, and spacing.
 * Supports optional scrolling and directional padding.
 */

import React from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken, SpacingToken } from "../../tokens";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { useAdaptiveValue } from "../hooks/useAdaptiveValue";
import { applyDefaults, getLayoutMeta } from "../registry";
import { LayoutPadding } from "../types";
import { resolveLayoutPadding } from "../utils/resolveLayoutPadding";
import Box, { BoxProps } from "./primitives/Box";
import Scroll from "./primitives/Scroll";

const META = getLayoutMeta("FlexLayout")!;

export interface FlexLayoutProps extends Omit<BoxProps, "gap" | "p" | "padding"> {
  direction?: "row" | "column";
  wrap?: boolean;
  spacing?: SpacingToken;
  align?: BoxProps["alignItems"];
  justify?: BoxProps["justifyContent"];
  maxWidth?: number;
  scrollable?: boolean;
  adaptiveSpacing?: {
    mobile?: SpacingToken;
    tablet?: SpacingToken;
    desktop?: SpacingToken;
  };
  adaptiveDirection?: {
    mobile?: "row" | "column";
    tablet?: "row" | "column";
    desktop?: "row" | "column";
  };
  padding?: LayoutPadding;
  background?: string;
  borderRadius?: RadiusToken;
}

const FlexLayout: React.FC<FlexLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    direction, wrap, spacing: spacingProp, align, justify, maxWidth,
    scrollable, adaptiveSpacing, adaptiveDirection, padding,
    background, borderRadius, children,
  } = applyDefaults(rawProps, META, theme) as Required<FlexLayoutProps>;

  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  const finalSpacing = useAdaptiveValue(adaptiveSpacing, spacingProp);
  const finalDirection = useAdaptiveValue(adaptiveDirection, direction);
  const resolved = resolveLayoutPadding(padding);

  const LayoutContent = (
    <Box
      flex={scrollable ? undefined : 1}
      flexDirection={finalDirection}
      flexWrap={wrap ? "wrap" : "nowrap"}
      gap={finalSpacing}
      alignItems={align}
      justifyContent={justify}
      width="100%"
      maxWidth={maxWidth}
      alignSelf={maxWidth !== undefined ? "center" : "stretch"}
      pt={!scrollable ? resolved.pt : undefined}
      pb={!scrollable ? resolved.pb : undefined}
      pl={!scrollable ? resolved.pl : undefined}
      pr={!scrollable ? resolved.pr : undefined}
    >
      {children}
    </Box>
  );

  return (
    <Box
      flex={1}
      bg={background}
      borderRadius={borderRadius}
      overflow="hidden"
    >
      {scrollable ? (
        <Scroll
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: resolved.pt as any,
            paddingBottom: resolved.pb as any,
            paddingLeft: resolved.pl as any,
            paddingRight: resolved.pr as any,
          }}
        >
          {LayoutContent}
        </Scroll>
      ) : (
        LayoutContent
      )}
    </Box>
  );
};

export default FlexLayout;
