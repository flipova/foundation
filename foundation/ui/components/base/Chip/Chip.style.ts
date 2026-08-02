import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useChipStyle(logic: any) {
  const { theme } = useTheme();
  
  const bgColor = logic.selected ? (theme?.primary || '#000') : (theme?.secondary || '#f3f4f6');
  const textColor = logic.selected ? (theme?.primaryForeground || '#fff') : (theme?.secondaryForeground || '#111827');

  return {
    container: {
      backgroundColor: bgColor,
      // Completely rounded corners (pill shape).
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
      // Center contents vertically.
      alignItems: 'center',
      // Center contents horizontally.
      justifyContent: 'center',
      // Lay out the label and delete icon in a row.
      flexDirection: 'row',
      opacity: logic.disabled ? 0.5 : 1,
    },
    label: {
      color: textColor,
      fontSize: 14,
      fontWeight: '500',
      // Add margin to space out the label from the delete icon, if present.
      marginRight: logic.onDelete ? 4 : 0,
    },
    iconColor: textColor
  };
}
