import React from 'react';
import { useDeckLayoutLogic, DeckLayoutProps } from './DeckLayout.logic';
import { useDeckLayoutStyle } from './DeckLayout.style';

/**
 * @component DeckLayout
 * @description
 * A specialized layout that stacks its children like a deck of cards,
 * creating a stacked visual effect with varying scales and z-indexes.
 * 
 * @role layout
 * @useCases
 * - Tinder-like card swiping interfaces.
 * - Image galleries or presentation slides.
 * @structure
 * - Relative container holding absolutely positioned children.
 * @accessibility
 * - Stacked items might obscure content for sighted users; screen readers will still read them in DOM order.
 */
const DeckLayout: React.FC<DeckLayoutProps> = (rawProps) => {
  const logic = useDeckLayoutLogic(rawProps);
  const styles = useDeckLayoutStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex', position: 'relative' } as React.CSSProperties} {...logic.rest}>
      {React.Children.map(logic.children, (child, index) => (
        <div 
          style={{ 
            ...styles.card, 
            position: 'absolute', 
            top: `${50 + index * 10}px`, 
            transform: `scale(${1 - index * 0.05})`,
            zIndex: 100 - index 
          } as React.CSSProperties} 
          key={index}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default DeckLayout;
