import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useCheckboxLogic, CheckboxProps } from './Checkbox.logic';
import { useCheckboxStyle } from './Checkbox.style';
import { Check } from 'lucide-react-native';

/**
 * A control that allows the user to toggle between checked and not checked states.
 * 
 * @description
 * This component provides a customizable checkbox with optional labeling. It supports both controlled 
 * and uncontrolled modes of operation.
 * 
 * @useCases
 * - Selecting one or multiple options from a list.
 * - Agreeing to terms and conditions.
 * - Toggling a boolean setting.
 * 
 * @structure
 * - `Pressable`: Wraps the entire component (checkbox + label) to increase the tap target size.
 * - `View`: Renders the visual box.
 * - `Check`: A Lucide icon rendered inside the box when checked.
 * - `Text`: Displays the optional label next to the checkbox.
 * 
 * @accessibility
 * - The entire wrapper is pressable to aid users with limited dexterity.
 * - Depending on the use case, consider adding explicit `accessibilityRole="checkbox"` and 
 *   `accessibilityState={{ checked: logic.checked, disabled: logic.disabled }}` to the Pressable via `rest`.
 */
const Checkbox: React.FC<CheckboxProps> = (rawProps) => {
  const logic = useCheckboxLogic(rawProps);
  const styles = useCheckboxStyle(logic);

  return (
    <Pressable style={[styles.wrapper as any, logic.rest.style]} onPress={logic.handlePress} disabled={logic.disabled}>
      <View style={styles.container as any}>
        {logic.checked && <Check size={14} color={styles.iconColor} />}
      </View>
      {logic.label && <Text style={styles.label as any}>{logic.label}</Text>}
    </Pressable>
  );
};

export default Checkbox;
