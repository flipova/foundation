import React from 'react';
import { Placeholder } from '../../Placeholder';
import { View, Pressable } from 'react-native';
import { useTopDrawerLayoutLogic, TopDrawerLayoutProps } from './TopDrawerLayout.logic';
import { useTopDrawerLayoutStyle } from './TopDrawerLayout.style';

/**
 * @component TopDrawerLayout
 * @description A layout providing a slide-down or overlay drawer from the top of the screen.
 * Useful for global menus, notifications, or settings panels.
 * @accessibility
 * - The overlay acts as a Pressable to close the drawer and includes an accessibilityRole and label.
 * - Drawer content can be read by screen readers when active.
 */
const TopDrawerLayout: React.FC<TopDrawerLayoutProps> = (rawProps) => {
  const logic = useTopDrawerLayoutLogic(rawProps);
  const styles = useTopDrawerLayoutStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      {logic.children || <Placeholder label="children" />}
      {logic.isOpen && (
        <>
          <Pressable 
            style={styles.overlay as any} 
            onPress={logic.onClose} 
            accessibilityRole="button"
            accessibilityLabel="Close Drawer"
          />
          <View style={styles.drawer as any}>
            {logic.drawer || <Placeholder label="drawer" />}
          </View>
        </>
      )}
    </View>
  );
};

export default TopDrawerLayout;
