import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useTextInputStyle(logic: any) {
  const { theme } = useTheme();
  
  let borderColor = theme?.border || '#e5e7eb';
  if (logic.error) borderColor = theme?.destructive || '#ff0000';
  else if (logic.isFocused) borderColor = theme?.ring || theme?.primary || '#000000';

  return {
    container: {
      /* Add slight bottom margin when error text is present to accommodate it */
      marginBottom: logic.error ? 4 : 0,
    },
    input: {
      backgroundColor: theme?.background || '#fff',
      borderColor: borderColor,
      borderWidth: 1,
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: theme?.foreground || '#000',
      fontSize: 14,
      /* Reduce opacity when disabled */
      opacity: logic.disabled ? 0.5 : 1,
    },
    placeholderColor: theme?.mutedForeground || '#9ca3af',
    errorText: {
      color: theme?.destructive || '#ff0000',
      fontSize: 12,
      marginTop: 4,
    }
  };
}
