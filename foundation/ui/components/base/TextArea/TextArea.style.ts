import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useTextAreaStyle(logic: any) {
  const { theme } = useTheme();
  
  let borderColor = theme?.border || '#e5e7eb';
  if (logic.error) borderColor = theme?.destructive || '#ef4444';
  else if (logic.isFocused) borderColor = theme?.ring || theme?.primary || '#3b82f6';

  const baseMinHeight = logic.lines * 20 + 20;

  return {
    baseMinHeight,
    container: {
      marginBottom: logic.error ? 4 : 0,
    },
    inputWrapper: {
      backgroundColor: theme?.background || '#ffffff',
      borderColor: borderColor,
      borderWidth: 1,
      borderRadius: 8,
      overflow: 'hidden' as const,
      opacity: logic.disabled ? 0.5 : 1,
    },
    input: {
      flex: 1,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: theme?.foreground || '#111827',
      fontSize: 16,
      textAlignVertical: 'top' as const,
    },
    placeholderColor: theme?.mutedForeground || '#9ca3af',
    errorText: {
      color: theme?.destructive || '#ef4444',
      fontSize: 12,
      marginTop: 4,
      marginLeft: 4,
    }
  };
}
