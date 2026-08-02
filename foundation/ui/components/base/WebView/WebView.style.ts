import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useWebViewStyle(logic: any) {
  const { theme } = useTheme();

  return {
    container: {
      /* Fill available space by default if placed in a flex container */
      flex: 1,
      /* Provide a minimum height so it doesn't collapse entirely if flex isn't sufficient */
      minHeight: 400,
      backgroundColor: theme?.background || '#fff',
    }
  };
}
