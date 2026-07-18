import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useIconButtonStyle(logic: any) {
  const { theme } = useTheme();
  
  let bgColor = 'transparent';
  let iconColor = theme?.foreground || '#000000';
  let borderColor = 'transparent';
  
  if (logic.variant === 'default') {
    bgColor = theme?.primary || '#000000';
    iconColor = theme?.primaryForeground || '#ffffff';
  } else if (logic.variant === 'outline') {
    borderColor = theme?.border || '#e5e7eb';
  }

  const dim = (logic.size || 24) + 16;

  return {
    container: {
      width: dim,
      height: dim,
      // Ensures a perfectly circular button layout.
      borderRadius: dim / 2,
      backgroundColor: bgColor,
      borderColor: borderColor,
      borderWidth: logic.variant === 'outline' ? 1 : 0,
      // Flexbox properties to center the icon both vertically and horizontally.
      justifyContent: 'center',
      alignItems: 'center',
      // Visual feedback when the button is disabled.
      opacity: logic.disabled ? 0.5 : 1,
    },
    iconSize: logic.size || 24,
    iconColor: iconColor
  };
}
