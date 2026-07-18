import React, { useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useSelectLogic, SelectProps } from './Select.logic';
import { useSelectStyle } from './Select.style';
import { Picker } from '@react-native-picker/picker';

/**
 * A dropdown selection component.
 * 
 * **Use Cases:**
 * - Forms requiring the user to choose one option from a long list.
 * - Filters or settings where space is limited and options are mutually exclusive.
 * 
 * **Structure:**
 * Wraps `@react-native-picker/picker` within a styled container view. The Picker fills the container seamlessly using `absoluteFill`.
 * 
 * **Accessibility Considerations:**
 * - The underlying Picker maps to native picker accessibility controls.
 * - Ensure `accessibilityLabel` is provided (via props) so screen readers can announce the purpose of the picker.
 */
const Select: React.FC<SelectProps> = (rawProps) => {
  const logic = useSelectLogic(rawProps);
  const styles = useSelectStyle(logic);

  const combinedStyle = useMemo(() => {
    return [styles.container, logic.rest.style] as StyleProp<ViewStyle>;
  }, [styles.container, logic.rest.style]);

  return (
    <View style={combinedStyle} {...logic.rest}>
      <Picker
        selectedValue={logic.value}
        onValueChange={(itemValue) => logic.onValueChange?.(itemValue)}
        enabled={!logic.disabled}
        style={StyleSheet.absoluteFill}
        onFocus={() => logic.setIsFocused(true)}
        onBlur={() => logic.setIsFocused(false)}
      >
        {logic.placeholder ? <Picker.Item label={logic.placeholder} value="" color="#999" /> : null}
        {logic.options.map((opt) => (
          <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </Picker>
    </View>
  );
};

export default Select;
