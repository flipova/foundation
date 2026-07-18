import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useRadioGroupStyle(logic: any) {
  const { theme } = useTheme();

  return {
    container: {
      // Stack items vertically by default with a gap for visual separation.
      flexDirection: 'column',
      gap: 12,
      // Provide visual feedback for the entire group when disabled.
      opacity: logic.disabled ? 0.5 : 1,
    },
    item: {
      // Align the custom radio graphic and label horizontally centered.
      flexDirection: 'row',
      alignItems: 'center',
    },
    radio: {
      // Fixed size with border radius equal to half to form a perfect circle.
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 2,
      borderColor: theme?.primary || '#000',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    radioUnchecked: {
      borderColor: theme?.border || '#e5e7eb',
    },
    dot: {
      // Inner circle indicating checked state.
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme?.primary || '#000',
    },
    label: {
      color: theme?.foreground || '#000',
      fontSize: 14,
    }
  };
}
