import React from 'react';
import { Modal as RNModal, Pressable, Text, View } from 'react-native';
import { alertDialogRecipe, buttonRecipe, type AlertDialogProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function AlertDialog(p: AlertDialogProps) {
  const t = useResolvedTheme();
  const r = alertDialogRecipe(t);
  const cancel = buttonRecipe({ variant: 'outline' }, t);
  const confirm = buttonRecipe({ variant: p.destructive ? 'destructive' : 'default' }, t);
  return (
    <RNModal transparent animationType="fade" visible={p.visible} onRequestClose={p.onCancel} testID={p.testID}>
      <View style={r.backdrop as never}>
        <View accessibilityRole={'alertdialog' as never} aria-modal style={r.panel as never}>
          <Text accessibilityRole="header" style={r.title as never}>
            {p.title}
          </Text>
          {p.description ? <Text style={r.description as never}>{p.description}</Text> : null}
          <View style={r.actions as never}>
            <Pressable accessibilityRole="button" onPress={p.onCancel} style={cancel.container as never}>
              <Text style={cancel.label as never}>{p.cancelLabel ?? 'Cancel'}</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={p.onConfirm} style={confirm.container as never}>
              <Text style={confirm.label as never}>{p.confirmLabel ?? 'Confirm'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </RNModal>
  );
}
