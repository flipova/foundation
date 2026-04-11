/**
 * CenteredLayout
 *
 * Horizontally and vertically centered content with optional maxWidth.
 * Typically used for auth pages, forms, and onboarding screens.
 */

import React from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken } from "../../tokens/radii";
import { SpacingToken } from "../../tokens/spacing";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { applyDefaults, getLayoutMeta } from "../registry";
import Box from "./primitives/Box";
import Center from "./primitives/Center";
import Scroll from "./primitives/Scroll";

const META = getLayoutMeta("CenteredLayout")!;

export interface CenteredLayoutProps {
  children: React.ReactNode;
  maxWidth?: number;
  padding?: SpacingToken;
  background?: string;
  cardBackground?: string;
  borderRadius?: RadiusToken;
  shadowed?: boolean;
  mobilePadding?: SpacingToken;
  desktopPadding?: SpacingToken;
}

const CenteredLayout: React.FC<CenteredLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    children,
    maxWidth,
    padding,
    background,
    cardBackground,
    borderRadius,
    shadowed,
    mobilePadding,
    desktopPadding,
  } = applyDefaults(rawProps, META, theme) as Required<CenteredLayoutProps>;

  const { isMobile } = useBreakpoint();

  const pageBg = background;
  const cardBg = isMobile ? "transparent" : cardBackground;

  return (
    <Box flex={1} bg={pageBg}>
      <Scroll showsVerticalScrollIndicator={false}>
        <Center p={isMobile ? mobilePadding : desktopPadding}>
          <Box
            width="100%"
            maxWidth={isMobile ? undefined : maxWidth}
            bg={cardBg}
            p={isMobile ? 0 : padding}
            borderRadius={isMobile ? "none" : borderRadius}
            shadow={!isMobile && shadowed ? "xl" : undefined}
            overflow="hidden"
          >
            {children}
          </Box>
        </Center>
      </Scroll>
    </Box>
  );
};

export default CenteredLayout;
