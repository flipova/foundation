import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useWheelPickerStyle(logic: any) {
  const { theme } = useTheme();

  return useMemo(() => StyleSheet.create({
    container: {
      height: logic.itemHeight * 5, 
      overflow: 'hidden',
      justifyContent: 'center',
      backgroundColor: theme?.background || '#ffffff',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme?.border || '#e5e7eb',
    },
    scrollView: {
      flex: 1,
    },
    itemContainer: {
      height: logic.itemHeight,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    itemText: {
      fontSize: 18,
      fontWeight: '500',
      color: theme?.foreground || '#111827',
      textAlign: 'center',
    },
    activeHighlight: {
      position: 'absolute',
      top: logic.itemHeight * 2, 
      left: 12,
      right: 12,
      height: logic.itemHeight,
      backgroundColor: theme?.muted || 'rgba(0, 0, 0, 0.05)',
      borderRadius: 8,
      pointerEvents: 'none', 
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme?.background || '#ffffff',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '80%',
      paddingBottom: 32,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 10,
    },
    modalHeader: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme?.border || '#e5e7eb',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme?.foreground || '#111827',
    },
    submenuItem: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderBottomColor: theme?.border || '#f3f4f6',
    },
    submenuItemActive: {
      backgroundColor: theme?.muted || '#f9fafb',
    },
    submenuItemPressed: {
      backgroundColor: theme?.border || '#e5e7eb',
    },
    submenuItemText: {
      fontSize: 16,
      color: theme?.foreground || '#374151',
    },
    submenuItemTextActive: {
      color: theme?.primary || '#3b82f6',
      fontWeight: '700',
    }
  }), [logic.itemHeight, theme]);
}
