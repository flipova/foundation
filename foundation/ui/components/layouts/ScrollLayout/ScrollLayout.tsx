import React from 'react';
import { Placeholder } from '../../Placeholder';
import { ScrollView } from 'react-native';
import { useScrollLayoutLogic, ScrollLayoutProps } from './ScrollLayout.logic';
import { useScrollLayoutStyle } from './ScrollLayout.style';

/**
 * ScrollLayout is a generic layout providing a scrollable region.
 * It can scroll either vertically (default) or horizontally based on its properties.
 * Ideal for lists, forms, or any content that might exceed screen bounds.
 * 
 * Accessibility considerations:
 * - ScrollViews inherently support scrolling semantics. 
 * - If horizontal, ensure it can be navigated via keyboard or screen reader horizontal scroll actions.
 */
const ScrollLayout: React.FC<ScrollLayoutProps> = (rawProps) => {
  const logic = useScrollLayoutLogic(rawProps);
  const styles = useScrollLayoutStyle(logic);

  return (
    <ScrollView 
      style={[styles.container as any, logic.rest.style]} 
      horizontal={logic.horizontal}
      {...logic.rest}
    >
      {logic.children || <Placeholder label="children" />}
    </ScrollView>
  );
};

export default ScrollLayout;
