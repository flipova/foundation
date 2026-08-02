import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, withDelay } from 'react-native-reanimated';
import { TutoAnimationType } from './TutoLayout.logic';

export const TutoAnimations: React.FC<{ type: TutoAnimationType }> = ({ type }) => {
  const transX = useSharedValue(0);
  const transY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (type === 'tap') {
      opacity.value = 1;
      scale.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 200 }),
          withTiming(1, { duration: 200 }),
          withDelay(1000, withTiming(1, { duration: 0 }))
        ),
        -1,
        true
      );
    } else if (type === 'swipe-right') {
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 200 }),
          withTiming(1, { duration: 800 }),
          withTiming(0, { duration: 200 }),
          withDelay(500, withTiming(0, { duration: 0 }))
        ),
        -1
      );
      transX.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 200 }),
          withTiming(100, { duration: 800 }),
          withTiming(100, { duration: 200 }),
          withTiming(0, { duration: 0 }),
          withDelay(500, withTiming(0, { duration: 0 }))
        ),
        -1
      );
    }
    // Add logic for swipe-left, swipe-up, double-tap as needed
  }, [type]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: transX.value },
      { translateY: transY.value },
      { scale: scale.value }
    ]
  }));

  if (type === 'none') return null;

  return (
    <View style={[StyleSheet.absoluteFill, { justifyContent: "center", alignItems: "center" }]} pointerEvents="none">
      <Animated.View style={[styles.cursor, style]} />
    </View>
  );
};

const styles = StyleSheet.create({
  cursor: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  }
});
