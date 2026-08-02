import React, { useEffect } from 'react';
import { Placeholder } from '../../Placeholder';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, interpolate } from 'react-native-reanimated';
import { useFlipLayoutLogic, FlipLayoutProps } from './FlipLayout.logic';
import { useFlipLayoutStyle } from './FlipLayout.style';

/**
 * An animated interactive layout component that visually flips between a front 
 * and back side, similar to a physical card.
 * 
 * Use cases:
 * - Flashcards for educational apps.
 * - Revealing additional details (e.g., product specs on the back of a product card).
 * 
 * Accessibility considerations:
 * - The component is wrapped in a `Pressable` which provides interactive behaviors. 
 * - Ensure `accessibilityRole="button"` and `accessibilityHint` are passed if it behaves as a toggle.
 */
const FlipLayout: React.FC<FlipLayoutProps> = (rawProps) => {
  const logic = useFlipLayoutLogic(rawProps);
  const styles = useFlipLayoutStyle(logic);

  const flipValue = useSharedValue(0);

  useEffect(() => {
    flipValue.value = withSpring(logic.isFlipped ? 180 : 0, { damping: 15, stiffness: 100 });
  }, [logic.isFlipped, flipValue]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${flipValue.value}deg` }],
      opacity: interpolate(flipValue.value, [89, 90], [1, 0]),
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${flipValue.value + 180}deg` }],
      opacity: interpolate(flipValue.value, [89, 90], [0, 1]),
    };
  });

  return (
    <Pressable style={[styles.container as ViewStyle, logic.rest.style]} onPress={() => logic.setIsFlipped(!logic.isFlipped)} {...logic.rest}>
      <Animated.View style={[styles.card as ViewStyle, frontAnimatedStyle, StyleSheet.absoluteFill, { backfaceVisibility: 'hidden' }]}>
        {logic.front || <Placeholder label="front" />}
      </Animated.View>
      <Animated.View style={[styles.card as ViewStyle, backAnimatedStyle, StyleSheet.absoluteFill, { backfaceVisibility: 'hidden' }]}>
        {logic.back || <Placeholder label="back" />}
      </Animated.View>
    </Pressable>
  );
};

export default FlipLayout;
