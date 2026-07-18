import React from 'react';
import { Placeholder } from '../../Placeholder';
import { View } from 'react-native';
import { useMasonryLayoutLogic, MasonryLayoutProps } from './MasonryLayout.logic';
import { useMasonryLayoutStyle } from './MasonryLayout.style';

/**
 * A layout component that arranges children into a Masonry (Pinterest-style) grid.
 * It distributes items iteratively across the specified number of columns.
 * 
 * Use cases:
 * - Displaying lists of images or cards of varying heights.
 * - News feeds with varying length content snippets.
 * 
 * Accessibility considerations:
 * - Depending on the reading order, visually, items are read down a column before moving to the next.
 * - Consider if a screen reader user needs to read items row-by-row instead. If so, a standard grid layout might be preferred, or `tabIndex` / `accessibilityOrder` might need adjustment.
 */
const MasonryLayout: React.FC<MasonryLayoutProps> = (rawProps) => {
  const logic = useMasonryLayoutLogic(rawProps);
  const styles = useMasonryLayoutStyle(logic);

  // Distribute children into columns
  const cols = Array.from({ length: logic.columns }, () => [] as React.ReactNode[]);
  React.Children.forEach(logic.children, (child, i) => {
    cols[i % logic.columns].push(child);
  });

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      {cols.map((col, i) => (
        <View key={i} style={styles.column as any}>
          {col}
        </View>
      ))}
    </View>
  );
};

export default MasonryLayout;
