/**
 * SwiperLayout
 *
 * Multi-directional swipeable carousel with adjacent card preloading.
 * Supports left/right/up/down swipe gestures for smooth transitions.
 */

import React, { useMemo, useState } from 'react';
import { Text, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken, SpacingToken } from "../../tokens";
import { LayoutPadding } from "../types";
import { applyDefaults, getLayoutMeta, getConstants } from "../registry";
import { useStudioItems } from "../hooks/useStudioItems";
import Box from './primitives/Box';

const META = getLayoutMeta("SwiperLayout")!;
const C = getConstants(META);
const SWIPE_THRESHOLD_DEFAULT = C.swipeThreshold!;
const SCALE_FACTOR = C.scaleFactor!;

export interface SwiperLayoutProps {
  items?: React.ReactNode[];
  slides?: React.ReactNode[];        // alias for items
  children?: React.ReactNode | React.ReactNode[]; // backward compat
  onSwipeLeft?: (index: number) => void;
  onSwipeRight?: (index: number) => void;
  onSwipeUp?: (index: number) => void;
  onSwipeDown?: (index: number) => void;
  cardStyle?: ViewStyle;
  springDamping?: number;
  springStiffness?: number;
  enableSwipeUp?: boolean;
  enableSwipeDown?: boolean;
  maxWidth?: number;
  background?: string;
  borderRadius?: RadiusToken;
  cardBackground?: string;
  cardBorderRadius?: RadiusToken;
  showCardCount?: boolean;
  preloadRange?: number;
  swipeThreshold?: number;
  padding?: LayoutPadding;
  cardCountBackground?: string;
  cardCountTextColor?: string;
}

