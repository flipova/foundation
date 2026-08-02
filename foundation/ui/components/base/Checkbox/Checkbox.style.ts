import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useCheckboxStyle(logic: any) {
  const { theme } = useTheme();
  
  const bgColor = logic.checked ? (theme?.primary || '#000') : 'transparent';
  const borderColor = logic.checked ? (theme?.primary || '#000') : (theme?.border || '#e5e7eb');
  const iconColor = theme?.primaryForeground || '#fff';

  return {
    wrapper: {
      // Lay out the checkbox and its label in a horizontal row.
      flexDirection: 'row',
      // Center them vertically.
      alignItems: 'center',
      // Reduce opacity if disabled to indicate it's not interactive.
      opacity: logic.disabled ? 0.5 : 1,
    },
    container: {
      // Fixed dimensions for the visual checkbox box.
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: borderColor,
      backgroundColor: bgColor,
      // Center the check mark icon inside the box.
      justifyContent: 'center',
      alignItems: 'center',
      // Add margin if there is a label to separate them.
      marginRight: logic.label ? 8 : 0,
    },
    label: {
      color: theme?.foreground || '#000',
      fontSize: 14,
    },
    iconColor
  };
}
