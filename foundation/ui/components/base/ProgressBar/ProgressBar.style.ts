import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useProgressBarStyle(logic: any) {
  const { theme } = useTheme();

  return {
    container: {
      // Fixed height and rounded borders for a standard horizontal bar.
      // overflow: 'hidden' ensures the internal fill respects the rounded corners.
      height: 8,
      backgroundColor: theme?.secondary || '#e5e7eb',
      borderRadius: 4,
      overflow: 'hidden',
    },
    fill: {
      // Takes up full height of container.
      // Width is dynamically controlled via logic to represent progress.
      height: '100%',
      backgroundColor: theme?.primary || '#000',
      width: `${logic.progress}%`,
    }
  };
}