const SwiperLayout: React.FC<SwiperLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    items: itemsProp, slides: slidesProp, children: childrenProp,
    onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown,
    cardStyle, springDamping, springStiffness, enableSwipeUp, enableSwipeDown, maxWidth,
    background, borderRadius, cardBackground, cardBorderRadius,
    showCardCount, preloadRange, swipeThreshold, padding,
    cardCountBackground, cardCountTextColor,
  } = applyDefaults(rawProps, META, theme) as Required<SwiperLayoutProps>;

  const springConfig = { damping: springDamping, stiffness: springStiffness };

  // Standard: items > slides > children (backward compat)
  const rawItems = Array.isArray(itemsProp) && itemsProp.length > 0
    ? itemsProp
    : Array.isArray(slidesProp) && slidesProp.length > 0
    ? slidesProp
    : Array.isArray(childrenProp) ? childrenProp : React.Children.toArray(childrenProp as React.ReactNode);

  const resolvedChildren = useStudioItems(
    rawItems,
    3,
    (i) => <Box key={i} flex={1} bg={cardBackground} borderRadius={cardBorderRadius} opacity={0.4} />
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const finalBg = background;
  const finalCardBg = cardBackground;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isAnimating = useSharedValue(false);
  const isHorizontalGesture = useSharedValue<boolean | null>(null);

  const preloadedCards = useMemo(() => {
    const start = Math.max(0, currentIndex - preloadRange);
    const end = Math.min(resolvedChildren.length - 1, currentIndex + preloadRange);
    const cards = new Map<number, React.ReactNode>();
    for (let i = start; i <= end; i++) { cards.set(i, resolvedChildren[i]); }
    return cards;
  }, [currentIndex, resolvedChildren, preloadRange]);

  const handleSwipeComplete = (direction: 'left' | 'right' | 'up' | 'down') => {
    const isForward = direction === 'left' || direction === 'up';
    const newIndex = isForward ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < resolvedChildren.length) {
      setCurrentIndex(newIndex);
      if (direction === 'left') onSwipeLeft?.(currentIndex);
      if (direction === 'right') onSwipeRight?.(currentIndex);
      if (direction === 'up') onSwipeUp?.(currentIndex);
      if (direction === 'down') onSwipeDown?.(currentIndex);
    }
  };

  const performSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    'worklet';
    if (isAnimating.value) return;
    isAnimating.value = true;

    const isHorizontal = direction === 'left' || direction === 'right';
    const targetValue = (direction === 'left' || direction === 'up') ? -600 : 600;

    scale.value = withSpring(SCALE_FACTOR, { damping: 12, stiffness: 160, mass: 0.8 });
    const config = { duration: 250 };

    const onComplete = (finished?: boolean) => {
      if (finished) {
        runOnJS(handleSwipeComplete)(direction);
        if (isHorizontal) translateX.value = 0;
        else translateY.value = 0;

        scale.value = withSpring(1, springConfig, () => {
          isAnimating.value = false;
        });
      }
    };

    if (isHorizontal) translateX.value = withTiming(targetValue, config, onComplete);
    else translateY.value = withTiming(targetValue, config, onComplete);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
      isHorizontalGesture.value = null;
    })
    .onUpdate((event) => {
      if (isHorizontalGesture.value === null) {
        const t = 10;
        if (Math.abs(event.translationX) > t || Math.abs(event.translationY) > t) {
          isHorizontalGesture.value = Math.abs(event.translationX) > Math.abs(event.translationY);
        }
      }

      if (isHorizontalGesture.value) {
        translateX.value = startX.value + event.translationX;
      } else {
        translateY.value = startY.value + event.translationY;
      }

      const trans = isHorizontalGesture.value ? event.translationX : event.translationY;
      const progress = Math.min(Math.abs(trans) / 200, 1);
      scale.value = interpolate(progress, [0, 1], [1, SCALE_FACTOR]);
    })
    .onEnd((event) => {
      const trans = isHorizontalGesture.value ? event.translationX : event.translationY;
      
      if (Math.abs(trans) > swipeThreshold && !isAnimating.value) {
        const direction = isHorizontalGesture.value 
          ? (trans < 0 ? 'left' : 'right') 
          : (trans < 0 ? 'up' : 'down');

        const canSwipe = isHorizontalGesture.value 
          ? (direction === 'left' ? currentIndex < resolvedChildren.length - 1 : currentIndex > 0)
          : (direction === 'up' ? enableSwipeUp && currentIndex < resolvedChildren.length - 1 : enableSwipeDown && currentIndex > 0);

        if (canSwipe) {
          performSwipe(direction);
          return;
        }
      }

      translateX.value = withSpring(0, { damping: 18, stiffness: 140 });
      translateY.value = withSpring(0, { damping: 18, stiffness: 140 });
      scale.value = withSpring(1, springConfig);
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    flex: 1,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Box
      flex={1}
      bg={finalBg}
      borderRadius={borderRadius}
      style={{
        width: '100%',
        maxWidth: maxWidth ?? '100%',
        alignSelf: 'center',
        overflow: 'hidden',
      }}
      pt={padding?.top ?? padding?.vertical}
      pb={padding?.bottom ?? padding?.vertical}
      pl={padding?.left ?? padding?.horizontal}
      pr={padding?.right ?? padding?.horizontal}
    >
      {showCardCount && (
        <Box 
          position="absolute" top={20} right={20} zIndex={10}
          bg={cardCountBackground} px={12} py={6} borderRadius="full"
        >
          <Text style={{ color: cardCountTextColor, fontSize: 12, fontWeight: '700' }}>
            {currentIndex + 1} / {resolvedChildren.length}
          </Text>
        </Box>
      )}
      
      {Array.from(preloadedCards.keys()).map(index => {
        if (index === currentIndex) return null;
        return (
          <Box 
            key={`preload-${index}`} 
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0 }}
            pointerEvents="none"
          >
            {preloadedCards.get(index)}
          </Box>
        );
      })}
      
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[animatedCardStyle, cardStyle]}>
          <Box 
            flex={1} 
            bg={finalCardBg} 
            borderRadius={cardBorderRadius} 
            style={{ overflow: 'hidden' }}
          >
            {preloadedCards.get(currentIndex) || resolvedChildren[currentIndex]}
          </Box>
        </Animated.View>
      </GestureDetector>
    </Box>
  );
};

export default SwiperLayout;
