/**
 * BottomDrawerLayout
 *
 * Animated bottom drawer with swipe gesture and haptic feedback.
 * Main content sits above a sliding drawer panel.
 */

import * as Haptics from "expo-haptics";
import { Fingerprint } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { Platform, Pressable, StyleSheet } from "react-native";
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
import { RadiusToken } from "../../tokens/radii";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { applyDefaults, getLayoutMeta, getConstants } from "../registry";
import Box from "./primitives/Box";
import Scroll from "./primitives/Scroll";

const AnimatedBox = Animated.createAnimatedComponent(Box);

const META = getLayoutMeta("BottomDrawerLayout")!;
const { springConfig: SPRING_CONFIG } = getConstants(META);

export interface BottomDrawerLayoutProps {
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

const BottomDrawerLayout: React.FC<BottomDrawerLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    content, drawerContent, drawerHeight, maxWidth, scrollable,
    drawerBackground, drawerBorderRadius, background, borderRadius,
    defaultOpen, onToggle,
  } = applyDefaults(rawProps, META, theme) as Required<BottomDrawerLayoutProps>;

  const { isMobile } = useBreakpoint();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const translateY = useSharedValue(defaultOpen ? 0 : drawerHeight);
  const context = useSharedValue({ y: 0 });

  const triggerHaptic = () => {
    if (isMobile) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };

  const handleToggle = useCallback((open: boolean) => {
    translateY.value = withSpring(open ? 0 : drawerHeight, SPRING_CONFIG, (finished) => {
      if (finished) runOnJS(triggerHaptic)();
    });
    setIsOpen(open);
    if (onToggle) onToggle(open);
  }, [drawerHeight, onToggle]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
      if (isMobile) {
        runOnJS(triggerHaptic)();
      }
    })
    .onUpdate((event) => {
      if (isOpen) {
        translateY.value = Math.max(-20, context.value.y + event.translationY);
      } else {
        const newTranslateY = context.value.y + event.translationY;
        translateY.value = Math.max(drawerHeight - 100, Math.min(drawerHeight, newTranslateY));
      }
    })
    .onEnd((event) => {
      const isQuickSwipeUp = event.velocityY < -500;
      const isQuickSwipeDown = event.velocityY > 500;
      const isPastThreshold = translateY.value > drawerHeight / 2;
      const isOpeningSwipe = !isOpen && (isQuickSwipeUp || translateY.value < drawerHeight - 50);

      if (isOpeningSwipe && isMobile) {
        runOnJS(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        })();
      } else if ((isQuickSwipeDown || isPastThreshold) && isMobile) {
        runOnJS(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        })();
      }

      if (isQuickSwipeDown || (isPastThreshold && !isQuickSwipeUp)) {
        runOnJS(handleToggle)(false);
      } else if (isOpeningSwipe) {
        runOnJS(handleToggle)(true);
      } else {
        runOnJS(handleToggle)(isOpen);
      }
    });

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(translateY.value, [0, drawerHeight], [0.95, 1], Extrapolation.CLAMP) },
      { translateY: interpolate(translateY.value, [0, drawerHeight], [-10, 0], Extrapolation.CLAMP) }
    ],
    opacity: interpolate(translateY.value, [0, drawerHeight], [0.8, 1], Extrapolation.CLAMP),
    borderRadius: interpolate(translateY.value, [0, drawerHeight], [32, 0], Extrapolation.CLAMP),
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, drawerHeight], [0.4, 0], Extrapolation.CLAMP),
    pointerEvents: translateY.value >= drawerHeight ? 'none' : 'auto' as any,
  }));

  const handleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [drawerHeight - 40, drawerHeight], [0, 1], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(translateY.value, [drawerHeight - 20, drawerHeight], [10, 0], Extrapolation.CLAMP) }],
  }));

  return (
    <GestureHandlerRootView style={styles.flex}>
      <Box flex={1} bg={background} borderRadius={borderRadius} style={styles.container}>
        
        <AnimatedBox flex={1} maxWidth={maxWidth} alignSelf="center" width="100%" style={[contentAnimatedStyle, styles.overflow]}>
          {content}
        </AnimatedBox>

        <AnimatedBox position="absolute" top={0} right={0} bottom={0} left={0} bg="black" zIndex={98} style={backdropStyle}>
          <Pressable style={styles.flex} onPress={() => handleToggle(false)} />
        </AnimatedBox>

        {!isOpen && (
          <Box position="absolute" bottom={0} left={0} right={0} zIndex={100} alignItems="center">
            <AnimatedBox style={handleStyle}>
              <Pressable 
                onPress={() => {
                  runOnJS(triggerHaptic)();
                  handleToggle(true);
                }}
                style={({ pressed }) => [
                  styles.handleButton, 
                  { 
                    backgroundColor: theme.primary, 
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.95 : 1 }]
                  }
                ]}
              >
                <Fingerprint size={24} color="white" strokeWidth={2.5} />
              </Pressable>
            </AnimatedBox>
            <Box position="absolute" bottom={60} alignItems="center">
              <Box 
                width={40} 
                height={4} 
                bg={theme.primary} 
                borderRadius="full" 
                opacity={0.6}
                style={{
                  shadowColor: theme.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                }}
              />
            </Box>
          </Box>
        )}

        <AnimatedBox
          position="absolute" bottom={0} left={0} right={0} zIndex={101}
          height={drawerHeight}
          bg={drawerBackground}
          borderTopLeftRadius={drawerBorderRadius}
          borderTopRightRadius={drawerBorderRadius}
          style={[useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] })), styles.shadow]}
        >
          <GestureDetector gesture={panGesture}>
            <Box flex={1}>
              <Box width="100%" height={60} alignItems="center" justifyContent="center" style={styles.grabber as any}>
                <Box width={40} height={5} bg={theme.border} borderRadius="full" opacity={0.5} />
              </Box>
              
              <Box flex={1}>
                {scrollable ? (
                  <Scroll showsVerticalScrollIndicator={false}>
                    {drawerContent}
                  </Scroll>
                ) : (
                  drawerContent
                )}
              </Box>
            </Box>
          </GestureDetector>
        </AnimatedBox>
      </Box>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
  overflow: { overflow: 'hidden' },
  flex: { flex: 1 },
  handleButton: {
    width: 56,
    height: 36,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  grabber: { 
    ...Platform.select({ web: { cursor: 'grab' as any } as const, default: {} }) 
  },
  shadow: {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 16 },
    }),
  },
  scrollContent: { paddingBottom: 40 }
});

export default BottomDrawerLayout;
