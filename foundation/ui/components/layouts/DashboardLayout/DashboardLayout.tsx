import React from 'react';
import { Placeholder } from '../../Placeholder';
import { View } from 'react-native';
import { useDashboardLayoutLogic, DashboardLayoutProps } from './DashboardLayout.logic';
import { useDashboardLayoutStyle } from './DashboardLayout.style';

/**
 * @component DashboardLayout
 * @description
 * DashboardLayout provides a classic web-style app layout, typically featuring a fixed 
 * vertical sidebar on the left and a top header spanning the remaining width.
 *
 * @useCases
 * - Admin panels or complex data-heavy applications.
 * - Navigation-heavy apps needing a persistent menu across all screens.
 *
 * @structure
 * - Outer container uses a row-based Flexbox layout.
 * - Left side: A sidebar with a fixed or dynamically provided width.
 * - Right side: A main content column (flex: 1).
 *   - Main column top: A header container.
 *   - Main column bottom: The primary scrolling children content.
 *
 * @accessibility
 * - Ensure logical tab-ordering from Sidebar -> Header -> Main Content.
 * - Wrap sidebar items in proper accessible touch targets.
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = (rawProps) => {
  const logic = useDashboardLayoutLogic(rawProps);
  const styles = useDashboardLayoutStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      <View style={styles.sidebarContainer as any}>
          {logic.sidebar || <Placeholder label="sidebar" />}
        </View>
      <View style={styles.mainContainer as any}>
        <View style={styles.headerContainer as any}>
            {logic.header || <Placeholder label="header" />}
          </View>
        <View style={{ flex: 1 }}>
          {logic.children || <Placeholder label="children" />}
        </View>
      </View>
    </View>
  );
};

export default DashboardLayout;
