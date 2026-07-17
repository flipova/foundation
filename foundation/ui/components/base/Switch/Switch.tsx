import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSwitchLogic, SwitchProps } from './Switch.logic';
import { useSwitchStyle } from './Switch.style';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';

/**
 * A highly accessible, animated toggle switch component.
 * 
 * @role
 * Provides a boolean input control that allows the user to toggle between checked and unchecked states.
 * 
 * @useCases
 * - Settings panels to toggle preferences.
 * - Form fields for boolean choices (e.g., "I agree to terms", "Enable notifications").
 * 
 * @structure
 * - Uses a `Pressable` wrapper for interaction and accessibility.
 * - Contains a `View` acting as the track.
 * - Uses an `Animated.View` from `react-native-reanimated` for the thumb to provide smooth spring animations when toggled.
 * - Optionally renders a `Text` component for the label next to the switch.
 * 
 * @accessibility
 * - Implements `accessibilityRole="switch"`.
 * - Uses `accessibilityState` to announce the current `checked` and `disabled` states to screen readers.
 * - Uses `accessibilityLabel` from the provided label or defaults to "Toggle Switch".
 */
const Switch: React.FC<SwitchProps> = (rawProps) => {
  const logic = useSwitchLogic(rawProps);
  const styles = useSwitchStyle(logic);
  
  const translateX = useSharedValue(logic.checked ? 20 : 0);

  useEffect(() => {
    translateX.value = withSpring(logic.checked ? 20 : 0, {
      mass: 1,
      damping: 15,
      stiffness: 120,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 2,
    });
  }, [logic.checked, translateX]);

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <Pressable 
      style={[styles.wrapper as any, logic.rest.style]} 
      onPress={logic.handlePress} 
      disabled={logic.disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: logic.checked, disabled: logic.disabled }}
      accessibilityLabel={logic.label || "Toggle Switch"}
    >
      <View style={styles.track as any}>
        <Animated.View style={[styles.thumb as any, animatedThumbStyle]} />
      </View>
      {logic.label && <Text style={styles.label as any}>{logic.label}</Text>}
    </Pressable>
  );
};

export default Switch;
