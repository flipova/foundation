import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useRadioGroupLogic, RadioGroupProps } from './RadioGroup.logic';
import { useRadioGroupStyle } from './RadioGroup.style';

/**
 * A group of radio buttons allowing a single selection from multiple options.
 * 
 * **Use Cases:**
 * - Form inputs requiring a single choice from a visible list of options.
 * - Settings panels where users must select one active mode or preference.
 * 
 * **Structure:**
 * A container holding multiple `Pressable` items. Each item contains a custom radio button graphic
 * (built with nested views) and a text label.
 * 
 * **Accessibility Considerations:**
 * - Should ideally group choices via `accessibilityRole="radiogroup"`.
 * - Each item should have `accessibilityRole="radio"` and `accessibilityState={{ checked: isSelected }}`.
 */
const RadioGroup: React.FC<RadioGroupProps> = (rawProps) => {
  const logic = useRadioGroupLogic(rawProps);
  const styles = useRadioGroupStyle(logic);

  const combinedContainerStyle = useMemo(() => {
    return [styles.container, logic.rest.style] as StyleProp<ViewStyle>;
  }, [styles.container, logic.rest.style]);

  return (
    <View style={combinedContainerStyle} {...logic.rest} accessibilityRole="radiogroup">
      {logic.options.map((opt) => {
        const isSelected = logic.value === opt.value;
        return (
          <Pressable 
            key={opt.value} 
            style={styles.item as StyleProp<ViewStyle>}
            disabled={logic.disabled}
            onPress={() => logic.onValueChange?.(opt.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected, disabled: logic.disabled }}
          >
            <View style={[styles.radio, !isSelected && styles.radioUnchecked] as StyleProp<ViewStyle>}>
              {isSelected && <View style={styles.dot as StyleProp<ViewStyle>} />}
            </View>
            <Text style={styles.label as StyleProp<TextStyle>}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default RadioGroup;
