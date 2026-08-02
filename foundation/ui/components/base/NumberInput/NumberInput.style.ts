import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useNumberInputStyle(logic: any) {
  const { theme } = useTheme();

  return useMemo(() => {
    let borderColor = theme?.border || '#e5e7eb';
    if (logic.error) borderColor = theme?.destructive || '#ef4444';
    else if (logic.isFocused) borderColor = theme?.ring || theme?.primary || '#3b82f6';

    return StyleSheet.create({
      wrapper: {
        marginBottom: logic.error ? 4 : 0,
      },
      container: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: borderColor, 
        borderRadius: 8, 
        overflow: 'hidden',
        backgroundColor: theme?.background || '#ffffff',
      },
      button: { 
        paddingVertical: 12, 
        paddingHorizontal: 16,
        backgroundColor: theme?.muted || '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonPressed: {
        backgroundColor: theme?.border || '#e5e7eb',
      },
      buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: theme?.foreground || '#111827',
      },
      input: { 
        flex: 1, 
        textAlign: 'center', 
        fontSize: 16,
        color: theme?.foreground || '#111827',
        paddingVertical: 10,
        backgroundColor: 'transparent',
      },
      errorText: {
        color: theme?.destructive || '#ef4444',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
      }
    });
  }, [logic.error, logic.isFocused, theme]);
}
