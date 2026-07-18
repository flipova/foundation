import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useRootLayoutStyle(logic: any) {
  const { theme } = useTheme();
  return {
    /**
     * Container expands to fill the screen (flex: 1) and applies the primary background 
     * color from the current theme to establish the base surface of the app.
     */
    container: {
      flex: 1,
      backgroundColor: theme?.background || '#fff',
    }
  };
}
