/**
 * ModalShell — Reusable modal wrapper.
 * Provides: overlay, card, header with title/icon/close, optional sidebar layout.
 */
import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { C } from './colors';

interface Props {
  visible?: boolean;
  title: string;
  icon?: React.ComponentProps<typeof Feather>['name'];
  iconColor?: string;
  onClose: () => void;
  /** Width as fraction of screen or fixed px */
  width?: string | number;
  height?: string | number;
  /** Extra content in the header row (right of title) */
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

const ModalShell: React.FC<Props> = ({
  visible = true,
  title,
  icon,
  iconColor = C.primary,
  onClose,
  width = '90%',
  height = '85%',
  headerRight,
  children,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={s.overlay}>
      <View style={[s.card, { width: width as any, height: height as any }]}>
        {/* Header */}
        <View style={s.header}>
          {icon && <Feather name={icon} size={16} color={iconColor} />}
          <Text style={s.title}>{title}</Text>
          {headerRight}
          <Pressable onPress={onClose} hitSlop={10} style={s.closeBtn}>
            <Feather name="x" size={18} color={C.muted} />
          </Pressable>
        </View>
        {children}
      </View>
    </View>
  </Modal>
);

export default ModalShell;

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  title: { color: C.text, fontSize: 15, fontWeight: '700', flex: 1 },
  closeBtn: { padding: 2 },
});
