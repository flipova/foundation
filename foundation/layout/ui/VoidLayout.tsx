/**
 * VoidLayout
 *
 * Minimal, unopinionated container with optional scroll, padding, maxWidth, and centering.
 * Ideal as a neutral base layout.
 */

import React, { useMemo } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken, SpacingToken } from "../../tokens";
import { applyDefaults, getLayoutMeta } from "../registry";
import { LayoutPadding } from "../types";
import { resolveLayoutPadding } from "../utils/resolveLayoutPadding";
import Box from "./primitives/Box";
import Scroll from "./primitives/Scroll";

const META = getLayoutMeta("VoidLayout")!;

export interface VoidLayoutProps {
  children: React.ReactNode;
  maxWidth?: number;
  scrollable?: boolean;
  background?: string;
  borderRadius?: RadiusToken;
  padding?: LayoutPadding;
  spacing?: SpacingToken;
  centerContent?: boolean;
  showBorder?: boolean;
}

const VoidLayout: React.FC<VoidLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    children, maxWidth, scrollable, background, borderRadius,
    padding, spacing, centerContent, showBorder,
  } = applyDefaults(rawProps, META, theme) as Required<VoidLayoutProps>;

  const borderStyle = useMemo(
    () => (showBorder ? { borderWidth: 1, borderColor: theme.border } : undefined),
    [showBorder, theme.border]
  );

  const body = (
    <Box
      flex={1}
      width="100%"
      justifyContent={centerContent ? "center" : undefined}
      alignItems={centerContent ? "center" : "stretch"}
    >
      {children}
    </Box>
  );

  return (
    <Box flex={1} bg={background} minHeight="100%" style={{ flexGrow: 1 }}>
      <Box
        flex={1}
        borderRadius={borderRadius}
        p={spacing}
        width="100%"
        maxWidth={maxWidth}
        alignSelf="center"
        overflow="hidden"
        style={borderStyle}
      >
        {scrollable ? (
          <Scroll {...resolveLayoutPadding(padding)} contentContainerStyle={{ flexGrow: 1 }}>
            {body}
          </Scroll>
        ) : (
          <Box flex={1} {...resolveLayoutPadding(padding)}>
            {body}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default VoidLayout;
