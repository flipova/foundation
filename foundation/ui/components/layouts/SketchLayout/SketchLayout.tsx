import React from 'react';
import { Placeholder } from '../../Placeholder';
import { ScrollView, View } from 'react-native';
import { useSketchLayoutLogic, SketchLayoutProps } from './SketchLayout.logic';
import { useSketchLayoutStyle } from './SketchLayout.style';

/**
 * SketchLayout creates a 2D scrollable canvas area (both horizontally and vertically).
 * It nests a vertical ScrollView inside a horizontal ScrollView to achieve an "infinite canvas" feel.
 * Useful for drawing apps, large diagrams, or highly extensive data tables.
 * 
 * Accessibility considerations:
 * - Nested scroll views can be difficult to navigate for keyboard-only or screen reader users.
 * - Ensure critical content can be accessed without complex 2D scrolling if possible.
 */
const SketchLayout: React.FC<SketchLayoutProps> = (rawProps) => {
  const logic = useSketchLayoutLogic(rawProps);
  const styles = useSketchLayoutStyle(logic);

  return (
    <ScrollView horizontal style={styles.container as any}>
      <ScrollView>
        <View style={logic.rest.style} {...logic.rest}>
          {logic.children || <Placeholder label="children" />}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

export default SketchLayout;
