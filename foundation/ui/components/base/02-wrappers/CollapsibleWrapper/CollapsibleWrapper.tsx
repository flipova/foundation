import React from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useCollapsibleWrapperLogic, CollapsibleWrapperProps } from './CollapsibleWrapper.logic';
import { useCollapsibleWrapperStyle } from './CollapsibleWrapper.style';

/**
 * @component CollapsibleWrapper
 * @description A container that smoothly expands or collapses its children height.
 */
const CollapsibleWrapper: React.FC<CollapsibleWrapperProps> = (rawProps) => {
  const logic = useCollapsibleWrapperLogic(rawProps);
  const styles = useCollapsibleWrapperStyle(logic);

  const animatedStyle = useAnimatedStyle(() => ({ height: logic.height.value }));
  return (
    <Animated.View style={[animatedStyle, { overflow: 'hidden' } as any, logic.rest.style]} {...logic.rest}>
      <View onLayout={(e) => logic.setContentHeight(e.nativeEvent.layout.height)} style={{ position: 'absolute', width: '100%' } as any}>
        {logic.children}
      </View>
    </Animated.View>
  );

};

export default CollapsibleWrapper;
