import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useButtonStyle(logic: any) {
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
  } else if (logic.variant === 'ghost') {
    bgColor = 'transparent';
    textColor = theme?.foreground || '#000000';
  } else if (logic.variant === 'link') {
    bgColor = 'transparent';
    textColor = theme?.primary || '#000000';
  }

  const opacity = logic.disabled ? 0.5 : 1;

  let paddingH = 16;
  let paddingV = 8;
  let height = 40;
  let width: number | undefined = undefined;
  if (logic.size === 'sm') { height = 36; paddingH = 12; }
  if (logic.size === 'lg') { height = 44; paddingH = 32; }
  if (logic.size === 'icon') { height = 40; paddingH = 0; width = 40; }

  return {
    container: {
      backgroundColor: bgColor,
      borderColor: borderColor,
      borderWidth: borderWidth,
      borderRadius: 6,
      paddingHorizontal: paddingH,
      height: height,
      // Fixed width for icon variant to ensure it remains a perfect square/circle.
      width: width,
      // Center contents horizontally and vertically using flexbox layout.
      alignItems: 'center',
      justifyContent: 'center',
      // Reduce opacity for disabled states to visually indicate inactivity.
      opacity: opacity,
      // Lay out children (e.g., spinner and text) in a row.
      flexDirection: 'row',
    },
    label: {
      color: textColor,
      fontSize: 14,
      fontWeight: '500',
      textDecorationLine: logic.variant === 'link' ? 'underline' : 'none',
    },
    spinner: {
      color: textColor,
      // Add margin to space out the spinner from the label, unless there is no label.
      marginRight: logic.label ? 8 : 0,
    }
  };
}
