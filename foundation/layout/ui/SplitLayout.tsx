/**
 * SplitLayout
 *
 * Splits the screen into two panels (left/right or top/bottom).
 * Each panel has its own scroll area.
 */

import React, { useMemo } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken } from "../../tokens/radii";
import { SpacingToken } from "../../tokens/spacing";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { applyDefaults, getLayoutMeta } from "../registry";
import Box from "./primitives/Box";
import Scroll from "./primitives/Scroll";

const META = getLayoutMeta("SplitLayout")!;

export interface SplitLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  spacing?: SpacingToken;
  leftWidth?: number;
  ratio?: number;
  orientation?: "horizontal" | "vertical";
  hideLeftOnMobile?: boolean;
  background?: string;
  borderRadius?: RadiusToken;
  leftBackground?: string;
  rightBackground?: string;
}

const SplitLayout: React.FC<SplitLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    left, right, spacing, leftWidth, ratio, orientation,
    hideLeftOnMobile, background, borderRadius, leftBackground, rightBackground,
  } = applyDefaults(rawProps, META, theme) as Required<SplitLayoutProps>;

  const { isMobile } = useBreakpoint();
  const isVertical = orientation === "vertical";

  const leftFlex = useMemo(() => (leftWidth ? undefined : ratio), [leftWidth, ratio]);
  const rightFlex = useMemo(() => (leftWidth ? 1 : 1 - ratio), [leftWidth, ratio]);
  const flexDir = isVertical ? "column" : "row";

  const leftPanel = (
    <Box
      flex={leftFlex}
      width={leftWidth && !isVertical ? leftWidth : undefined}
      bg={leftBackground}
      borderRadius={borderRadius}
      overflow="hidden"
    >
      <Scroll>{left}</Scroll>
    </Box>
  );

  const rightPanel = (
    <Box flex={rightFlex} bg={rightBackground} borderRadius={borderRadius} overflow="hidden">
      <Scroll>{right}</Scroll>
    </Box>
  );

  return (
    <Box flex={1} bg={background}>
      {isMobile && hideLeftOnMobile ? (
        <Box flex={1} bg={rightBackground} borderRadius={borderRadius} overflow="hidden">
          <Scroll>{right}</Scroll>
        </Box>
      ) : (
        <Box flex={1} flexDirection={flexDir} gap={spacing}>
          {leftPanel}
          {rightPanel}
        </Box>
      )}
    </Box>
  );
};

export default SplitLayout;
