import React from 'react';
import { useScrollLayoutLogic, ScrollLayoutProps } from './ScrollLayout.logic';
import { useScrollLayoutStyle } from './ScrollLayout.style';

/**
 * @component ScrollLayout (Web)
 * @description
 * A scrollable container supporting both vertical and horizontal scrolling directions.
 * 
 * @role layout
 * @useCases 
 * - Long lists of content needing vertical scrolling.
 * - Carousels or horizontal lists of items (e.g., tags, image strips).
 * 
 * @structure
 * - Uses flexbox to layout children either in a row or column.
 * - Applies CSS overflow rules dynamically based on the `horizontal` prop.
 * 
 * @accessibility
 * - Scrollable areas should be keyboard accessible if they contain non-focusable text.
 * - Consider adding `tabIndex={0}` if the user needs to scroll using keyboard arrows without interacting with children.
 */
const ScrollLayout: React.FC<ScrollLayoutProps> = (rawProps) => {
  const logic = useScrollLayoutLogic(rawProps);
  const styles = useScrollLayoutStyle(logic);

  return (
    <div 
      style={{
        ...styles.container, 
        display: 'flex', 
        flexDirection: logic.horizontal ? 'row' : 'column',
        overflowX: logic.horizontal ? 'auto' : 'hidden',
        overflowY: logic.horizontal ? 'hidden' : 'auto'
      } as React.CSSProperties} 
      {...logic.rest}
    >
      {logic.children}
    </div>
  );
};

export default ScrollLayout;
