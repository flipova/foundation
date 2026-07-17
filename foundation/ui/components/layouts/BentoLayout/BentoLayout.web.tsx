import React from 'react';
import { useBentoLayoutLogic, BentoLayoutProps } from './BentoLayout.logic';
import { useBentoLayoutStyle } from './BentoLayout.style';

/**
 * @component BentoLayout
 * @description
 * A grid-based layout inspired by bento boxes, using CSS Grid to arrange content
 * in an adaptive, modular pattern.
 * 
 * @role layout
 * @useCases
 * - Dashboards displaying multiple widgets or data points.
 * - Complex grid galleries.
 * @structure
 * - Container utilizing CSS Grid with auto-fit capabilities.
 * @accessibility
 * - Grid layout maintains document flow order for keyboard navigation.
 */
const BentoLayout: React.FC<BentoLayoutProps> = (rawProps) => {
  const logic = useBentoLayoutLogic(rawProps);
  const styles = useBentoLayoutStyle(logic);

  // Web utilizes CSS Grid for true Bento box behavior
  // This expects children to define their own grid-column/grid-row or uses auto-fit
  return (
    <div 
      style={{ 
        ...styles.container, 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gridAutoRows: '200px',
        gridAutoFlow: 'dense',
        gap: `${logic.gap}px`
      } as React.CSSProperties} 
      {...logic.rest}
    >
      {logic.children}
    </div>
  );
};

export default BentoLayout;
