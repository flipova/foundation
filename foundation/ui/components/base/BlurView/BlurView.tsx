import React from 'react';
import { View } from 'react-native';
import { useBlurViewLogic, BlurViewProps } from './BlurView.logic';
import { useBlurViewStyle } from './BlurView.style';
// Using expo-blur
import { BlurView as ExpoBlurView } from 'expo-blur';

/**
 * A BlurView component that provides a blurred background effect.
 * 
 * @description
 * This component is used to create visual depth and hierarchy by applying a blur effect
 * over the underlying content. It wraps `expo-blur` to provide a consistent API and styling.
 * 
 * @useCases
 * - Creating modals or overlays where the background content should remain visible but out of focus.
 * - Building floating navigation bars or toolbars with a frosted glass effect.
 * - Emphasizing foreground elements without completely obscuring the background context.
 * 
 * @structure
 * - `ExpoBlurView`: The underlying component from `expo-blur` that applies the effect.
 * - Renders children inside the blurred container.
 * 
 * @accessibility
 * - Consider contrast and legibility when placing text or interactive elements over a blur.
 * - Ensure the blur does not interfere with the accessibility tree; it is primarily a visual effect.
 */
const BlurView: React.FC<BlurViewProps> = (rawProps) => {
  const logic = useBlurViewLogic(rawProps);
  const styles = useBlurViewStyle(logic);

  return (
    <ExpoBlurView
      intensity={logic.intensity}
      tint={logic.tint as any}
      style={[styles.container as any, logic.rest.style]}
    >
      {logic.children}
    </ExpoBlurView>
  );
};

export default BlurView;
