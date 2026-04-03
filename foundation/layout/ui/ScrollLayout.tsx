/**
 * ScrollLayout
 *
 * Scrollable structure with optional sticky or inline header/footer.
 * Handles safe area insets and scroll direction configuration.
 */

import React, { useMemo } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken, SpacingToken } from "../../tokens";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { useSafeArea } from "../hooks/useSafeArea";
import { applyDefaults, getLayoutMeta } from "../registry";
import Box from "./primitives/Box";
import Scroll from "./primitives/Scroll";

const META = getLayoutMeta("ScrollLayout")!;

export interface ScrollLayoutProps {
  header?: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
  spacing?: SpacingToken;
  useSafeAreaInsets?: boolean;
  headerHeight?: number;
  footerHeight?: number;
  scrollDirection?: "vertical" | "horizontal" | "both";
  showScrollIndicator?: boolean;
  enableBounces?: boolean;
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  background?: string;
  borderRadius?: RadiusToken;
  headerBackground?: string;
  footerBackground?: string;
  contentBackground?: string;
}

const ScrollLayout: React.FC<ScrollLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    header, content, footer, spacing, useSafeAreaInsets, headerHeight,
    footerHeight, scrollDirection, showScrollIndicator, enableBounces,
    stickyHeader, stickyFooter, background, borderRadius,
    headerBackground, footerBackground, contentBackground,
  } = applyDefaults(rawProps, META, theme) as Required<ScrollLayoutProps>;

  const { isMobile } = useBreakpoint();
  const safeArea = useSafeArea();

  const finalBg = background;

  const dims = useMemo(
    () => ({
      h: isMobile ? 60 : headerHeight,
      f: isMobile ? 50 : footerHeight,
    }),
    [isMobile, headerHeight, footerHeight]
  );

  const scrollProps = useMemo(
    () => ({
      horizontal:
        scrollDirection === "horizontal" || scrollDirection === "both",
      showsHorizontalScrollIndicator:
        showScrollIndicator && scrollDirection !== "vertical",
      showsVerticalScrollIndicator:
        showScrollIndicator && scrollDirection !== "horizontal",
    }),
    [scrollDirection, showScrollIndicator]
  );

  const renderHeader = (isSticky: boolean) => (
    <Box
      height={
        dims.h +
        (isSticky && isMobile && useSafeAreaInsets ? safeArea.top : 0)
      }
      bg={headerBackground}
      borderRadius={borderRadius}
      p={4}
      pt={isSticky && isMobile && useSafeAreaInsets ? undefined : undefined}
      mb={isSticky ? 0 : spacing}
    >
      {header}
    </Box>
  );

  const renderFooter = (isSticky: boolean) => (
    <Box
      height={
        dims.f +
        (isSticky && isMobile && useSafeAreaInsets ? safeArea.bottom : 0)
      }
      bg={footerBackground}
      borderRadius={borderRadius}
      p={4}
      mt={isSticky ? 0 : spacing}
    >
      {footer}
    </Box>
  );

  return (
    <Box
      flex={1}
      bg={finalBg}
      pl={useSafeAreaInsets ? safeArea.left as SpacingToken : undefined}
      pr={useSafeAreaInsets ? safeArea.right as SpacingToken : undefined}
    >
      {header && stickyHeader && renderHeader(true)}
      {header && stickyHeader && <Box height={spacing} />}

      <Box
        flex={1}
        bg={contentBackground || "transparent"}
        borderRadius={borderRadius}
        overflow="hidden"
      >
        <Scroll
          {...scrollProps}
          pt={
            useSafeAreaInsets && !stickyHeader && isMobile
              ? (safeArea.top as SpacingToken)
              : undefined
          }
          pb={
            useSafeAreaInsets && !stickyFooter && isMobile
              ? (safeArea.bottom as SpacingToken)
              : undefined
          }
        >
          {header && !stickyHeader && renderHeader(false)}
          <Box flex={1}>{content}</Box>
          {footer && !stickyFooter && renderFooter(false)}
        </Scroll>
      </Box>

      {footer && stickyFooter && <Box height={spacing} />}
      {footer && stickyFooter && renderFooter(true)}
    </Box>
  );
};

export default ScrollLayout;
