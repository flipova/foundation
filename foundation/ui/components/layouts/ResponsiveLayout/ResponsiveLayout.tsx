import React from 'react';
import { Placeholder } from '../../Placeholder';
import { View } from 'react-native';
import { useResponsiveLayoutLogic, ResponsiveLayoutProps } from './ResponsiveLayout.logic';
import { useResponsiveLayoutStyle } from './ResponsiveLayout.style';

/**
 * ResponsiveLayout automatically adjusts its flex direction based on the current window width.
 * It switches between a column layout for narrow screens (e.g., mobile) and a row layout for wider screens (e.g., desktop/tablet).
 * Useful for building adaptive user interfaces without explicit media queries.
 * 
 * Accessibility considerations:
 * - Order of children is preserved. Ensure logical focus order makes sense in both row and column orientations.
 */
const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = (rawProps) => {
  const logic = useResponsiveLayoutLogic(rawProps);
  const styles = useResponsiveLayoutStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      {logic.children || <Placeholder label="children" />}
    </View>
  );
};

export default ResponsiveLayout;
