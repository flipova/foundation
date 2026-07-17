import React, { useMemo } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useProgressBarLogic, ProgressBarProps } from './ProgressBar.logic';
import { useProgressBarStyle } from './ProgressBar.style';

/**
 * A visual component that displays the completion progress of a task.
 * 
 * **Use Cases:**
 * - Showing loading progress.
 * - Indicating completion percentage of form steps.
 * 
 * **Structure:**
 * A container view with a nested fill view. The width of the nested view represents the progress.
 * 
 * **Accessibility Considerations:**
 * - Provide `accessibilityRole="progressbar"` (handled via props if needed).
 * - Consider passing `accessibilityValue={{ now: logic.progress, min: 0, max: 100 }}` to make it readable by screen readers.
 */
const ProgressBar: React.FC<ProgressBarProps> = (rawProps) => {
  const logic = useProgressBarLogic(rawProps);
  const styles = useProgressBarStyle(logic);

  const combinedStyle = useMemo(() => {
    return [styles.container, logic.rest.style] as StyleProp<ViewStyle>;
  }, [styles.container, logic.rest.style]);

  return (
    <View style={combinedStyle} {...logic.rest}>
      <View style={styles.fill as StyleProp<ViewStyle>} />
    </View>
  );
};

export default ProgressBar;
