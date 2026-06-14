import React from 'react';
import { Modal, View, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import SnackPanel from '../panels/SnackPanel';
import { colors, radius } from '../ds';

interface SnackModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SnackModal: React.FC<SnackModalProps> = ({ visible, onClose }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <Pressable style={s.backdrop} onPress={onClose}>
      <Pressable style={s.panel} onPress={e => e.stopPropagation()}>
        <View style={s.closeRow}>
          <Pressable onPress={onClose} hitSlop={8}>
            <Feather name="x" size={13} color={colors.muted} />
          </Pressable>
        </View>
        <SnackPanel />
      </Pressable>
    </Pressable>
  </Modal>
);

export default SnackModal;

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  panel: {
    width: 320,
    marginTop: 40,
    marginRight: 10,
    borderRadius: (radius?.md || 4),
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: '90%',
  },
  closeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
  },
});
