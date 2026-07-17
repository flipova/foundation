import React from 'react';
import { useGradientLogic, GradientProps } from './Gradient.logic';
import { useGradientStyle } from './Gradient.style';

/**
 * Role: Provides a background with a linear color gradient.
 * UseCases: Used for stylistic backgrounds, buttons, or decorative containers.
 * Structure: A container element (`div`) that applies a CSS `linear-gradient` background using calculated angles and colors.
 * Accessibility: Purely decorative. Any text or interactive elements inside should maintain sufficient contrast against the gradient background.
 */
const Gradient: React.FC<GradientProps> = (rawProps) => {
  const logic = useGradientLogic(rawProps);
  const styles = useGradientStyle(logic);

  // Approximate start/end into a degree angle for web CSS
  let angle = '180deg';
  if (logic.start && logic.end) {
    const dx = logic.end.x - logic.start.x;
    const dy = logic.end.y - logic.start.y;
    angle = `${Math.atan2(dx, -dy) * (180 / Math.PI)}deg`;
  }

  const background = `linear-gradient(${angle}, ${logic.colors.join(', ')})`;

  return (
    <div style={{ ...styles.container, background, display: 'flex', flexDirection: 'column' } as React.CSSProperties} {...logic.rest}>
      {logic.children}
    </div>
  );
};

export default Gradient;
