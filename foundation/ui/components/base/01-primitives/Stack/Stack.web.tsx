/**
 * @role Stack Component
 * @description A layout primitive for stacking child elements vertically with consistent spacing.
 * @useCases Building vertical forms, article layouts, and standard top-to-bottom UI structures.
 * @structure Renders a `div` configured as a flex container with a vertical flex direction.
 * @accessibility Visual layout component. Relies on the semantic structure of its children for proper document outline and screen reader interpretation.
 */
import React from 'react';
import { useStackLogic, StackProps } from './Stack.logic';
import { useStackStyle } from './Stack.style';

const Stack: React.FC<StackProps> = (rawProps) => {
  const logic = useStackLogic(rawProps);
  const styles = useStackStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex' } as React.CSSProperties} {...logic.rest}>
      {logic.children}
    </div>
  );
};

export default Stack;
