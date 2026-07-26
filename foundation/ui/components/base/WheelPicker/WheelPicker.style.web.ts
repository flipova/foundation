/**
 * WheelPicker.style — Web variant
 *
 * Returns plain React.CSSProperties instead of React Native StyleSheet.
 * useTheme is platform-agnostic.
 */

import { useMemo } from 'react';
import { useTheme } from '../../../../theme/providers/ThemeProvider';

export function useWheelPickerStyle(logic: any) {
  const { theme } = useTheme();

  return useMemo(() => ({
    container: {
      height: logic.itemHeight * 5,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: theme?.background ?? '#ffffff',
      borderRadius: 12,
      border: `1px solid ${theme?.border ?? '#e5e7eb'}`,
      position: 'relative',
      userSelect: 'none',
    } as React.CSSProperties,

    scrollView: {
      flex: 1,
      overflowY: 'auto',
      scrollSnapType: 'y mandatory',
      /* Hide scrollbar visually while keeping it functional */
      scrollbarWidth: 'none',
    } as React.CSSProperties,

    itemContainer: {
      height: logic.itemHeight,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 16,
      paddingRight: 16,
      scrollSnapAlign: 'center',
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      width: '100%',
    } as React.CSSProperties,

    itemText: {
      fontSize: 18,
      fontWeight: '500',
      color: theme?.foreground ?? '#111827',
      textAlign: 'center',
      pointerEvents: 'none',
    } as React.CSSProperties,

    activeHighlight: {
      position: 'absolute',
      top: logic.itemHeight * 2,
      left: 12,
      right: 12,
      height: logic.itemHeight,
      backgroundColor: theme?.muted ?? 'rgba(0, 0, 0, 0.05)',
      borderRadius: 8,
      pointerEvents: 'none',
    } as React.CSSProperties,

    /** Overlay backdrop for the submenu dialog */
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 1000,
    } as React.CSSProperties,

    modalContent: {
      backgroundColor: theme?.background ?? '#ffffff',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      width: '100%',
      maxWidth: 600,
      maxHeight: '80vh',
      overflowY: 'auto',
      paddingBottom: 32,
      boxShadow: '0 -4px 24px rgba(0,0,0,0.10)',
    } as React.CSSProperties,

    modalHeader: {
      padding: 20,
      borderBottom: `1px solid ${theme?.border ?? '#e5e7eb'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    } as React.CSSProperties,

    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme?.foreground ?? '#111827',
    } as React.CSSProperties,

    submenuItem: {
      paddingTop: 16,
      paddingBottom: 16,
      paddingLeft: 24,
      paddingRight: 24,
      borderBottom: `1px solid ${theme?.border ?? '#f3f4f6'}`,
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      width: '100%',
      textAlign: 'left',
    } as React.CSSProperties,

    submenuItemActive: {
      backgroundColor: theme?.muted ?? '#f9fafb',
    } as React.CSSProperties,

    submenuItemText: {
      fontSize: 16,
      color: theme?.foreground ?? '#374151',
    } as React.CSSProperties,

    submenuItemTextActive: {
      color: theme?.primary ?? '#3b82f6',
      fontWeight: '700',
    } as React.CSSProperties,
  }), [logic.itemHeight, theme]);
}
