import React, { useMemo } from 'react';
import { Pressable as RNPressable, StyleProp, ViewStyle } from 'react-native';
import { usePressableLogic, PressableProps } from './Pressable.logic';
import { usePressableStyle } from './Pressable.style';

/**
 * A highly customizable wrapper around React Native's Pressable component.
 * It serves as the base for building interactive elements like buttons, list items, and tabs.
 * 
 * **Use Cases:**
 * - Creating custom buttons or interactive cards.
 * - Making any view respond to touch events.
 * 
 * **Structure:**
 * Utilizes the native `Pressable` to capture touch interactions without adding additional DOM/View hierarchy.
 * 
 * **Accessibility Considerations:**
 * - Ensure `accessibilityRole` and `accessibilityLabel` are passed via props for screen readers.
 * - Visual feedback is necessary (opacity, background color change) when pressed, which can be managed via the `style` prop or the `disabled` state.
 */
const Pressable: React.FC<PressableProps> = (rawProps) => {
  const logic = usePressableLogic(rawProps);
  const styles = usePressableStyle(logic);
  
  const combinedStyle = useMemo(() => {
    return [styles.container, logic.rest.style] as StyleProp<ViewStyle>;
  }, [styles.container, logic.rest.style]);

  return (
    <RNPressable 
      style={combinedStyle} 
      onPress={logic.onPress} 
      disabled={logic.disabled}
      {...logic.rest}
    >
      {logic.children}
    </RNPressable>
  );
};

export default Pressable;
