/**
 * ModalShell — Reusable modal wrapper.
 * Palette: #000000 · #ffffff · #000091  |  Police: Lexend
 */
import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors as C, font, radius } from '../../ds';

interface Props {
  visible?: boolean;
  title: string;
  icon?: React.ComponentProps<typeof Feather>['name'];
  iconColor?: string;
  onClose: () => void;
  width?: string | number;
  height?: string | number;
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
          {icon && (
            <View style={[s.iconBadge, { backgroundColor: iconColor + '16' }]}>
              <Feather name={icon} size={13} color={iconColor} />
            </View>
          )}
          <Text style={s.title}>{title}</Text>
          {headerRight}
          <Pressable onPress={onClose} hitSlop={10} style={s.closeBtn}>
            <Feather name="x" size={16} color={C.muted} />
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
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: C.surface,
    borderRadius: (radius?.md || 4),
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    boxShadow: '0px 20px 40px rgba(0,0,0,0.6)' as any,
    elevation: 20,
  },
  iconBadge: {
    width: 24, height: 24, borderRadius: (radius?.xs || 2),
    alignItems: 'center', justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.bg,
  },
  title: {
    color: C.text,
    fontSize: (font?.size?.md || 12),
    fontWeight: (font?.weight?.semi || '500'),
    fontFamily: (font?.family || 'Lexend'),
    flex: 1,
  },
  closeBtn: { padding: 2 },
});
