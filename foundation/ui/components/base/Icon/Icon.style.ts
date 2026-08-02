import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useIconStyle(logic: any) {
  const { theme } = useTheme();
  return {
    // Resolves the color dynamically from the theme if not explicitly provided via props.
    color: logic.color || theme?.foreground || '#000000',
    // Sets a default bounding size for the icon to maintain visual consistency.
    size: logic.size || 24,
  };
}
