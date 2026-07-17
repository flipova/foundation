import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useAvatarStyle(logic: any) {
  const { theme } = useTheme();
  
  const sizeMap: Record<string, number> = { sm: 24, md: 40, lg: 56, xl: 80 };
  const dim = sizeMap[logic.size] || sizeMap.md;

  return {
    container: {
      width: dim,
      height: dim,
      // Structural choice: Setting borderRadius to half the dimension ensures a perfect circle
      borderRadius: dim / 2,
      backgroundColor: theme?.muted || '#f3f4f6',
      // Structural choice: Center content (like text initials) vertically and horizontally
      justifyContent: 'center',
      alignItems: 'center',
      // Structural choice: Clip child images so they conform to the circular shape
      overflow: 'hidden',
    },
    image: {
      // Structural choice: Fill the container completely
      width: '100%',
      height: '100%',
    },
    initials: {
      // Structural choice: Scale font size proportionally to the avatar container size
      fontSize: dim * 0.4,
      fontWeight: '600',
      color: theme?.mutedForeground || '#6b7280',
    }
  };
}
