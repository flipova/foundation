import React from 'react';
import { Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useScalePressWrapperLogic, ScalePressWrapperProps } from './ScalePressWrapper.logic';
import { useScalePressWrapperStyle } from './ScalePressWrapper.style';

/**
 * @component ScalePressWrapper
 * @description Wraps any element and adds a bouncy shrink effect when pressed.
 */
const ScalePressWrapper: React.FC<ScalePressWrapperProps> = (rawProps) => {
  const logic = useScalePressWrapperLogic(rawProps);
  const styles = useScalePressWrapperStyle(logic);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: logic.scale.value }] }));
  return (
    <Pressable onPressIn={logic.onPressIn} onPressOut={logic.onPressOut} style={logic.rest.style} {...logic.rest}>
      <Animated.View style={animatedStyle}>{logic.children}</Animated.View>
    </Pressable>
  );

};

export default ScalePressWrapper;
