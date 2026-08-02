import React, { useMemo } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useSeparatorLogic, SeparatorProps } from './Separator.logic';
import { useSeparatorStyle } from './Separator.style';

/**
 * A visual divider to separate content vertically or horizontally.
 * 
 * **Use Cases:**
 * - Dividing list items.
 * - Separating sections of a layout visually.
 * 
 * **Structure:**
 * A simple View that alters its width and height based on the `orientation` prop.
 * 
 * **Accessibility Considerations:**
 * - Normally purely decorative, so it doesn't need to be read by screen readers.
 * - Consider passing `accessibilityRole="none"` or `accessible={false}` if needed.
 */
const Separator: React.FC<SeparatorProps> = (rawProps) => {
  const logic = useSeparatorLogic(rawProps);
  const styles = useSeparatorStyle(logic);

  const combinedStyle = useMemo(() => {
    return [styles.container, logic.rest.style] as StyleProp<ViewStyle>;
  }, [styles.container, logic.rest.style]);

  return (
    <View style={combinedStyle} {...logic.rest} />
  );
};

export default Separator;
