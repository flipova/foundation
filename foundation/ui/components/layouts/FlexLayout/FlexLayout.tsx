import React from 'react';
import { Placeholder } from '../../Placeholder';
import { View } from 'react-native';
import { useFlexLayoutLogic, FlexLayoutProps } from './FlexLayout.logic';
import { useFlexLayoutStyle } from './FlexLayout.style';

/**
 * A flexible layout component that arranges its children in a row or column.
 * It uses flexbox under the hood and allows configuring the primary axis 
 * and gap between elements.
 * 
 * Use cases:
 * - Simple linear arrangements of components (e.g., toolbars, lists).
 * - Distributing space evenly along a single axis.
 * 
 * Accessibility considerations:
 * - Make sure to pass appropriate accessibility labels to the underlying `View` if this layout serves a semantic purpose.
 */
const FlexLayout: React.FC<FlexLayoutProps> = (rawProps) => {
  const logic = useFlexLayoutLogic(rawProps);
  const styles = useFlexLayoutStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      {logic.children || <Placeholder label="children" />}
    </View>
  );
};

export default FlexLayout;
