import React from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { useFadeInWrapperLogic, FadeInWrapperProps } from './FadeInWrapper.logic';
import { useFadeInWrapperStyle } from './FadeInWrapper.style';

/**
 * @component FadeInWrapper
 * @description Animates its children in with a smooth opacity fade on mount.
 */
const FadeInWrapper: React.FC<FadeInWrapperProps> = (rawProps) => {
  const logic = useFadeInWrapperLogic(rawProps);
  const styles = useFadeInWrapperStyle(logic);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: logic.opacity.value }));
  return <Animated.View style={[animatedStyle, logic.rest.style]} {...logic.rest}>{logic.children}</Animated.View>;

};

export default FadeInWrapper;
