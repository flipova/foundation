import React from 'react';
import { useTopDrawerLayoutLogic, TopDrawerLayoutProps } from './TopDrawerLayout.logic';
import { useTopDrawerLayoutStyle } from './TopDrawerLayout.style';

/**
 * @component TopDrawerLayout (Web)
 * @description
 * Layout featuring a main content area with a drawer that slides or drops down from the top.
 * 
 * @role layout
 * @useCases 
 * - Global site navigation menus.
 * - Search bars, filter panels, or contextual settings that appear over the content.
 * 
 * @structure
 * - Renders children normally within a relative container.
 * - Conditionally renders an overlay and a top-positioned drawer `div` based on `logic.isOpen`.
 * 
 * @accessibility
 * - When open, the drawer should trap focus, and the overlay should dismiss the drawer when clicked or when 'Escape' is pressed.
 * - Use `aria-expanded` on the triggering button and appropriately label the drawer region.
 */
const TopDrawerLayout: React.FC<TopDrawerLayoutProps> = (rawProps) => {
  const logic = useTopDrawerLayoutLogic(rawProps);
  const styles = useTopDrawerLayoutStyle(logic);

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

export default TopDrawerLayout;
