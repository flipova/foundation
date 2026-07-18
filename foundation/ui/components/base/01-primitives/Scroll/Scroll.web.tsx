/**
 * @role Scroll Component
 * @description A layout primitive that provides a scrollable area for content that exceeds the container's bounds.
 * @useCases Displaying long lists of items, scrollable terms and conditions, or horizontal carousels.
 * @structure Renders a `div` with `overflow-x` and `overflow-y` managed dynamically based on the `horizontal` prop.
 * @accessibility Ensure content inside the scrollable region remains focusable (e.g., using `tabIndex={0}` if applicable) so keyboard users can navigate and scroll the content.
 */
import React from 'react';
import { useScrollLogic, ScrollProps } from './Scroll.logic';
import { useScrollStyle } from './Scroll.style';

const Scroll: React.FC<ScrollProps> = (rawProps) => {
  const logic = useScrollLogic(rawProps);
  const styles = useScrollStyle(logic);

  return (
    <div 
      style={{
        ...styles.container,
        display: 'flex',
        flexDirection: logic.horizontal ? 'row' : 'column',
        overflowX: logic.horizontal ? 'auto' : 'hidden',
        overflowY: logic.horizontal ? 'hidden' : 'auto',
      } as React.CSSProperties}
      {...logic.rest}
    >
      {logic.children}
    </div>
  );
};

export default Scroll;
