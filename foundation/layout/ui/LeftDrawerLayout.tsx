/**
 * LeftDrawerLayout
 *
 * Animated left-side drawer with swipe-to-close gesture and haptic feedback.
 * Content shifts when the drawer opens, with a backdrop overlay.
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
import { RadiusToken } from "../../tokens";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { applyDefaults, getLayoutMeta, getConstants } from "../registry";
import Box from "./primitives/Box";
import Scroll from "./primitives/Scroll";

const AnimatedBox = Animated.createAnimatedComponent(Box);

const META = getLayoutMeta("LeftDrawerLayout")!;
const { springConfig: SPRING_CONFIG } = getConstants(META);

export interface LeftDrawerLayoutProps {
  content: React.ReactNode;
  drawerContent: React.ReactNode;
  drawerWidth?: number;
  maxWidth?: number;
  scrollable?: boolean;
  drawerBackground?: string;
  drawerBorderRadius?: RadiusToken;
  background?: string;
  borderRadius?: RadiusToken;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

const LeftDrawerLayout: React.FC<LeftDrawerLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    content, drawerContent, drawerWidth, maxWidth, scrollable,
    drawerBackground, drawerBorderRadius, background, borderRadius,
    defaultOpen, onToggle,
  } = applyDefaults(rawProps, META, theme) as Required<LeftDrawerLayoutProps>;
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const translateX = useSharedValue(defaultOpen ? 0 : -drawerWidth);
  const context = useSharedValue({ x: 0 });

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };

  const handleToggle = useCallback((open: boolean) => {
    translateX.value = withSpring(open ? 0 : -drawerWidth, SPRING_CONFIG, (finished) => {
      if (finished) runOnJS(triggerHaptic)();
    });
    setIsOpen(open);
    if (onToggle) onToggle(open);
  }, [drawerWidth, onToggle]);

  const closePanGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value };
    })
    .onUpdate((event) => {
      translateX.value = Math.max(-drawerWidth, Math.min(0, context.value.x + event.translationX));
    })
    .onEnd((event) => {
      if (event.velocityX < -500 || translateX.value < -drawerWidth / 2) {
        runOnJS(handleToggle)(false);
      } else {
        runOnJS(handleToggle)(true);
      }
    });

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(translateX.value, [-drawerWidth, 0], [0, 8], Extrapolation.CLAMP) },
      { scale: interpolate(translateX.value, [-drawerWidth, 0], [1, 0.98], Extrapolation.CLAMP) }
    ],
    opacity: interpolate(translateX.value, [-drawerWidth, 0], [1, 0.9], Extrapolation.CLAMP),
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-drawerWidth, 0], [0, 0.4], Extrapolation.CLAMP),
    pointerEvents: translateX.value <= -drawerWidth ? 'none' : 'auto' as any,
  }));

  const handleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-drawerWidth, -drawerWidth + 20], [1, 0], Extrapolation.CLAMP),
    transform: [{ translateX: interpolate(translateX.value, [-drawerWidth, -drawerWidth + 30], [0, -20], Extrapolation.CLAMP) }],
  }));

  return (
    <GestureHandlerRootView style={styles.flex}>
      <Box flex={1} bg={background} borderRadius={borderRadius} style={styles.container}>
        
        <AnimatedBox flex={1} maxWidth={maxWidth} alignSelf="center" width="100%" style={contentAnimatedStyle}>
          {scrollable ? <Scroll>{content}</Scroll> : <Box flex={1}>{content}</Box>}
        </AnimatedBox>

        <AnimatedBox position="absolute" top={0} right={0} bottom={0} left={0} bg="black" zIndex={98} style={backdropStyle}>
          <Pressable style={styles.flex} onPress={() => handleToggle(false)} />
        </AnimatedBox>

        {!isOpen && (
          <Box position="absolute" left={0} top={0} bottom={0} zIndex={100} width={50} justifyContent="center">
            <AnimatedBox style={handleStyle}>
              <Pressable 
                onPress={() => handleToggle(true)}
                style={({ pressed }) => [
                  styles.handleButton, 
                  { 
                    backgroundColor: theme.primary, 
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.95 : 1 }] 
                  }
                ]}
              >
                <Fingerprint size={20} color="white" strokeWidth={2.5} />
              </Pressable>
            </AnimatedBox>
          </Box>
        )}

        <AnimatedBox
          position="absolute" top={0} left={0} bottom={0} zIndex={101}
          width={drawerWidth}
          bg={drawerBackground}
          borderTopRightRadius={drawerBorderRadius}
          borderBottomRightRadius={drawerBorderRadius}
          style={[useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] })), styles.shadow]}
        >
          <Box flex={1}>
            {scrollable ? <Scroll showsVerticalScrollIndicator={false}>{drawerContent}</Scroll> : <Box flex={1}>{drawerContent}</Box>}
          </Box>

          <GestureDetector gesture={closePanGesture}>
            <Box position="absolute" right={0} top={0} bottom={0} width={40} alignItems="center" justifyContent="center" zIndex={102}>
               <Box width={4} height={40} bg={theme.border} borderRadius="full" opacity={0.2} />
            </Box>
          </GestureDetector>
        </AnimatedBox>
      </Box>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
  flex: { flex: 1 },
  handleButton: {
    width: 36,
    height: 50,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  shadow: {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 16 },
    }),
  },
});

export default LeftDrawerLayout;
