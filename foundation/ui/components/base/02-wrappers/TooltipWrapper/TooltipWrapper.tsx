import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTooltipWrapperLogic, TooltipWrapperProps } from './TooltipWrapper.logic';
import { useTooltipWrapperStyle } from './TooltipWrapper.style';

/**
 * @component TooltipWrapper
 * @description Wraps a component and displays a tooltip bubble near it.
 */
const TooltipWrapper: React.FC<TooltipWrapperProps> = (rawProps) => {
  const logic = useTooltipWrapperLogic(rawProps);
  const styles = useTooltipWrapperStyle(logic);

  return (
    <View style={[{ position: 'relative' } as any, logic.rest.style]} {...logic.rest}>
      {logic.children}
      {logic.isVisible && (
        <Animated.View 
          entering={FadeIn} exiting={FadeOut}
          style={{
            position: 'absolute', top: -35, alignSelf: 'center', backgroundColor: '#333', 
            paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, zIndex: 999
          } as any}
        >
          <Text style={{ color: '#FFF', fontSize: 12 } as any}>{logic.text}</Text>
        </Animated.View>
      )}
    </View>
  );

};

export default TooltipWrapper;
