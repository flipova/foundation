import React from 'react';
import { useSeparatorLogic, SeparatorProps } from './Separator.logic';
import { useSeparatorStyle } from './Separator.style';

/**
 * Role: Visually or semantically divides content into distinct sections.
 * UseCases: Used between list items, navigation links, or layout blocks to improve visual structure and readability.
 * Structure: Renders a simple `div` styled as a thin horizontal or vertical line based on the orientation prop.
 * Accessibility: Implements `role="separator"` and specifies the `aria-orientation` to inform assistive technologies about the thematic break.
 */
const Separator: React.FC<SeparatorProps> = (rawProps) => {
  const logic = useSeparatorLogic(rawProps);
  const styles = useSeparatorStyle(logic);

  return (
    <div 
      style={styles.container as React.CSSProperties} 
      role="separator" 
      aria-orientation={logic.orientation} 
      {...logic.rest} 
    />
  );
};

export default Separator;
