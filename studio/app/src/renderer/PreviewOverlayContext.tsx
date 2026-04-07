/**
 * PreviewOverlayContext
 * Provides toast, alert dialog, and modal state for the canvas preview.
 * NodeRenderer calls these instead of Alert.alert (which doesn't work on web).
 */
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ToastEntry {
  id: number;
  message: string;
  variant: 'success' | 'error' | 'info' | 'warning';
}

export interface AlertEntry {
  title: string;
  message: string;
  resolve: () => void;
}

interface OverlayCtx {
  showToast: (message: string, variant?: ToastEntry['variant']) => void;
  showAlert: (title: string, message: string) => void;
  openModal: (name: string) => void;
  closeModal: (name: string) => void;
  isModalOpen: (name: string) => boolean;
}

const Ctx = createContext<OverlayCtx | null>(null);
export const usePreviewOverlay = () => useContext(Ctx);

// ─── Toast colors ─────────────────────────────────────────────────────────────
const VARIANT_COLORS: Record<ToastEntry['variant'], { bg: string; icon: React.ComponentProps<typeof Feather>['name']; border: string }> = {
  success: { bg: '#052e16', icon: 'check-circle', border: '#16a34a' },
  error:   { bg: '#2d0a0a', icon: 'alert-circle',  border: '#dc2626' },
  warning: { bg: '#2d1a00', icon: 'alert-triangle', border: '#d97706' },
  info:    { bg: '#0a1628', icon: 'info',            border: '#3b82f6' },
};

// ─── Toast item ───────────────────────────────────────────────────────────────
const Toast: React.FC<{ entry: ToastEntry; onDone: (id: number) => void }> = ({ entry, onDone }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const v = VARIANT_COLORS[entry.variant] || VARIANT_COLORS.info;

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2600),
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => onDone(entry.id));
  }, []);

  return (
    <Animated.View style={[s.toast, { backgroundColor: v.bg, borderColor: v.border, opacity }]}>
      <Feather name={v.icon} size={13} color={v.border} />
      <Text style={[s.toastTxt, { color: v.border }]} numberOfLines={2}>{entry.message}</Text>
    </Animated.View>
  );
};

// ─── Alert dialog ─────────────────────────────────────────────────────────────
const AlertDialog: React.FC<{ entry: AlertEntry }> = ({ entry }) => (
  <View style={s.alertOverlay}>
    <View style={s.alertBox}>
      <Text style={s.alertTitle}>{entry.title}</Text>
      {!!entry.message && <Text style={s.alertMsg}>{entry.message}</Text>}
      <Pressable style={s.alertBtn} onPress={entry.resolve}>
        <Text style={s.alertBtnTxt}>OK</Text>
      </Pressable>
    </View>
  </View>
);

// ─── Provider ─────────────────────────────────────────────────────────────────
let _nextId = 1;

export const PreviewOverlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const [alert, setAlert] = useState<AlertEntry | null>(null);
  const [openModals, setOpenModals] = useState<Set<string>>(new Set());

  const showToast = useCallback((message: string, variant: ToastEntry['variant'] = 'info') => {
    const id = _nextId++;
    setToasts(t => [...t, { id, message, variant }]);
  }, []);

  const showAlert = useCallback((title: string, message: string) => {
    setAlert({ title, message, resolve: () => setAlert(null) });
  }, []);

  const openModal = useCallback((name: string) => {
    setOpenModals(s => new Set([...s, name]));
  }, []);

  const closeModal = useCallback((name: string) => {
    setOpenModals(s => { const n = new Set(s); n.delete(name); return n; });
  }, []);

  const isModalOpen = useCallback((name: string) => openModals.has(name), [openModals]);

  const removeDoneToast = useCallback((id: number) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  return (
    <Ctx.Provider value={{ showToast, showAlert, openModal, closeModal, isModalOpen }}>
      {children}

      {/* Toast stack — bottom of canvas */}
      <View style={s.toastStack} pointerEvents="none">
        {toasts.map(t => <Toast key={t.id} entry={t} onDone={removeDoneToast} />)}
      </View>

      {/* Alert dialog */}
      {alert && <AlertDialog entry={alert} />}

      {/* Modal overlays — one per open modal name */}
      {[...openModals].map(name => (
        <View key={name} style={s.modalOverlay}>
          <View style={s.modalBox}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{name}</Text>
              <Pressable onPress={() => closeModal(name)} hitSlop={8}>
                <Feather name="x" size={16} color="#6a7494" />
              </Pressable>
            </View>
            <Text style={s.modalHint}>Modal "{name}" ouvert depuis le preview</Text>
          </View>
        </View>
      ))}
    </Ctx.Provider>
  );
};

const s = StyleSheet.create({
  // Toasts
  toastStack: {
    position: 'absolute', bottom: 24, left: 12, right: 12,
    gap: 6, alignItems: 'stretch', zIndex: 9999,
  },
  toast: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 12, paddingVertical: 9,
    borderRadius: 8, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  toastTxt: { flex: 1, fontSize: 12, fontWeight: '500', lineHeight: 16 },
  // Alert
  alertOverlay: {
    position: 'absolute', inset: 0 as any,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center', justifyContent: 'center', zIndex: 9998,
  },
  alertBox: {
    width: 270, backgroundColor: '#1a2240', borderRadius: 14,
    borderWidth: 1, borderColor: '#2a3460', padding: 20, gap: 8,
  },
  alertTitle: { color: '#d0d8f0', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  alertMsg: { color: '#8a94b0', fontSize: 13, textAlign: 'center', lineHeight: 18 },
  alertBtn: {
    marginTop: 8, backgroundColor: '#3b82f6', borderRadius: 8,
    paddingVertical: 9, alignItems: 'center',
  },
  alertBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '600' },
  // Modal
  modalOverlay: {
    position: 'absolute', inset: 0 as any,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center', zIndex: 9997,
  },
  modalBox: {
    width: '85%', maxWidth: 320, backgroundColor: '#0d1220',
    borderRadius: 16, borderWidth: 1, borderColor: '#1a2240',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#1a2240',
  },
  modalTitle: { color: '#d0d8f0', fontSize: 15, fontWeight: '600' },
  modalHint: { color: '#4a5470', fontSize: 11, padding: 16, textAlign: 'center' },
});
