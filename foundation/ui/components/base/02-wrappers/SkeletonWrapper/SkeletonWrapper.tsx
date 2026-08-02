import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';
import { useSkeletonWrapperLogic, SkeletonWrapperProps } from './SkeletonWrapper.logic';
import { useSkeletonWrapperStyle } from './SkeletonWrapper.style';

/**
 * @component SkeletonWrapper
 * @description
 * A smart wrapper that renders an animated "shimmer" skeleton overlay that matches 
 * the exact dimensions of its children when `isLoading` is true.
 * 
 * @useCases
 * - Wrapping cards, images, or blocks of text while waiting for data.
 * 
 * @structure
 * Renders the children invisibly (opacity: 0) to capture their `onLayout` dimensions.
 * Once measured, an absolute positioned `Animated.View` overlays a shimmering effect.
 * 
 * @role wrapper
 */
const SkeletonWrapper: React.FC<SkeletonWrapperProps> = (rawProps) => {
  const logic = useSkeletonWrapperLogic(rawProps);
  const styles = useSkeletonWrapperStyle(logic);

  const opacity = useSharedValue(0.5);

  useEffect(() => {
    if (logic.isLoading) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.5, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // infinite
        true // reverse
      );
    }
  }, [logic.isLoading, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View style={[styles.container as any, logic.rest.style]} onLayout={logic.onLayout} {...logic.rest}>
      <View style={logic.isLoading ? styles.childrenHidden : styles.childrenVisible}>
        {logic.children}
      </View>
      
      {logic.isLoading && logic.hasMeasured && (
        <Animated.View style={[styles.skeletonOverlay as any, animatedStyle]} />
      )}
    </View>
  );
};

export default React.memo(SkeletonWrapper);
