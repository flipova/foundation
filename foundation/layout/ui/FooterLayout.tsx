/**
 * FooterLayout
 *
 * Main content area with a fixed or scrollable footer.
 * Supports compact mode and sticky footer positioning.
 */

import React, { useMemo } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken, SpacingToken } from "../../tokens";
import { applyDefaults, getLayoutMeta } from "../registry";
import Box from "./primitives/Box";
import Center from "./primitives/Center";
import Scroll from "./primitives/Scroll";

const META = getLayoutMeta("FooterLayout")!;

export interface FooterLayoutProps {
  content: React.ReactNode;
  footer: React.ReactNode;
  footerHeight?: number;
  spacing?: SpacingToken;
  sticky?: boolean;
  maxWidth?: number;
  scrollable?: boolean;
  footerBackground?: string;
  footerBorderRadius?: RadiusToken;
  contentBorderRadius?: RadiusToken;
  background?: string;
  borderRadius?: RadiusToken;
  padding?: SpacingToken;
  footerPadding?: SpacingToken;
  compact?: boolean;
}

const FooterLayout: React.FC<FooterLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    content, footer, footerHeight, spacing, sticky, maxWidth, scrollable,
    footerBackground, footerBorderRadius, contentBorderRadius,
    background, borderRadius, padding, footerPadding, compact,
  } = applyDefaults(rawProps, META, theme) as Required<FooterLayoutProps>;

  const config = useMemo(() => ({
    height: compact ? footerHeight * 0.8 : footerHeight,
    contentP: compact ? 3 as SpacingToken : padding,
    footerP: compact ? 3 as SpacingToken : footerPadding,
  }), [compact, footerHeight, padding, footerPadding]);

  const FooterSection = (
    <Box bg={footerBackground} borderRadius={footerBorderRadius} p={config.footerP} height={config.height} overflow="hidden">
      <Center flex={1}>{footer}</Center>
    </Box>
  );

  const ContentSection = (
    <Box flex={1} bg={background} borderRadius={contentBorderRadius} p={config.contentP} width="100%" maxWidth={maxWidth} alignSelf="center" overflow="hidden">
      {content}
    </Box>
  );

  const MainContent = (
    <Box flex={1} gap={spacing}>
      {ContentSection}
      {!sticky && FooterSection}
    </Box>
  );

  return (
    <Box flex={1} bg={background} borderRadius={borderRadius} overflow="hidden">
      <Box flex={1} gap={sticky ? spacing : 0}>
        {scrollable ? (
          <Scroll contentContainerStyle={{ flexGrow: 1 }}>{MainContent}</Scroll>
        ) : (
          MainContent
        )}
        {sticky && FooterSection}
      </Box>
    </Box>
  );
};

export default FooterLayout;
