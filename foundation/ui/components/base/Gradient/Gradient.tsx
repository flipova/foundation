import React from 'react';
import { View } from 'react-native';
import { useGradientLogic, GradientProps } from './Gradient.logic';
import { useGradientStyle } from './Gradient.style';
// Using expo-linear-gradient
import { LinearGradient } from 'expo-linear-gradient';

/**
 * Gradient component applies a linear color gradient to its children or background.
 * 
 * Role & Use Cases:
 * Used for decorative backgrounds, stylized buttons, or overlay effects to enhance the visual design.
 * 
 * Structure:
 * Wraps `expo-linear-gradient` to provide a consistent API and theming.
 * 
 * Accessibility:
 * Primarily a visual enhancement. If the gradient contains important content, ensure the children themselves are accessible.
 */
const Gradient: React.FC<GradientProps> = (rawProps) => {
  const logic = useGradientLogic(rawProps);
  const styles = useGradientStyle(logic);

  return (
    <LinearGradient
      colors={logic.colors}
      start={logic.start}
      end={logic.end}
      style={[styles.container as any, logic.rest.style]}
    >
      {logic.children}
    </LinearGradient>
  );
};

export default Gradient;
