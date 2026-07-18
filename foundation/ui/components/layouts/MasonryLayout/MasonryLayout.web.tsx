import React from 'react';
import { useMasonryLayoutLogic, MasonryLayoutProps } from './MasonryLayout.logic';
import { useMasonryLayoutStyle } from './MasonryLayout.style';

/**
 * @component MasonryLayout (Web)
 * @description
 * Web-optimized Masonry layout that uses CSS multi-column for efficient rendering.
 * 
 * @role layout
 * @useCases 
 * - Displaying a grid of items with varying heights (e.g., a photo gallery or Pinterest-style layout).
 * - Showing dynamic content cards that should tightly pack vertically.
 * 
 * @structure
 * - Renders a main `div` container with `column-count` and `column-gap`.
 * - Wraps each child in a `div` with `break-inside: avoid` to prevent elements from splitting across columns.
 * 
 * @accessibility
 * - Maintains logical document order for screen readers.
 * - Ensure interactive child elements are focusable and have appropriate aria labels.
 */
const MasonryLayout: React.FC<MasonryLayoutProps> = (rawProps) => {
  const logic = useMasonryLayoutLogic(rawProps);
  const styles = useMasonryLayoutStyle(logic);

  return (
    <div 
      style={{ 
        ...styles.container, 
        columnCount: logic.columns,
        columnGap: `${logic.gap}px`,
        display: 'block' // block is required for column-count
      } as React.CSSProperties} 
      {...logic.rest}
    >
      {/* On web, break-inside: avoid handles masonry elegantly */}
      {React.Children.map(logic.children, (child) => (
        <div style={{ breakInside: 'avoid', marginBottom: `${logic.gap}px` }}>
          {child}
        </div>
      ))}
    </div>
  );
};

export default MasonryLayout;
