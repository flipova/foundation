/**
 * @role Inline Component
 * @description A layout primitive for aligning child elements horizontally in a row.
 * @useCases Creating horizontal navigation bars, icon rows, and side-by-side button layouts.
 * @structure Renders a `div` configured as a flex container with a horizontal flex direction.
 * @accessibility Serves as a visual grouping mechanism. For semantic groupings, use appropriate lists (`ul`/`li`) or ARIA roles depending on the content.
 */
import React from 'react';
import { useInlineLogic, InlineProps } from './Inline.logic';
import { useInlineStyle } from './Inline.style';

const Inline: React.FC<InlineProps> = (rawProps) => {
  const logic = useInlineLogic(rawProps);
  const styles = useInlineStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex' } as React.CSSProperties} {...logic.rest}>
      {logic.children}
    </div>
  );
};

export default Inline;
