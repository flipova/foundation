import React from 'react';
import { Placeholder } from '../../Placeholder';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import { useParallaxLayoutLogic, ParallaxLayoutProps } from './ParallaxLayout.logic';
import { useParallaxLayoutStyle } from './ParallaxLayout.style';

/**
 * ParallaxLayout provides a scrollable view with a parallax header effect.
 * The header image translates and scales based on the scroll position.
 * This layout is ideal for profile screens, detailed views, or any page where a prominent header image should react smoothly to scroll interactions.
 * 
 * Accessibility considerations:
 * - Ensure the header image has an appropriate accessible label or role if it conveys meaningful information.
 * - The inner ScrollView should naturally support scroll accessibility actions.
 */
const ParallaxLayout: React.FC<ParallaxLayoutProps> = (rawProps) => {
  const logic = useParallaxLayoutLogic(rawProps);
  const styles = useParallaxLayoutStyle(logic);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-logic.headerHeight, 0, logic.headerHeight],
            [-logic.headerHeight / 2, 0, logic.headerHeight * 0.75],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-logic.headerHeight, 0, logic.headerHeight],
            [2, 1, 1],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      <Animated.View style={[styles.header as any, StyleSheet.absoluteFill, { height: logic.headerHeight }, headerAnimatedStyle]}>
        {logic.headerImage || <Placeholder label="headerImage" />}
      </Animated.View>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: logic.headerHeight }}
        style={StyleSheet.absoluteFill}
      >
        <View style={styles.content as any}>
          {logic.children || <Placeholder label="children" />}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default ParallaxLayout;
