import React from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { useShimmerWrapperLogic, ShimmerWrapperProps } from './ShimmerWrapper.logic';
import { useShimmerWrapperStyle } from './ShimmerWrapper.style';

/**
 * @component ShimmerWrapper
 * @description Adds a shiny animated loading shimmer effect over its children.
 */
const ShimmerWrapper: React.FC<ShimmerWrapperProps> = (rawProps) => {
  const logic = useShimmerWrapperLogic(rawProps);
  const styles = useShimmerWrapperStyle(logic);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: logic.opacity.value }));
  return (
    <Animated.View style={[animatedStyle, logic.rest.style]} {...logic.rest}>
      {logic.children}
      {logic.isLoading && <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.2)' } as any} />}
    </Animated.View>
  );

};

export default ShimmerWrapper;
