import React from 'react';
import { View } from 'react-native';
import { useBoxLogic, BoxProps } from './Box.logic';
import { useBoxStyle } from './Box.style';

/**
 * `Box` is the most fundamental layout primitive in the foundational component system.
 * It serves as a generic container (wrapper) for grouping other components and 
 * abstracting away basic styling needs directly via props (like margin, padding, flex).
 * 
 * **Role:**
 * Acts as the base building block for constructing complex UI layouts.
 * 
 * **Use cases:**
 * - Creating a container with specific spacing (padding/margin).
 * - Applying basic background colors.
 * - Flexbox layouts where a more specific primitive (like `Stack` or `Inline`) is not required.
 * 
 * **Structure:**
 * A thin wrapper around React Native's `View` component. 
 * Styles are dynamically computed based on the passed layout props for performance.
 * 
 * **Accessibility:**
 * `Box` passes all standard React Native `View` accessibility props directly to its root element.
 * If used as an interactive element, ensure appropriate `accessibilityRole` and `accessible` props are provided.
 */
const Box: React.FC<BoxProps> = (rawProps) => {
  const logic = useBoxLogic(rawProps);
  const styles = useBoxStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      {logic.children}
    </View>
  );
};

export default React.memo(Box);
