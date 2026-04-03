/**
 * HeaderContentLayout
 *
 * Collapsible header that shrinks on scroll with a main content area below.
 * The header progressively reduces in height as the user scrolls.
 */

import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken, SpacingToken } from "../../tokens";
import { applyDefaults, getLayoutMeta } from "../registry";
import Box from "./primitives/Box";
import Center from "./primitives/Center";

const META = getLayoutMeta("HeaderContentLayout")!;

export interface HeaderContentLayoutProps {
  header: React.ReactNode;
  content: React.ReactNode;
  headerHeight?: number;
  headerCollapsedHeight?: number;
  spacing?: SpacingToken;
  maxWidth?: number;
  headerBackground?: string;
  headerBorderRadius?: RadiusToken;
  contentBackground?: string;
  contentBorderRadius?: RadiusToken;
  background?: string;
  borderRadius?: RadiusToken;
  padding?: SpacingToken;
  headerPadding?: SpacingToken;
}

const AnimatedBox = Animated.createAnimatedComponent(Box);

const HeaderContentLayout: React.FC<HeaderContentLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    header, content, headerHeight, headerCollapsedHeight, spacing, maxWidth,
    headerBackground, headerBorderRadius, contentBackground, contentBorderRadius,
    background, borderRadius, padding, headerPadding,
  } = applyDefaults(rawProps, META, theme) as Required<HeaderContentLayoutProps>;

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, headerHeight - headerCollapsedHeight],
      [headerHeight, headerCollapsedHeight],
      Extrapolation.CLAMP
    );

    return { height };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, (headerHeight - headerCollapsedHeight) * 0.5],
      [1, 0],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  return (
    <Box 
      flex={1} 
      bg={background} 
      borderRadius={borderRadius} 
      overflow="hidden"
    >
      <AnimatedBox
        style={[headerAnimatedStyle]}
        bg={headerBackground}
        borderRadius={headerBorderRadius}
        p={headerPadding}
        width="100%"
        zIndex={10}
      >
        <Center flex={1}>
          <Animated.View style={[{ flex: 1, width: '100%' }, contentAnimatedStyle]}>
            {header}
          </Animated.View>
        </Center>
      </AnimatedBox>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Box
          flex={1}
          bg={contentBackground}
          borderRadius={contentBorderRadius}
          p={padding}
          width="100%"
          maxWidth={maxWidth}
          alignSelf="center"
          gap={spacing}
        >
          {content}
        </Box>
      </Animated.ScrollView>
    </Box>
  );
};

export default HeaderContentLayout;
