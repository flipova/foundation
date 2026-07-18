import React from 'react';
import { useFlipLayoutLogic, FlipLayoutProps } from './FlipLayout.logic';
import { useFlipLayoutStyle } from './FlipLayout.style';

/**
 * @component FlipLayout
 * @description
 * An interactive layout that flips between a front and back face
 * using 3D CSS transforms.
 * 
 * @role layout
 * @useCases
 * - Flashcards, interactive tiles, or revealing secondary information.
 * @structure
 * - Container with perspective.
 * - Inner wrapper managing 3D rotation state.
 * - Front and back faces with hidden backfaces.
 * @accessibility
 * - Clickable area should ideally have a button role or aria-expanded.
 * - Ensure hidden content is aria-hidden when not visible.
 */
const FlipLayout: React.FC<FlipLayoutProps> = (rawProps) => {
  const logic = useFlipLayoutLogic(rawProps);
  const styles = useFlipLayoutStyle(logic);

  return (
    <div 
      style={{ ...styles.container, perspective: 1000, cursor: 'pointer' } as React.CSSProperties} 
      onClick={() => logic.setIsFlipped(!logic.isFlipped)} 
      {...logic.rest}
    >
      <div style={{ 
        position: 'relative', width: '100%', height: '100%', transition: 'transform 0.6s', transformStyle: 'preserve-3d',
        transform: logic.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
      }}>
        <div style={{ ...styles.card, position: 'absolute', backfaceVisibility: 'hidden' } as React.CSSProperties}>
          {logic.front}
        </div>
        <div style={{ ...styles.card, position: 'absolute', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' } as React.CSSProperties}>
          {logic.back}
        </div>
      </div>
    </div>
  );
};

export default FlipLayout;
