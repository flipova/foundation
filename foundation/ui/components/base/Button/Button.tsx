import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { useButtonLogic, ButtonProps } from './Button.logic';
import { useButtonStyle } from './Button.style';

/**
 * A highly customizable Button component for handling user interactions.
 * 
 * @description
 * This component provides a styled, accessible pressable area. It supports multiple variants,
 * sizes, and a loading state to indicate background processing.
 * 
 * @useCases
 * - Submitting forms or triggering actions.
 * - Navigating between different screens (e.g., as a link variant).
 * - Displaying a loading state while awaiting a network response.
 * 
 * @structure
 * - `Pressable`: The core interactive element handling touch events.
 * - `ActivityIndicator`: Conditionally rendered when the button is in a loading state.
 * - `Text`: Displays the button label.
 * 
 * @accessibility
 * - Uses `accessibilityRole="button"` to inform screen readers of its purpose.
 * - Manages `accessibilityState` to communicate `disabled` and `busy` (loading) states.
 * - Ensure sufficient color contrast for the text against the button background in all variants.
 */
const Button: React.FC<ButtonProps> = (rawProps) => {
  const logic = useButtonLogic(rawProps);
  const styles = useButtonStyle(logic);

  return (
    <Pressable 
      style={[styles.container as any, logic.rest.style]} 
      onPress={logic.onPress} 
      disabled={logic.disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: logic.disabled, busy: logic.loading }}
    >
      {logic.loading && <ActivityIndicator color={styles.spinner.color} style={styles.spinner as any} />}
      {logic.label ? <Text style={styles.label as any}>{logic.label}</Text> : null}
    </Pressable>
  );
};

export default Button;
