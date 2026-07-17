import React from 'react';
import { View } from 'react-native';
import { useCenterLogic, CenterProps } from './Center.logic';
import { useCenterStyle } from './Center.style';

/**
 * `Center` is a layout primitive used to automatically center its children
 * along both the horizontal and vertical axes.
 * 
 * **Role:**
 * Simplifies the frequent task of perfectly centering content within a view.
 * 
 * **Use cases:**
 * - Displaying a loading spinner in the middle of the screen.
 * - Centering an icon or text inside a button or badge.
 * - Creating placeholder screens (like 'No Data').
 * 
 * **Structure:**
 * Wraps children in a React Native `View` with predefined flexbox alignment
 * rules (`justifyContent: 'center'` and `alignItems: 'center'`).
 * 
 * **Accessibility:**
 * Inherits standard View accessibility behaviors. Does not impart any specialized
 * semantic meaning beyond layout.
 */
const Center: React.FC<CenterProps> = (rawProps) => {
  const logic = useCenterLogic(rawProps);
  const styles = useCenterStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      {logic.children}
    </View>
  );
};

export default React.memo(Center);
