import React from 'react';
import { useSketchLayoutLogic, SketchLayoutProps } from './SketchLayout.logic';
import { useSketchLayoutStyle } from './SketchLayout.style';

/**
 * @component SketchLayout (Web)
 * @description
 * An infinite canvas or drawing board layout providing an extensive scrollable area.
 * 
 * @role layout
 * @useCases 
 * - Whiteboards, diagram editors, and mind-mapping tools.
 * - Freeform drag-and-drop interfaces on a large virtual canvas.
 * 
 * @structure
 * - A constrained outer container with `overflow: auto`.
 * - An inner container significantly larger than the viewport (e.g., `200vw`, `200vh`) to allow free movement.
 * 
 * @accessibility
 * - Highly visual interfaces typically require complex keyboard navigation alternatives.
 * - Ensure interactive elements placed on the canvas are accessible via standard keyboard focus order.
 */
const SketchLayout: React.FC<SketchLayoutProps> = (rawProps) => {
  const logic = useSketchLayoutLogic(rawProps);
  const styles = useSketchLayoutStyle(logic);

  return (
    <div 
      style={{ ...styles.container, overflow: 'auto', width: '100%', height: '100%' } as React.CSSProperties} 
    >
      <div style={{ ...logic.rest.style, minWidth: '200vw', minHeight: '200vh' } as React.CSSProperties} {...logic.rest}>
        {logic.children}
      </div>
    </div>
  );
};

export default SketchLayout;
