import React from 'react';
import { Modal as RNModal, Pressable, Text } from 'react-native';
import { sheetRecipe, type ActionSheetProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function ActionSheet({ visible, onClose, title, actions, cancelLabel = 'Cancel', testID }: ActionSheetProps) {
  const t = useResolvedTheme();
  const r = sheetRecipe(t);
  return (
    <RNModal transparent animationType="slide" visible={visible} onRequestClose={onClose} testID={testID}>
      <Pressable accessibilityLabel="Close" onPress={onClose} style={r.backdrop as never}>
        <Pressable accessible={false} onPress={() => {}} style={r.panel as never}>
          {title ? <Text style={r.title as never}>{title}</Text> : null}
          {actions.map((a) => (
            <Pressable
              key={a.key}
              accessibilityRole="button"
              onPress={() => {
                onClose?.();
                a.onPress?.();
              }}
              style={r.action as never}
            >
              <Text style={r.actionLabel(!!a.destructive) as never}>{a.label}</Text>
            </Pressable>
          ))}
          <Pressable accessibilityRole="button" onPress={onClose} style={r.cancel as never}>
            <Text style={r.cancelLabel as never}>{cancelLabel}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
