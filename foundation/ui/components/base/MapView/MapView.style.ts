import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useMapViewStyle(logic: any) {
  const { theme } = useTheme();
  return {
    container: {
      // flex: 1 allows the map container to fill the available space.
      flex: 1,
      // Provides a minimum height so the map doesn't collapse if flex constraints are absent.
      minHeight: 300,
      // Fallback background color shown while the map tiles are loading.
      backgroundColor: theme?.secondary || '#e5e7eb',
    }
  };
}
