import React from 'react';
import { Placeholder } from '../../Placeholder';
import { View } from 'react-native';
import { useSidebarLayoutLogic, SidebarLayoutProps } from './SidebarLayout.logic';
import { useSidebarLayoutStyle } from './SidebarLayout.style';

/**
 * SidebarLayout provides a two-pane layout featuring a collapsible or fixed sidebar next to a main content area.
 * It allows positioning the sidebar on either the left or right side.
 * Ideal for navigation drawers or secondary tools panels alongside primary content.
 * 
 * Accessibility considerations:
 * - Ensure that the sidebar area is appropriately landmarked (e.g. role="navigation" or "complementary").
 * - Focus management should handle transitioning between sidebar and main content if the sidebar is toggled.
 */
const SidebarLayout: React.FC<SidebarLayoutProps> = (rawProps) => {
  const logic = useSidebarLayoutLogic(rawProps);
  const styles = useSidebarLayoutStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      <View style={styles.sidebarContainer as any}>
          {logic.sidebar || <Placeholder label="sidebar" />}
        </View>
      <View style={styles.mainContainer as any}>
        {logic.children || <Placeholder label="children" />}
      </View>
    </View>
  );
};

export default SidebarLayout;
