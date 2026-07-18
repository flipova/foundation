import React from 'react';
import { useBottomDrawerLayoutLogic, BottomDrawerLayoutProps } from './BottomDrawerLayout.logic';
import { useBottomDrawerLayoutStyle } from './BottomDrawerLayout.style';

/**
 * @component BottomDrawerLayout
 * @description
 * A layout that incorporates a bottom drawer, useful for mobile-like interaction
 * patterns or secondary content reveals on web.
 * 
 * @role layout
 * @useCases
 * - Modals that slide up from the bottom of the screen.
 * - Contextual menus or action sheets.
 * @structure
 * - Main content container.
 * - Overlay that appears when the drawer is open.
 * - Drawer container fixed at the bottom.
 * @accessibility
 * - When open, the overlay should capture clicks to close.
 * - Needs focus management (trap focus inside drawer) for full accessibility compliance.
 */
const BottomDrawerLayout: React.FC<BottomDrawerLayoutProps> = (rawProps) => {
  const logic = useBottomDrawerLayoutLogic(rawProps);
  const styles = useBottomDrawerLayoutStyle(logic);

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

export default BottomDrawerLayout;
