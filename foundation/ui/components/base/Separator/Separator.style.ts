import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useSeparatorStyle(logic: any) {
  const { theme } = useTheme();

  return {
    container: {
      backgroundColor: theme?.border || '#e5e7eb',
      // Dynamically sets width/height depending on orientation to form a thin line.
      width: logic.orientation === 'horizontal' ? '100%' : 1,
      height: logic.orientation === 'horizontal' ? 1 : '100%',
      // Adds spacing around the line based on orientation.
      marginVertical: logic.orientation === 'horizontal' ? 16 : 0,
      marginHorizontal: logic.orientation === 'vertical' ? 16 : 0,
    }
  };
}
