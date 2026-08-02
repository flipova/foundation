import React from 'react';
import { View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useBlurWrapperLogic, BlurWrapperProps } from './BlurWrapper.logic';
import { useBlurWrapperStyle } from './BlurWrapper.style';

/**
 * @component BlurWrapper
 * @description Wraps children in a frosted glass/blur container.
 */
const BlurWrapper: React.FC<BlurWrapperProps> = (rawProps) => {
  const logic = useBlurWrapperLogic(rawProps);
  const styles = useBlurWrapperStyle(logic);

  return (
    <View style={[{ overflow: 'hidden' } as any, logic.rest.style]} {...logic.rest}>
      <BlurView intensity={logic.intensity} tint={logic.tint as any} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } as any} />
      {logic.children}
    </View>
  );

};

export default BlurWrapper;
