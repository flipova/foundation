import React from 'react';
import { Placeholder } from '../../Placeholder';
import { View, Pressable } from 'react-native';
import { useBottomDrawerLayoutLogic, BottomDrawerLayoutProps } from './BottomDrawerLayout.logic';
import { useBottomDrawerLayoutStyle } from './BottomDrawerLayout.style';

/**
 * @component BottomDrawerLayout
 * @description
 * BottomDrawerLayout provides a primary content area overlaid with a dismissible drawer
 * that slides up from the bottom of the screen.
 *
 * @useCases
 * - Displaying secondary contextual actions or menus.
 * - Presenting supplementary information without navigating away from the main screen.
 *
 * @structure
 * - A main content container (flex: 1).
 * - A semi-transparent overlay covering the screen when the drawer is open (captures taps to close).
 * - A bottom-anchored drawer container holding the drawer content.
 *
 * @accessibility
 * - The overlay acts as a dismiss button. It should properly describe its "close" action to screen readers.
 * - When open, focus should ideally be trapped within the drawer or immediately directed to it.
 */
const BottomDrawerLayout: React.FC<BottomDrawerLayoutProps> = (rawProps) => {
  const logic = useBottomDrawerLayoutLogic(rawProps);
  const styles = useBottomDrawerLayoutStyle(logic);

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

export default BottomDrawerLayout;
