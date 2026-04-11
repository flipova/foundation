/**
 * DashboardLayout
 *
 * Classic dashboard structure with a fixed header, optional collapsible sidebar, content area, and optional footer.
 * On mobile, the sidebar stacks below the content or is hidden.
 */

import React, { useCallback, useState } from "react";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken } from "../../tokens/radii";
import { SpacingToken } from "../../tokens/spacing";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { applyDefaults, getLayoutMeta } from "../registry";
import Box from "./primitives/Box";
import Scroll from "./primitives/Scroll";
import Stack from "./primitives/Stack";

export interface DashboardLayoutProps {
  header: React.ReactNode;
  content: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  sidebarWidth?: number;
  sidebarCollapsedWidth?: number;
  headerHeight?: number;
  footerHeight?: number;
  spacing?: SpacingToken;
  borderRadius?: RadiusToken;
  background?: string;
  disableContentScroll?: boolean;
  headerBackground?: string;
  sidebarBackground?: string;
  contentBackground?: string;
  footerBackground?: string;
  headerPaddingX?: SpacingToken;
  mobileHeaderMinHeight?: number;
}

const META = getLayoutMeta("DashboardLayout")!;

const AnimatedBox = Animated.createAnimatedComponent(Box);

const HamburgerIcon: React.FC<{ color: string }> = ({ color }) => (
  <Stack spacing={1} p={4} align="center">
    {[0, 1, 2].map((i) => (
      <Box key={i} width={20} height={2} bg={color} opacity={0.5} />
    ))}
  </Stack>
);

const DashboardLayout: React.FC<DashboardLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    header, sidebar, content, footer,
    sidebarWidth, sidebarCollapsedWidth, headerHeight, footerHeight,
    spacing, borderRadius, background, disableContentScroll,
    headerBackground, sidebarBackground, contentBackground, footerBackground,
    headerPaddingX, mobileHeaderMinHeight,
  } = applyDefaults(rawProps, META, theme) as Required<DashboardLayoutProps>;

  const { isMobile } = useBreakpoint();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarAnimWidth = useSharedValue(sidebarWidth);

  const toggleSidebar = useCallback(() => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    sidebarAnimWidth.value = withSpring(
      next ? sidebarCollapsedWidth : sidebarWidth,
      { damping: 20, stiffness: 90 }
    );
  }, [isCollapsed, sidebarWidth, sidebarCollapsedWidth, sidebarAnimWidth]);

  const sidebarAnimStyle = useAnimatedStyle(() => ({
    width: isMobile ? "100%" : sidebarAnimWidth.value,
  }));

  const bg = background;

  return (
    <Stack fillHeight bg={bg} p={spacing} spacing={spacing}>

      <Box
        height={isMobile ? undefined : headerHeight}
        minHeight={isMobile ? mobileHeaderMinHeight : undefined}
        bg={headerBackground}
        borderRadius={borderRadius}
        justifyContent="center"
        px={headerPaddingX}
      >
        {header}
      </Box>

      <Box
        flex={1}
        flexDirection={isMobile ? "column" : "row"}
        gap={spacing}
      >
        {sidebar && (
          <AnimatedBox
            style={[sidebarAnimStyle, { overflow: "hidden" }]}
            bg={sidebarBackground}
            borderRadius={borderRadius}
          >
            {!isMobile && (
              <Pressable onPress={toggleSidebar} accessibilityRole="button">
                <HamburgerIcon color={theme.foreground} />
              </Pressable>
            )}
            <Scroll showsVerticalScrollIndicator={false}>
              {sidebar}
            </Scroll>
          </AnimatedBox>
        )}

        <Box flex={1} bg={contentBackground} borderRadius={borderRadius} overflow="hidden">
          {disableContentScroll
            ? content
            : <Scroll showsVerticalScrollIndicator={false}>{content}</Scroll>
          }
        </Box>
      </Box>

      {footer && (
        <Box
          height={isMobile ? undefined : footerHeight}
          bg={footerBackground}
          borderRadius={borderRadius}
          justifyContent="center"
          px={4}
        >
          {footer}
        </Box>
      )}
    </Stack>
  );
};

export default DashboardLayout;
