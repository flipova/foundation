import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useSpinnerStyle(logic: any) {
  const { theme } = useTheme();
  return {
    // Only extracts the color since the native ActivityIndicator handles its own structural rendering.
    // Falls back to a default black if no theme or explicit color is provided.
    color: logic.color || theme?.primary || '#000000',
  };
}
