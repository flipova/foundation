import React from 'react';
import { useDividerLogic, DividerProps } from './Divider.logic';
import { useDividerStyle } from './Divider.style';

/**
 * @component Divider (Web)
 * @description A thin visual line used to separate content into distinct groups.
 * @useCases Separating list items, sections in a layout, or parts of a dropdown menu.
 * @structure A simple div element configured as a thin horizontal or vertical line based on orientation.
 * @accessibility Uses role="separator" and aria-orientation to convey its purpose to screen readers.
 */
const Divider: React.FC<DividerProps> = (rawProps) => {
  const logic = useDividerLogic(rawProps);
  const styles = useDividerStyle(logic);

  return (
    <div style={styles.container as React.CSSProperties} role="separator" aria-orientation={logic.orientation} {...logic.rest} />
  );
};

export default Divider;
