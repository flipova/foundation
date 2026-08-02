import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useAccordionStyle(logic: any) {
  const { theme } = useTheme();

  // Fallbacks in case theme isn't fully defined yet
  const colors = theme || {};
  const bgColor = logic.background || colors.card || '#ffffff';
  const borderColor = logic.borderColor || colors.border || '#e5e7eb';
  const textColor = colors.foreground || '#111827';

  // Basic token mapping
  const radiusMap: Record<string, number> = {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12
  };
  const parsedRadius = typeof logic.borderRadius === 'string'
    ? (radiusMap[logic.borderRadius] || 8)
    : (logic.borderRadius || 8);

  return {
    container: {
      backgroundColor: bgColor,
      borderColor: borderColor,
      borderWidth: 1,
      borderRadius: parsedRadius,
      // Structural choice: overflow hidden ensures content doesn't bleed out of the rounded corners
      overflow: 'hidden',
      marginBottom: 8,
    },
    header: {
      padding: 16,
      backgroundColor: 'transparent',
    },
    headerWeb: {
      // Structural choices for web: Using flex to align text and icon, removing default button styles
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      userSelect: 'none',
      border: 'none',
      width: '100%',
      textAlign: 'left',
    },
    headerNative: {
      // Structural choices for native: flex-row ensures the title and icon are on the same line,
      // space-between pushes the icon to the far right.
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: 'transparent',
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: textColor,
      margin: 0,
    },
    icon: {
      color: textColor,
    },
    content: {
      // Structural choice: Padding top is 0 to avoid double padding with the header,
      // creating a seamless transition from header to content.
      padding: 16,
      paddingTop: 0,
      color: textColor,
    }
  };
}
