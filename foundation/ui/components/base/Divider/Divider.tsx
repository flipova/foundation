import React from 'react';
import { View } from 'react-native';
import { useDividerLogic, DividerProps } from './Divider.logic';
import { useDividerStyle } from './Divider.style';

/**
 * A visual separator used to distinguish between different content sections.
 * 
 * @description
 * The Divider component renders a thin line (horizontal or vertical) to visually break up
 * lists, layouts, or distinct conceptual areas of a screen.
 * 
 * @useCases
 * - Separating items in a list or menu.
 * - Dividing the header from the main body content.
 * - Creating clear visual boundaries in dense data displays.
 * 
 * @structure
 * - Wraps a simple styled `View` that manages its dimensions based on orientation and thickness.
 * 
 * @accessibility
 * - Dividers are typically decorative. Consider applying `accessible={false}` and `importantForAccessibility="no"` 
 *   so they are ignored by screen readers, unless they signify a semantic break that should be announced.
 */
const Divider: React.FC<DividerProps> = (rawProps) => {
  const logic = useDividerLogic(rawProps);
  const styles = useDividerStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest} />
  );
};

export default Divider;
