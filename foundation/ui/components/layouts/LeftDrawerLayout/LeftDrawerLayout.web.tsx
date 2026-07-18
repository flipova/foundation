import React from 'react';
import { useLeftDrawerLayoutLogic, LeftDrawerLayoutProps } from './LeftDrawerLayout.logic';
import { useLeftDrawerLayoutStyle } from './LeftDrawerLayout.style';

/**
 * @component LeftDrawerLayout
 * @description
 * A layout implementing a side drawer (typically on the left) that can toggle open and closed,
 * often used for mobile navigation menus.
 * 
 * @role layout
 * @useCases
 * - Off-canvas navigation menus.
 * - Side-panel filters or settings.
 * @structure
 * - Main wrapper.
 * - Clickable overlay when the drawer is active.
 * - Absolute/Fixed drawer container.
 * @accessibility
 * - Should implement focus trapping when open.
 * - Uses an overlay to capture dismissal clicks outside the drawer.
 */
const LeftDrawerLayout: React.FC<LeftDrawerLayoutProps> = (rawProps) => {
  const logic = useLeftDrawerLayoutLogic(rawProps);
  const styles = useLeftDrawerLayoutStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex', flexDirection: 'column', position: 'relative' } as React.CSSProperties} {...logic.rest}>
      {logic.children}
      {logic.isOpen && (
        <>
          <div style={styles.overlay as React.CSSProperties} onClick={logic.onClose} />
          <div style={{ ...styles.drawer, display: 'flex', flexDirection: 'column' } as React.CSSProperties}>
            {logic.drawer}
          </div>
        </>
      )}
    </div>
  );
};

export default LeftDrawerLayout;
