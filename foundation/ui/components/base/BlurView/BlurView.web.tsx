import React from 'react';
import { useBlurViewLogic, BlurViewProps } from './BlurView.logic';
import { useBlurViewStyle } from './BlurView.style';

/**
 * @component BlurView (Web)
 * @description A view that applies a visual blur effect to the content behind it using CSS backdrop-filter.
 * @useCases Ideal for creating glassmorphism effects, overlays, modals, or floating navigation bars.
 * @structure A container div that applies backdrop-filter and semi-transparent background colors based on tint.
 * @accessibility Background blurs should not obscure critical information, and sufficient contrast should be maintained for overlaid text.
 */
const BlurView: React.FC<BlurViewProps> = (rawProps) => {
  const logic = useBlurViewLogic(rawProps);
  const styles = useBlurViewStyle(logic);

  let bgColor = 'rgba(255, 255, 255, 0.2)';
  if (logic.tint === 'dark') bgColor = 'rgba(0, 0, 0, 0.4)';
  else if (logic.tint === 'light') bgColor = 'rgba(255, 255, 255, 0.6)';

  return (
    <div 
      style={{
        ...styles.container,
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: `blur(${logic.intensity / 5}px)`,
        WebkitBackdropFilter: `blur(${logic.intensity / 5}px)`,
        backgroundColor: bgColor,
      } as React.CSSProperties} 
      {...logic.rest}
    >
      {logic.children}
    </div>
  );
};

export default BlurView;
