import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useCardStyle(logic: any) {
  const { theme } = useTheme();

  return {
    container: {
      // Use the dedicated card background color for clear separation from the main background.
      backgroundColor: theme?.card || '#ffffff',
      // Apply a subtle border for extra definition, especially in dark mode.
      borderColor: theme?.border || '#e5e7eb',
      borderWidth: 1,
      // Softly rounded corners for a modern look.
      borderRadius: 8,
      // Provide adequate inner spacing so content breathes well.
      padding: 16,
      // Implement shadow for depth (iOS).
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      // Implement elevation for depth (Android).
      elevation: 2,
    }
  };
}
