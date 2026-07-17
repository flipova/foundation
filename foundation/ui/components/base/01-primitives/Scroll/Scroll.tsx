import React from 'react';
import { ScrollView } from 'react-native';
import { useScrollLogic, ScrollProps } from './Scroll.logic';
import { useScrollStyle } from './Scroll.style';

/**
 * `Scroll` is a layout primitive that enables scrolling for content that exceeds 
 * the visible bounds of its container.
 * 
 * **Role:**
 * Provides a scrollable viewport for displaying large amounts of content or lists
 * without specialized virtualization (use FlatList for large lists instead).
 * 
 * **Use cases:**
 * - Wrapping screens or forms that may overflow on smaller devices.
 * - Horizontal carousels of items.
 * - Adding scrollability to modal dialog bodies.
 * 
 * **Structure:**
 * A thin wrapper around React Native's `ScrollView`. Configured to hide scroll
 * indicators by default for a cleaner aesthetic.
 * 
 * **Accessibility:**
 * Inherits standard ScrollView accessibility. Ensure content within the Scroll
 * remains accessible and reachable via screen readers.
 */
const Scroll: React.FC<ScrollProps> = (rawProps) => {
  const logic = useScrollLogic(rawProps);
  const styles = useScrollStyle(logic);

  return (
    <ScrollView 
      style={[styles.container as any, logic.rest.style]} 
      horizontal={logic.horizontal}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      {...logic.rest}
    >
      {logic.children}
    </ScrollView>
  );
};

export default React.memo(Scroll);
