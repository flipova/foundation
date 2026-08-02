import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useBadgeStyle(logic: any) {
  const { theme } = useTheme();
  
  let bgColor = theme?.primary || '#000000';
  let textColor = theme?.primaryForeground || '#ffffff';
  let borderColor = 'transparent';
  let borderWidth = 0;

  if (logic.variant === 'destructive') {
    bgColor = theme?.destructive || '#ff0000';
    textColor = theme?.destructiveForeground || '#ffffff';
  } else if (logic.variant === 'outline') {
    bgColor = 'transparent';
    textColor = theme?.foreground || '#000000';
    borderColor = theme?.border || '#e5e7eb';
    borderWidth = 1;
  } else if (logic.variant === 'secondary') {
    bgColor = theme?.secondary || '#f3f4f6';
    textColor = theme?.secondaryForeground || '#111827';
  }

  return {
    container: {
      backgroundColor: bgColor,
      borderColor: borderColor,
      borderWidth: borderWidth,
      // Structural choice: 9999 for borderRadius creates a pill shape regardless of height
      borderRadius: 9999,
      // Structural choice: Horizontal padding is larger than vertical to maintain the pill aesthetic
      paddingHorizontal: 10,
      paddingVertical: 2,
      // Structural choice: Center the label text perfectly within the pill
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      color: textColor,
      fontSize: 12,
      fontWeight: '600',
    }
  };
}
