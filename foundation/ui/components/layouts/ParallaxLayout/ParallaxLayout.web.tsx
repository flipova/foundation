import React from 'react';
import { useParallaxLayoutLogic, ParallaxLayoutProps } from './ParallaxLayout.logic';
import { useParallaxLayoutStyle } from './ParallaxLayout.style';

/**
 * @component ParallaxLayout (Web)
 * @description
 * Web-optimized Parallax layout that provides a 3D scrolling effect.
 * 
 * @role layout
 * @useCases 
 * - Landing pages needing immersive header images.
 * - Content sections that reveal backgrounds at a different scroll speed.
 * 
 * @structure
 * - Uses a container with `perspective` and `overflow-y: auto`.
 * - Contains a header element translated in 3D space (`translateZ`) to create depth.
 * - Stacks regular content on top with a higher `z-index`.
 * 
 * @accessibility
 * - Visual effect only; does not interfere with screen reader navigation.
 * - Consider providing a way to disable animations for users who prefer reduced motion.
 */
const ParallaxLayout: React.FC<ParallaxLayoutProps> = (rawProps) => {
  const logic = useParallaxLayoutLogic(rawProps);
  const styles = useParallaxLayoutStyle(logic);

  return (
    <div 
      style={{ ...styles.container, overflowY: 'auto', overflowX: 'hidden', perspective: '1px' } as React.CSSProperties} 
      {...logic.rest}
    >
      <div style={{ ...styles.header, transformStyle: 'preserve-3d', position: 'relative' } as React.CSSProperties}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transform: 'translateZ(-1px) scale(2)' }}>
          {logic.headerImage}
        </div>
      </div>
      <div style={{ ...styles.content, position: 'relative', zIndex: 1 } as React.CSSProperties}>
        {logic.children}
      </div>
    </div>
  );
};

export default ParallaxLayout;
