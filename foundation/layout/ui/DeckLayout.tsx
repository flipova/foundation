/**
 * DeckLayout
 *
 * Swipeable card stack with depth effect.
 * Background cards are visible with offset and reduced scale.
 */

import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getLayoutMeta, getConstants } from "../registry";
import Box from './primitives/Box';

const META = getLayoutMeta("DeckLayout")!;
const C = getConstants(META);
const SWIPE_THRESHOLD = C.swipeThreshold!;
const EXIT_DISTANCE = C.exitDistance!;
const SPRING_CONFIG = C.springConfig!;

interface DeckLayoutProps {
  children: React.ReactNode;
  peekOffset?: number;
  peekScale?: number;
  cycle?: boolean;
  peekCount?: number;
  peekRotation?: number;
  direction?: string;
  cardShadow?: boolean;
}

const DeckLayout: React.FC<DeckLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const { children, peekOffset, peekScale } = applyDefaults(rawProps, META, theme) as Required<DeckLayoutProps>;
  const childrenArray = React.Children.toArray(children);
  const count = childrenArray.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const swipeProgress = useSharedValue(0);
  const isAnimating = useSharedValue(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % count);
    
    translateX.value = 0;
    translateY.value = 0;
    rotation.value = 0;
    swipeProgress.value = 0;
    
    isAnimating.value = false;
  }, [count]);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      if (isAnimating.value) return;
    })
    .onUpdate((e) => {
      if (isAnimating.value) return;

      translateX.value = e.translationX;
      translateY.value = e.translationY;
      rotation.value = interpolate(e.translationX, [-200, 0, 200], [-10, 0, 10]);
      
      swipeProgress.value = interpolate(
        Math.abs(e.translationX),
        [0, 150],
        [0, 1],
        Extrapolation.CLAMP
      );
    })
    .onEnd((e) => {
      if (isAnimating.value) return;

      const shouldSwipe = Math.abs(e.translationX) > SWIPE_THRESHOLD;

      if (shouldSwipe) {
        isAnimating.value = true;
        runOnJS(triggerHaptic)();

        const destX = e.translationX > 0 ? EXIT_DISTANCE : -EXIT_DISTANCE;
        
        translateX.value = withTiming(destX, { duration: 250 });
        rotation.value = withTiming(e.translationX > 0 ? 20 : -20, { duration: 250 });
        
        swipeProgress.value = withTiming(1, { duration: 250 }, (finished) => {
          if (finished) {
            runOnJS(goToNext)();
          }
        });
      } else {
        translateX.value = withSpring(0, SPRING_CONFIG);
        translateY.value = withSpring(0, SPRING_CONFIG);
        rotation.value = withSpring(0, SPRING_CONFIG);
        swipeProgress.value = withSpring(0, SPRING_CONFIG);
      }
    });

  const topCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
    zIndex: 10,
  }));

  const renderBackgroundCards = () => {
    return [2, 1].map((depth) => {
      const cardIndex = (currentIndex + depth) % count;
      const child = childrenArray[cardIndex];
      const childKey = React.isValidElement(child) && child.key ? child.key : `card-${cardIndex}`;

      const animatedStyle = useAnimatedStyle(() => {
        const currentDepth = depth - swipeProgress.value;
        return {
          transform: [
            { translateY: currentDepth * peekOffset },
            { scale: 1 - currentDepth * peekScale },
          ],
          opacity: interpolate(currentDepth, [0, 3], [1, 0.3], Extrapolation.CLAMP),
          zIndex: 5 - depth,
        };
      });

      return (
        <Animated.View
          key={`peek-${childKey}-${depth}`}
          style={[styles.card, animatedStyle, { backgroundColor: theme.card }]}
        >
          {child}
        </Animated.View>
      );
    });
  };

  return (
    <Box flex={1} style={styles.wrapper}>
      <Box style={styles.container}>
        {renderBackgroundCards()}

        <GestureDetector gesture={gesture}>
          <Animated.View
            key={`active-${React.isValidElement(childrenArray[currentIndex]) && childrenArray[currentIndex].key ? childrenArray[currentIndex].key : `card-${currentIndex}`}`}
            style={[styles.card, topCardStyle, { backgroundColor: theme.card }]}
          >
            {childrenArray[currentIndex]}
          </Animated.View>
        </GestureDetector>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  container: {
    width: '90%',
    height: '75%',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
});

export default React.memo(DeckLayout);
