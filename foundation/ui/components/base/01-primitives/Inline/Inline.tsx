import React from 'react';
import { View } from 'react-native';
import { useInlineLogic, InlineProps } from './Inline.logic';
import { useInlineStyle } from './Inline.style';

/**
 * `Inline` is a layout primitive that arranges its children in a horizontal row,
 * wrapping them to the next line if they exceed the container's width.
 * 
 * **Role:**
 * Handles horizontal flowing layouts where items should comfortably wrap,
 * much like words in a paragraph, with a consistent gap between them.
 * 
 * **Use cases:**
 * - Displaying a list of tags or chips.
 * - Grouping multiple small inline actions (like icons or small buttons).
 * - Formatting metadata pills that might wrap on smaller screens.
 * 
 * **Structure:**
 * Implements a flexbox row layout with `flexWrap: 'wrap'` and a configurable `gap`.
 * 
 * **Accessibility:**
 * Acts as a presentational grouping container. Consider adding `accessible={true}` 
 * and `accessibilityLabel` if the group itself represents a single interactive or 
 * semantic block of information.
 */
const Inline: React.FC<InlineProps> = (rawProps) => {
  const logic = useInlineLogic(rawProps);
  const styles = useInlineStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      {logic.children}
    </View>
  );
};

export default React.memo(Inline);
