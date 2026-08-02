import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useDatePickerStyle(logic: any) {
  const { theme } = useTheme();

  return {
    container: {
      // Define a solid background, especially important if rendered over other content.
      backgroundColor: theme?.background || '#fff',
      // Provide a subtle border to clearly demarcate the input area.
      borderColor: theme?.border || '#e5e7eb',
      borderWidth: 1,
      // Rounded corners for modern aesthetic.
      borderRadius: 6,
      // Internal padding to space out the text/icon from the borders.
      paddingHorizontal: 12,
      paddingVertical: 10,
      // Reduce opacity if disabled to signal inactivity.
      opacity: logic.disabled ? 0.5 : 1,
    },
    text: {
      // Inherit the foreground color for the date text.
      color: theme?.foreground || '#000',
      fontSize: 14,
    }
  };
}
