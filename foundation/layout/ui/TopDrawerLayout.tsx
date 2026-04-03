/**
 * TopDrawerLayout
 *
 * Animated top drawer with pan gesture and haptic feedback.
 * Supports imperative control via ref (open/close/toggle).
 */

import * as Haptics from "expo-haptics";
import React, { useCallback, useImperativeHandle, useState } from "react";
import { Platform, Pressable, StyleSheet, Text } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken } from "../../tokens";
import { applyDefaults, getLayoutMeta, getConstants } from "../registry";
import Box from "./primitives/Box";
import Scroll from "./primitives/Scroll";

const AnimatedBox = Animated.createAnimatedComponent(Box);

const META = getLayoutMeta("TopDrawerLayout")!;
const { springConfig: SPRING_CONFIG } = getConstants(META);

export interface TopDrawerHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
}

export interface TopDrawerLayoutProps {
  content: React.ReactNode;
  drawerContent: React.ReactNode;
  drawerHeight?: number;
  maxWidth?: number;
  scrollable?: boolean;
  drawerBackground?: string;
  drawerBorderRadius?: RadiusToken;
  background?: string;
  borderRadius?: RadiusToken;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

const TopDrawerLayout = React.forwardRef<TopDrawerHandle, TopDrawerLayoutProps>(
  (rawProps, ref) => {
    const { theme } = useTheme();
    const {
      content, drawerContent, drawerHeight, maxWidth, scrollable,
      drawerBackground, drawerBorderRadius, background, borderRadius,
      defaultOpen, onToggle,
    } = applyDefaults(rawProps, META, theme) as Required<TopDrawerLayoutProps>;

    const [isOpen, setIsOpen] = useState(defaultOpen);

    const translateY = useSharedValue(defaultOpen ? 0 : -drawerHeight);
    const context = useSharedValue({ y: 0 });

    const triggerHaptic = () => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
    };

    const handleToggle = useCallback(
      (open: boolean) => {
        translateY.value = withSpring(
          open ? 0 : -drawerHeight,
          SPRING_CONFIG,
          (finished) => {
            if (finished) runOnJS(triggerHaptic)();
          }
        );
        setIsOpen(open);
        if (onToggle) onToggle(open);
      },
      [drawerHeight, onToggle]
    );

    useImperativeHandle(
      ref,
      () => ({
        open: () => handleToggle(true),
        close: () => handleToggle(false),
        toggle: () => handleToggle(!isOpen),
        isOpen: () => isOpen,
      }),
      [handleToggle, isOpen]
    );

    const panGesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        translateY.value = Math.min(
          40,
          Math.max(-drawerHeight, context.value.y + event.translationY)
        );
      })
      .onEnd((event) => {
        const isQuickSwipeDown = event.velocityY > 500;
        const isQuickSwipeUp = event.velocityY < -500;
        const isPastThreshold = translateY.value > -drawerHeight / 2;

        if (isQuickSwipeUp || (!isQuickSwipeDown && !isPastThreshold)) {
          runOnJS(handleToggle)(false);
        } else {
          runOnJS(handleToggle)(true);
        }
      });

    const contentAnimatedStyle = useAnimatedStyle(() => ({
      transform: [
        {
          scale: interpolate(
            translateY.value,
            [-drawerHeight, 0],
            [1, 0.95],
            Extrapolation.CLAMP
          ),
        },
        {
          translateY: interpolate(
            translateY.value,
            [-drawerHeight, 0],
            [0, 10],
            Extrapolation.CLAMP
          ),
        },
      ],
      opacity: interpolate(
        translateY.value,
        [-drawerHeight, 0],
        [1, 0.8],
        Extrapolation.CLAMP
      ),
      borderRadius: interpolate(
        translateY.value,
        [-drawerHeight, 0],
        [0, 32],
        Extrapolation.CLAMP
      ),
    }));

    const backdropStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
        translateY.value,
        [-drawerHeight, 0],
        [0, 0.4],
        Extrapolation.CLAMP
      ),
      pointerEvents:
        translateY.value <= -drawerHeight ? ("none" as any) : ("auto" as any),
    }));

    const drawerAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    return (
      <GestureHandlerRootView style={styles.flex}>
        <Box
          flex={1}
          bg={background}
          borderRadius={borderRadius}
          style={styles.container}
        >
          <AnimatedBox
            flex={1}
            maxWidth={maxWidth}
            alignSelf="center"
            width="100%"
            style={[contentAnimatedStyle, styles.overflow]}
          >
            {content}
          </AnimatedBox>

          <AnimatedBox
            position="absolute"
            top={0}
            right={0}
            bottom={0}
            left={0}
            bg="black"
            zIndex={98}
            style={backdropStyle}
          >
            <Pressable style={styles.flex} onPress={() => handleToggle(false)} />
          </AnimatedBox>

          <AnimatedBox
            position="absolute"
            top={0}
            left={0}
            right={0}
            zIndex={101}
            height={drawerHeight}
            bg={drawerBackground}
            borderBottomLeftRadius={drawerBorderRadius}
            borderBottomRightRadius={drawerBorderRadius}
            style={[drawerAnimatedStyle, styles.shadow]}
          >
            <Pressable
              onPress={() => handleToggle(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                backgroundColor: `${theme.muted}20`,
                borderColor: `${theme.border}30`,
                zIndex: 102,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '600',
                  lineHeight: 20,
                  color: theme.mutedForeground,
                }}
              >
                ×
              </Text>
            </Pressable>

            <Box flex={1} style={{ paddingTop: 12 }}>
              {scrollable ? (
                <Scroll
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                >
                  {drawerContent}
                </Scroll>
              ) : (
                <Box flex={1}>{drawerContent}</Box>
              )}
            </Box>

            <GestureDetector gesture={panGesture}>
              <Box
                width="100%"
                height={40}
                alignItems="center"
                justifyContent="center"
                style={styles.grabber as any}
              >
                <Box
                  width={40}
                  height={5}
                  bg={theme.border}
                  borderRadius="full"
                  opacity={0.5}
                />
              </Box>
            </GestureDetector>
          </AnimatedBox>
        </Box>
      </GestureHandlerRootView>
    );
  }
);

TopDrawerLayout.displayName = "TopDrawerLayout";

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
  overflow: { overflow: "hidden" },
  flex: { flex: 1 },
  grabber: {
    ...Platform.select({
      web: { cursor: "grab" as any } as const,
      default: {},
    }),
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: { elevation: 16 },
    }),
  },
  scrollContent: { paddingTop: 16, paddingBottom: 16 },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    zIndex: 102,
  },
  xIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  xText: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 20,
  },
});

export default TopDrawerLayout;
