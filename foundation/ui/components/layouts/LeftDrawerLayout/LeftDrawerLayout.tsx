import React from 'react';
import { Placeholder } from '../../Placeholder';
import { View, Pressable } from 'react-native';
import { useLeftDrawerLayoutLogic, LeftDrawerLayoutProps } from './LeftDrawerLayout.logic';
import { useLeftDrawerLayoutStyle } from './LeftDrawerLayout.style';

/**
 * A layout component that implements a standard left-side navigation drawer pattern.
 * It renders the main content and conditionally overlays a backdrop and sliding drawer.
 * 
 * Use cases:
 * - App-level global navigation menus.
 * - Sidebar filters for search results or e-commerce lists.
 * 
 * Accessibility considerations:
 * - When the drawer is open, screen readers should ideally be trapped within the drawer content.
 * - Ensure the backdrop `Pressable` provides a clear accessibilityLabel like "Close drawer" 
 *   and appropriate `accessibilityRole="button"`.
 */
const LeftDrawerLayout: React.FC<LeftDrawerLayoutProps> = (rawProps) => {
  const logic = useLeftDrawerLayoutLogic(rawProps);
  const styles = useLeftDrawerLayoutStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      {logic.children || <Placeholder label="children" />}
      {logic.isOpen && (
        <>
          <Pressable 
            style={styles.overlay as any} 
            onPress={logic.onClose} 
            accessibilityRole="button"
            accessibilityLabel="Close drawer"
          />
          <View style={styles.drawer as any}>
            {logic.drawer || <Placeholder label="drawer" />}
          </View>
        </>
      )}
    </View>
  );
};

export default LeftDrawerLayout;
