import React from 'react';
import { useSwiperLayoutLogic, SwiperLayoutProps } from './SwiperLayout.logic';
import { useSwiperLayoutStyle } from './SwiperLayout.style';

/**
 * @component SwiperLayout (Web)
 * @description
 * A carousel-like layout allowing users to swipe through multiple screens or items horizontally.
 * 
 * @role layout
 * @useCases 
 * - Image galleries, product showcases, or multi-step onboarding on mobile web.
 * - Horizontally scrollable content sections.
 * 
 * @structure
 * - Utilizes a horizontal flex container with CSS scroll snapping (`scroll-snap-type: x mandatory`).
 * - Wraps each child in a `100vw` container that acts as a snap point (`scroll-snap-align: start`).
 * 
 * @accessibility
 * - Provide visible navigation controls (like dots or arrows) since native scroll snapping might lack affordances.
 * - Manage focus so keyboard users can navigate logically through swiped sections.
 */
const SwiperLayout: React.FC<SwiperLayoutProps> = (rawProps) => {
  const logic = useSwiperLayoutLogic(rawProps);
  const styles = useSwiperLayoutStyle(logic);

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
      {React.Children.map(logic.children, (child, index) => (
        <div key={index} style={{ flex: '0 0 100vw', scrollSnapAlign: 'start' }}>
          {child}
        </div>
      ))}
    </div>
  );
};

export default SwiperLayout;
