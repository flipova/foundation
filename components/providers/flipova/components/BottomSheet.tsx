import React from 'react';
import { Modal as RNModal, Pressable, Text, View } from 'react-native';
import { sheetRecipe, type BottomSheetProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function BottomSheet({ visible, onClose, title, children, testID }: BottomSheetProps) {
  const t = useResolvedTheme();
  const r = sheetRecipe(t);
  return (
    <RNModal transparent animationType="slide" visible={visible} onRequestClose={onClose} testID={testID}>
      <Pressable accessibilityLabel="Close" onPress={onClose} style={r.backdrop as never}>
        <Pressable accessible={false} onPress={() => {}} style={r.panel as never}>
          <View style={r.handle as never} />
          {title ? (
            <Text accessibilityRole="header" style={r.title as never}>
              {title}
            </Text>
          ) : null}
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
