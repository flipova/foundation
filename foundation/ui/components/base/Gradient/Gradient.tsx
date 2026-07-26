import React from 'react';
import { View } from 'react-native';
import { useGradientLogic, GradientProps } from './Gradient.logic';
import { useGradientStyle } from './Gradient.style';
import { isWeb } from '@/ui/utils/platform';

// Only import LinearGradient on non-web platforms
let LinearGradient: any = null;
if (!isWeb) {
  try {
    const ExpoGradientModule = require('expo-linear-gradient');
    LinearGradient = ExpoGradientModule.LinearGradient;
  } catch (e) {
    // expo-linear-gradient not available
  }
}

/**
 * Converts point coordinates to CSS gradient angle
 * React Native: start/end as {x: 0-1, y: 0-1}
 * CSS: angle in degrees or direction
 */
const convertPointsToAngle = (
  start?: { x: number; y: number },
  end?: { x: number; y: number }
): string => {
  if (!start || !end) return 'to right';

  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // Calculate angle in degrees (0° = to right, 90° = to bottom)
  const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

  return `${angle}deg`;
};

/**
 * Gradient component applies a linear color gradient to its children or background.
 * 
 * Role & Use Cases:
 * Used for decorative backgrounds, stylized buttons, or overlay effects to enhance the visual design.
 * 
 * Structure:
 * - Native: Wraps `expo-linear-gradient` for precise native gradient rendering.
 * - Web: Uses CSS linear-gradient with converted coordinates.
 * - Children are rendered on top of the gradient background.
 * 
 * Accessibility:
 * Primarily a visual enhancement. If the gradient contains important content, ensure the children themselves are accessible.
 */
const Gradient: React.FC<GradientProps> = (rawProps) => {
  const logic = useGradientLogic(rawProps);
  const styles = useGradientStyle(logic);

  // Native rendering
  if (!isWeb && LinearGradient) {
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
  }

  // Web rendering with CSS gradient
  const angle = convertPointsToAngle(logic.start, logic.end);
  const gradientString = `linear-gradient(${angle}, ${logic.colors.join(', ')})`;

  return (
    <View
      style={[
        styles.container as any,
        logic.rest.style,
        {
          background: gradientString,
        } as any,
      ]}
    >
      {logic.children}
    </View>
  );
};

export default Gradient;
