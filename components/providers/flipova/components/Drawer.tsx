import React from 'react';
import { Modal as RNModal, Pressable } from 'react-native';
import { drawerRecipe, type DrawerProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Drawer({ visible, onClose, side = 'left', children, testID }: DrawerProps) {
  const t = useResolvedTheme();
  const r = drawerRecipe(side, t);
  return (
    <RNModal transparent animationType="fade" visible={visible} onRequestClose={onClose} testID={testID}>
      <Pressable accessibilityLabel="Close" onPress={onClose} style={r.backdrop as never}>
        <Pressable accessible={false} onPress={() => {}} style={r.panel as never}>
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
