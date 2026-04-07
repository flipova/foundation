/**
 * Toast — Lightweight feedback notification.
 *
 * Usage:
 *   const { showToast } = useToast();
 *   showToast({ type: 'success', message: 'Projet généré avec succès !' });
 *   showToast({ type: 'error', message: 'Échec de la génération', cause: 'Erreur réseau', action: 'Vérifiez votre connexion.' });
 *
 * Requirements: 16.2, 16.3
 */
import React, { createContext, useContext, useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ToastOptions {
  /** 'success' shows a green badge for 2000ms; 'error' shows a red message */
  type: 'success' | 'error';
  /** Main message text */
  message: string;
  /** Optional cause description (error only) */
  cause?: string;
  /** Optional corrective action hint (error only) */
  action?: string;
  /** Duration in ms — defaults to 2000 for success, 4000 for error */
  duration?: number;
}

interface ToastContextValue {
  showToast: (opts: ToastOptions) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast(): ToastContextValue {
  return useContext(ToastContext);
}

// ---------------------------------------------------------------------------
// ToastItem — single animated notification
// ---------------------------------------------------------------------------

interface ToastItem extends ToastOptions {
  id: number;
}

const TOAST_DURATION_SUCCESS = 2000;
const TOAST_DURATION_ERROR = 4000;

const C = {
  success: '#22c55e',
  successBg: 'rgba(34,197,94,0.12)',
  successBorder: 'rgba(34,197,94,0.3)',
  error: '#ef4444',
  errorBg: 'rgba(239,68,68,0.12)',
  errorBorder: 'rgba(239,68,68,0.3)',
  text: '#d0d8f0',
  muted: '#6a7494',
  surface: '#131a2e',
};

const ToastItemView: React.FC<{ item: ToastItem; onDone: (id: number) => void }> = ({ item, onDone }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;

  React.useEffect(() => {
    const duration = item.duration ?? (item.type === 'success' ? TOAST_DURATION_SUCCESS : TOAST_DURATION_ERROR);

    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -12, duration: 200, useNativeDriver: true }),
        ]).start(() => onDone(item.id));
      }, duration);
    });
  }, []);

  const isSuccess = item.type === 'success';
  const color = isSuccess ? C.success : C.error;
  const bg = isSuccess ? C.successBg : C.errorBg;
  const border = isSuccess ? C.successBorder : C.errorBorder;
  const icon: React.ComponentProps<typeof Feather>['name'] = isSuccess ? 'check-circle' : 'alert-circle';

  return (
    <Animated.View style={[s.toast, { backgroundColor: bg, borderColor: border, opacity, transform: [{ translateY }] }]}>
      <Feather name={icon} size={14} color={color} style={s.icon} />
      <View style={s.content}>
        <Text style={[s.message, { color }]}>{item.message}</Text>
        {!isSuccess && item.cause && (
          <Text style={s.cause}>{item.cause}</Text>
        )}
        {!isSuccess && item.action && (
          <Text style={s.actionHint}>{item.action}</Text>
        )}
      </View>
    </Animated.View>
  );
};

// ---------------------------------------------------------------------------
// ToastProvider — wraps the app, renders toasts in a portal-like overlay
// ---------------------------------------------------------------------------

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const showToast = useCallback((opts: ToastOptions) => {
    const id = ++nextId.current;
    setToasts(prev => [...prev, { ...opts, id }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Overlay container — positioned at top-right */}
      <View style={s.container} pointerEvents="none">
        {toasts.map(t => (
          <ToastItemView key={t.id} item={t} onDone={remove} />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const s = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 52,
    right: 16,
    zIndex: 9999,
    gap: 8,
    alignItems: 'flex-end',
    // Web: pointer-events none so toasts don't block clicks
    ...(Platform.OS === 'web' ? { pointerEvents: 'none' as any } : {}),
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxWidth: 320,
    gap: 8,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  icon: { marginTop: 1, flexShrink: 0 },
  content: { flex: 1, gap: 2 },
  message: { fontSize: 12, fontWeight: '600', lineHeight: 16 },
  cause: { color: C.muted, fontSize: 10, lineHeight: 14 },
  actionHint: { color: C.text, fontSize: 10, lineHeight: 14, fontStyle: 'italic' },
});

// ---------------------------------------------------------------------------
// Exported text constants for tests
// ---------------------------------------------------------------------------

export const TOAST_TEXTS = {
  successDuration: TOAST_DURATION_SUCCESS,
  errorDuration: TOAST_DURATION_ERROR,
} as const;
