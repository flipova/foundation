import React from 'react';
import { Modal as RNModal, Pressable, Text } from 'react-native';
import { modalRecipe, type ModalProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Modal(p: ModalProps) {
  const t = useResolvedTheme();
  const r = modalRecipe(p, t);
  return (
    <RNModal transparent animationType="fade" visible={p.visible} onRequestClose={p.onClose} testID={p.testID}>
      <Pressable accessibilityLabel="Close" onPress={p.onClose} style={r.backdrop as never}>
        {/* a press inside the panel must not reach the backdrop */}
        <Pressable accessible={false} onPress={() => {}} style={r.panel as never}>
          {p.title ? (
            <Text accessibilityRole="header" style={r.title as never}>
              {p.title}
            </Text>
          ) : null}
          {p.children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
