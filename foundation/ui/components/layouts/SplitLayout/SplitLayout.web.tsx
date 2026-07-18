import React from 'react';
import { useSplitLayoutLogic, SplitLayoutProps } from './SplitLayout.logic';
import { useSplitLayoutStyle } from './SplitLayout.style';

/**
 * @component SplitLayout (Web)
 * @description
 * Layout that divides the view into two distinct sections (typically left/right).
 * 
 * @role layout
 * @useCases 
 * - Code editors (file tree on left, editor on right).
 * - Master-detail views or comparison screens.
 * 
 * @structure
 * - Uses a flex container splitting space between a `left` and `right` div.
 * - Both panes are structured as independent vertical flex columns.
 * 
 * @accessibility
 * - Clearly separate content logically; consider using ARIA landmarks for each pane if they serve distinct purposes.
 * - If the split is resizable, ensure the divider is focusable and controllable via keyboard arrows.
 */
const SplitLayout: React.FC<SplitLayoutProps> = (rawProps) => {
  const logic = useSplitLayoutLogic(rawProps);
  const styles = useSplitLayoutStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex' } as React.CSSProperties} {...logic.rest}>
      <div style={{ ...styles.left, display: 'flex', flexDirection: 'column' } as React.CSSProperties}>
        {logic.left}
      </div>
      <div style={{ ...styles.right, display: 'flex', flexDirection: 'column' } as React.CSSProperties}>
        {logic.right}
      </div>
    </div>
  );
};

export default SplitLayout;
