import React from 'react';
import { useFlexLayoutLogic, FlexLayoutProps } from './FlexLayout.logic';
import { useFlexLayoutStyle } from './FlexLayout.style';

/**
 * @component FlexLayout
 * @description
 * A flexible layout primitive acting as a wrapper around CSS Flexbox.
 * 
 * @role layout
 * @useCases
 * - General purpose container for horizontal or vertical alignment of items.
 * @structure
 * - A simple `div` configured as a flex container.
 * @accessibility
 * - Standard flow container, maintains semantic order.
 */
const FlexLayout: React.FC<FlexLayoutProps> = (rawProps) => {
  const logic = useFlexLayoutLogic(rawProps);
  const styles = useFlexLayoutStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex' } as React.CSSProperties} {...logic.rest}>
      {logic.children}
    </div>
  );
};

export default FlexLayout;
