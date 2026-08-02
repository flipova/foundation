import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSpinnerLogic, SpinnerProps } from './Spinner.logic';
import { useSpinnerStyle } from './Spinner.style';

/**
 * A loading spinner component to indicate activity or loading state.
 * 
 * **Use Cases:**
 * - Showing that data is being fetched.
 * - Indicating a processing state on a button or screen.
 * 
 * **Structure:**
 * Wraps React Native's native `ActivityIndicator` inside a `View` container, 
 * applying theme colors automatically.
 * 
 * **Accessibility Considerations:**
 * - Ensure `accessibilityLabel` (e.g., "Loading...") is passed so screen readers can announce the loading state.
 * - Often used with `accessibilityRole="progressbar"`.
 */
const Spinner: React.FC<SpinnerProps> = (rawProps) => {
  const logic = useSpinnerLogic(rawProps);
  const styles = useSpinnerStyle(logic);

  return (
    <View style={logic.rest.style} {...logic.rest}>
      <ActivityIndicator 
        size={typeof logic.size === 'number' ? 'small' : logic.size} 
        color={styles.color} 
      />
    </View>
  );
};

export default Spinner;
