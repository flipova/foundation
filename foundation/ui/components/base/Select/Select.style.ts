import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useSelectStyle(logic: any) {
  const { theme } = useTheme();
  
  const borderColor = logic.isFocused ? (theme?.ring || theme?.primary || '#000') : (theme?.border || '#e5e7eb');

  return {
    container: {
      // Container maintains its own visual border and background.
      backgroundColor: theme?.background || '#fff',
      borderColor: borderColor,
      borderWidth: 1,
      borderRadius: 6,
      // Padding gives space for the absolutely positioned native picker inside.
      paddingHorizontal: 12,
      paddingVertical: 10,
      opacity: logic.disabled ? 0.5 : 1,
      // Flex row layout keeps text and dropdown icon properly spaced.
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    text: {
      color: logic.value ? (theme?.foreground || '#000') : (theme?.mutedForeground || '#9ca3af'),
      fontSize: 14,
    },
    iconColor: theme?.mutedForeground || '#9ca3af'
  };
}
