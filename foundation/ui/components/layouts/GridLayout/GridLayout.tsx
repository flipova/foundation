import React from 'react';
import { Placeholder } from '../../Placeholder';
import { View } from 'react-native';
import { useGridLayoutLogic, GridLayoutProps } from './GridLayout.logic';
import { useGridLayoutStyle } from './GridLayout.style';

/**
 * A layout component that arranges its children into a responsive grid.
 * It uses flexWrap to break items into rows, calculating the item width based on the configured columns.
 * 
 * Use cases:
 * - Image galleries or product listings displaying items in a uniform grid.
 * - Dashboard cards layout.
 * 
 * Accessibility considerations:
 * - If representing a data grid, ensure proper accessibility roles (e.g., `role="grid"` on container, `role="gridcell"` on children).
 * - Consider the navigation flow (left-to-right, top-to-bottom) for screen readers.
 */
const GridLayout: React.FC<GridLayoutProps> = (rawProps) => {
  const logic = useGridLayoutLogic(rawProps);
  const styles = useGridLayoutStyle(logic);

  // Wrap children to apply the flexBasis correctly
  const wrappedChildren = React.Children.map(logic.children, (child, i) => (
    <View key={i} style={styles.item as any}>
      {child}
    </View>
  ));

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      {wrappedChildren}
    </View>
  );
};

export default GridLayout;
