import React from 'react';
import { useVoidLayoutLogic, VoidLayoutProps } from './VoidLayout.logic';
import { useVoidLayoutStyle } from './VoidLayout.style';

/**
 * @component VoidLayout (Web)
 * @description
 * A transparent layout component that provides logic wrapping without altering the visual box model.
 * 
 * @role layout
 * @useCases 
 * - Applying layout logic or context without introducing a wrapper DOM node that breaks styling.
 * - Passing down styles or props while maintaining a flat DOM structure.
 * 
 * @structure
 * - Renders a `div` with `display: contents`, which makes the container effectively disappear from the visual formatting model while keeping its children.
 * 
 * @accessibility
 * - `display: contents` can sometimes cause bugs in certain screen readers (losing semantic meaning of the container). Ensure this wrapper does not carry critical ARIA roles.
 */
const VoidLayout: React.FC<VoidLayoutProps> = (rawProps) => {
  const logic = useVoidLayoutLogic(rawProps);
  const styles = useVoidLayoutStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'contents' } as React.CSSProperties} {...logic.rest}>
      {logic.children}
    </div>
  );
};

export default VoidLayout;
