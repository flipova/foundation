/**
 * ResponsiveLayout
 *
 * Adaptive layout with header, sidebar, content, and footer.
 * Three modes: basic, sidebar, full — adapts to the current breakpoint.
 */

import React, { useMemo } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken, SpacingToken } from "../../tokens";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { LayoutPadding } from "../types";
import { applyDefaults, getLayoutMeta } from "../registry";
import Box from "./primitives/Box";
import Scroll from "./primitives/Scroll";

const META = getLayoutMeta("ResponsiveLayout")!;

export interface ResponsiveLayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
  spacing?: SpacingToken;
  headerHeight?: number;
  sidebarWidth?: number;
  footerHeight?: number;
  adaptiveMode?: 'basic' | 'sidebar' | 'full';
  hideHeader?: boolean;
  hideFooter?: boolean;
  collapseFooterOnTablet?: boolean;
  background?: string;
  borderRadius?: RadiusToken;
  headerBackground?: string;
  sidebarBackground?: string;
  footerBackground?: string;
  contentBackground?: string;
  padding?: LayoutPadding;
  contentPadding?: LayoutPadding;
  mobileHeaderHeight?: number;
  tabletFooterHeight?: number;
  sidebarMaxWidth?: number;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    header, sidebar, content, footer, spacing, headerHeight, sidebarWidth,
    footerHeight, adaptiveMode, hideHeader, hideFooter, collapseFooterOnTablet,
    background, borderRadius, headerBackground, sidebarBackground,
    footerBackground, contentBackground, padding, contentPadding,
    mobileHeaderHeight, tabletFooterHeight, sidebarMaxWidth,
  } = applyDefaults(rawProps, META, theme) as Required<ResponsiveLayoutProps>;

  const { breakpoint, isMobile } = useBreakpoint();
  const isTabletRange = breakpoint === 'md' || breakpoint === 'lg';

  const config = useMemo(() => ({
    hHeight: isMobile ? mobileHeaderHeight : headerHeight,
    fHeight: isTabletRange && collapseFooterOnTablet ? tabletFooterHeight : footerHeight,
    sWidth: Math.min(sidebarWidth, sidebarMaxWidth),
    showHeader: !!header && !hideHeader,
    showSidebar: !!sidebar && !isMobile && (adaptiveMode === 'sidebar' || adaptiveMode === 'full'),
    showFooter: !!footer && !hideFooter,
  }), [isMobile, isTabletRange, header, footer, sidebar, hideHeader, hideFooter, adaptiveMode, headerHeight, footerHeight, sidebarWidth, collapseFooterOnTablet, mobileHeaderHeight, tabletFooterHeight, sidebarMaxWidth]);

  return (
    <Box 
      flex={1} 
      bg={background} 
      pt={padding?.top}
      pb={padding?.bottom}
      pl={padding?.left}
      pr={padding?.right}
    >
      {config.showHeader && (
        <Box 
          height={config.hHeight} 
          bg={headerBackground} 
          borderRadius={borderRadius}
          overflow="hidden"
          justifyContent="center"
        >
          {header}
        </Box>
      )}

      {config.showHeader && spacing > 0 && <Box height={spacing} />}

      <Box flex={1} flexDirection="row">
        {config.showSidebar && (
          <Box 
            width={config.sWidth} 
            bg={sidebarBackground} 
            borderRadius={borderRadius}
            overflow="hidden"
            mr={spacing}
          >
            <Scroll>{sidebar}</Scroll>
          </Box>
        )}

        <Box flex={1} bg={contentBackground} borderRadius={borderRadius} overflow="hidden">
          <Scroll 
            pt={contentPadding?.top}
            pb={contentPadding?.bottom}
            pl={contentPadding?.left}
            pr={contentPadding?.right}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {content}
          </Scroll>
        </Box>
      </Box>

      {config.showFooter && (
        <>
          {spacing > 0 && <Box height={spacing} />}
          <Box 
            height={config.fHeight} 
            bg={footerBackground} 
            borderRadius={borderRadius}
            overflow="hidden"
            justifyContent="center"
          >
            {footer}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ResponsiveLayout;
