import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useCameraStyle(logic: any) {
  const { theme } = useTheme();

  return {
    container: {
      // Allow the container to fill available space by default.
      flex: 1,
      // Provide a dark background while the camera initializes.
      backgroundColor: theme?.background || '#000',
      // Ensure there's a minimum height to prevent the view from collapsing completely.
      minHeight: 300,
      // Center any fallback content (like permission messages) horizontally and vertically.
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      // Use the theme's foreground color for the permission fallback text.
      color: theme?.foreground || '#fff',
    }
  };
}
