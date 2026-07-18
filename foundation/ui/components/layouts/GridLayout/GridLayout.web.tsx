import React from 'react';
import { useGridLayoutLogic, GridLayoutProps } from './GridLayout.logic';
import { useGridLayoutStyle } from './GridLayout.style';

/**
 * @component GridLayout
 * @description
 * A layout primitive that wraps CSS Grid functionality for arranging items in columns.
 * 
 * @role layout
 * @useCases
 * - Galleries, product listings, or uniform component grids.
 * @structure
 * - A container `div` implementing basic CSS Grid column definitions.
 * @accessibility
 * - Grid ordering matches source order, ensuring logical tab sequence.
 */
const GridLayout: React.FC<GridLayoutProps> = (rawProps) => {
  const logic = useGridLayoutLogic(rawProps);
  const styles = useGridLayoutStyle(logic);

  return (
    <div 
      style={{ 
        ...styles.container, 
        display: 'grid', 
        gridTemplateColumns: `repeat(${logic.columns}, 1fr)`, 
        gap: `${logic.gap}px` 
      } as React.CSSProperties} 
      {...logic.rest}
    >
      {logic.children}
    </div>
  );
};

export default GridLayout;
