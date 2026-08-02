import React from 'react';
import { View } from 'react-native';
import { useStackLogic, StackProps } from './Stack.logic';
import { useStackStyle } from './Stack.style';

/**
 * `Stack` is a layout primitive used to stack elements along a single axis (vertical or horizontal)
 * with a consistent gap between them.
 * 
 * **Role:**
 * Simplifies the creation of linear layouts (lists, rows of buttons, form fields)
 * by managing the spacing between children automatically.
 * 
 * **Use cases:**
 * - Stacking form inputs vertically with consistent margin.
 * - Placing a row of action buttons side-by-side (direction='row').
 * - Structuring the main content areas of a screen.
 * 
 * **Structure:**
 * Utilizes flexbox `flexDirection` to stack items, and the native `gap` property
 * for spacing, eliminating the need for margin hacks on children.
 * 
 * **Accessibility:**
 * Provides structural grouping. Like `View`, it doesn't impart semantic meaning
 * on its own.
 */
const Stack: React.FC<StackProps> = (rawProps) => {
  const logic = useStackLogic(rawProps);
  const styles = useStackStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      {logic.children}
    </View>
  );
};

export default React.memo(Stack);
