import React from 'react';
import { useSwipe2ScreenLayoutLogic, Swipe2ScreenLayoutProps } from './Swipe2ScreenLayout.logic';
import { useSwipe2ScreenLayoutStyle } from './Swipe2ScreenLayout.style';

/**
 * @component Swipe2ScreenLayout (Web)
 * @description
 * A two-screen layout that allows swiping horizontally between two distinct views.
 * 
 * @role layout
 * @useCases 
 * - Onboarding flows or simple toggles between a main view and a secondary view.
 * - Mobile-first split experiences mapped to web horizontal scrolling.
 * 
 * @structure
 * - Employs CSS scroll snapping (`scroll-snap-type: x mandatory`).
 * - Contains two full-viewport-width (`100vw`) children that snap into place when scrolled.
 * 
 * @accessibility
 * - Ensure horizontal scroll is discoverable, possibly via buttons, as scrollbars might be hidden.
 * - Content in the off-screen pane should be hidden from screen readers until brought into view, if necessary.
 */
const Swipe2ScreenLayout: React.FC<Swipe2ScreenLayoutProps> = (rawProps) => {
  const logic = useSwipe2ScreenLayoutLogic(rawProps);
  const styles = useSwipe2ScreenLayoutStyle(logic);

  return (
    <div 
      style={{ 
        ...styles.container, 
        display: 'flex', 
        overflowX: 'auto',
        scrollSnapType: 'x mandatory'
      } as React.CSSProperties} 
      {...logic.rest}
    >
      <div style={{ flex: '0 0 100vw', scrollSnapAlign: 'start' }}>
        {logic.screen1}
      </div>
      <div style={{ flex: '0 0 100vw', scrollSnapAlign: 'start' }}>
        {logic.screen2}
      </div>
    </div>
  );
};

export default Swipe2ScreenLayout;
