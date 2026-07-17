import React, { useMemo } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useSliderLogic, SliderProps } from './Slider.logic';
import { useSliderStyle } from './Slider.style';
import RNSlider from '@react-native-community/slider';

/**
 * A slider component for selecting a value from a continuous or discrete range.
 * 
 * **Use Cases:**
 * - Volume or brightness controls.
 * - Selecting a price range or age.
 * 
 * **Structure:**
 * Wraps `@react-native-community/slider` to apply unified theme colors and spacing.
 * 
 * **Accessibility Considerations:**
 * - The native slider handles basic accessibility (e.g., increment/decrement actions).
 * - Always pass an `accessibilityLabel` or use an adjacent text label so the user knows what the slider controls.
 */
const Slider: React.FC<SliderProps> = (rawProps) => {
  const logic = useSliderLogic(rawProps);
  const styles = useSliderStyle(logic);

  const combinedStyle = useMemo(() => {
    return [styles.container, logic.rest.style] as StyleProp<ViewStyle>;
  }, [styles.container, logic.rest.style]);

  return (
    <View style={combinedStyle} {...logic.rest}>
      <RNSlider
        style={{ width: '100%', height: 40 }}
        minimumValue={logic.min || 0}
        maximumValue={logic.max || 100}
        value={logic.value || 0}
        onValueChange={logic.onValueChange}
        minimumTrackTintColor={styles.fill?.backgroundColor as string || '#000'}
        maximumTrackTintColor={styles.track?.backgroundColor as string || '#ccc'}
        thumbTintColor={styles.thumb?.backgroundColor as string || '#000'}
        disabled={logic.disabled}
        step={logic.step}
      />
    </View>
  );
};

export default Slider;
