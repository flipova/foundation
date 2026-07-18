import React from 'react';
import { useSliderLogic, SliderProps } from './Slider.logic';
import { useSliderStyle } from './Slider.style';

/**
 * Role: Allows users to select a numeric value from a continuous or stepped range.
 * UseCases: Great for settings like volume control, brightness, or selecting a specific threshold value.
 * Structure: Renders a native `<input type="range">` layered transparently over custom DOM elements representing the track, fill, and thumb.
 * Accessibility: The native range input ensures full accessibility for screen readers and keyboard navigation (arrow keys).
 */
const Slider: React.FC<SliderProps> = (rawProps) => {
  const logic = useSliderLogic(rawProps);
  const styles = useSliderStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex', position: 'relative' } as React.CSSProperties} {...logic.rest}>
      <input
        type="range"
        min={logic.min}
        max={logic.max}
        step={logic.step}
        value={logic.value}
        onChange={(e) => logic.onValueChange?.(Number(e.target.value))}
        disabled={logic.disabled}
        style={{
          width: '100%',
          position: 'absolute',
          opacity: 0,
          cursor: logic.disabled ? 'not-allowed' : 'pointer',
          zIndex: 2,
          margin: 0,
          height: '100%',
        }}
      />
      <div style={styles.track as React.CSSProperties} />
      <div style={styles.fill as React.CSSProperties} />
      <div style={styles.thumb as React.CSSProperties} />
    </div>
  );
};

export default Slider;
