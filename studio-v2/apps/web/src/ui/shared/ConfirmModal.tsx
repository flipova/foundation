/**
 * ConfirmModal — Simple confirmation dialog for irreversible actions.
 *
 * Requirements: 16.5
 */
import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

import { colors as C } from '../ds';

const ConfirmModal: React.FC<Props> = ({
  visible,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  destructive = false,
  onConfirm,
  onCancel,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <Pressable style={s.overlay} onPress={onCancel}>
      <Pressable style={s.dialog} onPress={e => e.stopPropagation()}>
        <View style={s.header}>
          <Feather
            name={destructive ? 'alert-triangle' : 'help-circle'}
            size={18}
            color={destructive ? C.error : C.primary}
          />
          <Text style={s.title}>{title}</Text>
        </View>
        <Text style={s.message}>{message}</Text>
        <View style={s.actions}>
          <Pressable style={s.cancelBtn} onPress={onCancel}>
            <Text style={s.cancelText}>{cancelLabel}</Text>
          </Pressable>
          <Pressable
            style={[s.confirmBtn, destructive && s.confirmBtnDestructive]}
            onPress={onConfirm}
          >
            <Text style={[s.confirmText, destructive && s.confirmTextDestructive]}>
              {confirmLabel}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Pressable>
  </Modal>
);

export default ConfirmModal;

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialog: {
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    padding: 20,
    width: 300,
    gap: 12,
    boxShadow: '0px 4px 12px rgba(0,0,0,0.4)' as any,
    elevation: 12,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { color: C.text, fontSize: 14, fontWeight: '700', flex: 1 },
  message: { color: C.muted, fontSize: 12, lineHeight: 18 },
  actions: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end', marginTop: 4 },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  cancelText: { color: C.muted, fontSize: 12, fontWeight: '500' },
  confirmBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: C.primary,
  },
  confirmBtnDestructive: { backgroundColor: C.error },
  confirmText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  confirmTextDestructive: { color: '#fff' },
});


