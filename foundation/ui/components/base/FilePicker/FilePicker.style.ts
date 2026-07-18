import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useFilePickerStyle(logic: any) {
  const { theme } = useTheme();

  return {
    container: {
      backgroundColor: theme?.secondary || '#f3f4f6',
      borderColor: theme?.border || '#e5e7eb',
      borderWidth: 1,
      borderStyle: 'dashed',
      borderRadius: 6,
      padding: 16,
      // Flexbox properties for centering the icon and text horizontally and vertically.
      alignItems: 'center',
      justifyContent: 'center',
      // Visual feedback for disabled state.
      opacity: logic.disabled ? 0.5 : 1,
    },
    label: {
      color: theme?.secondaryForeground || '#111827',
      fontSize: 14,
      fontWeight: '500',
    }
  };
}
