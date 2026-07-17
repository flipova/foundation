import React from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { useSlideUpWrapperLogic, SlideUpWrapperProps } from './SlideUpWrapper.logic';
import { useSlideUpWrapperStyle } from './SlideUpWrapper.style';

/**
 * @component SlideUpWrapper
 * @description Animates its children sliding up from below on mount.
 */
const SlideUpWrapper: React.FC<SlideUpWrapperProps> = (rawProps) => {
  const logic = useSlideUpWrapperLogic(rawProps);
  const styles = useSlideUpWrapperStyle(logic);

  const animatedStyle = useAnimatedStyle(() => ({ 
    transform: [{ translateY: logic.translateY.value }],
    opacity: logic.opacity.value 
  }));
  return <Animated.View style={[animatedStyle, logic.rest.style]} {...logic.rest}>{logic.children}</Animated.View>;

};

export default SlideUpWrapper;
