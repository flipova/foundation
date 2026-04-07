import React from 'react';
import { Modal, View, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import SnackPanel from '../SnackPanel';

interface SnackModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SnackModal: React.FC<SnackModalProps> = ({ visible, onClose }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <Pressable style={s.backdrop} onPress={onClose}>
      <Pressable style={s.panel} onPress={e => e.stopPropagation()}>
        <View style={s.closeRow}>
          <Pressable onPress={onClose} hitSlop={8}>
            <Feather name="x" size={14} color="#6a7494" />
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  panel: {
    width: 320,
    marginTop: 44,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0d1220',
    borderWidth: 1,
    borderColor: '#1a2240',
    maxHeight: '90%',
  },
  closeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
  },
});
