import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useSwitchStyle(logic: any) {
  const { theme } = useTheme();
  
  const bgColor = logic.checked ? (theme?.primary || '#000') : (theme?.muted || '#e5e7eb');
  
  return {
    wrapper: {
      /* Flexbox used to align the track and the label side-by-side horizontally. */
      flexDirection: 'row',
      alignItems: 'center',
      /* Reduce opacity to visually indicate disabled state */
      opacity: logic.disabled ? 0.5 : 1,
    },
    track: {
      width: 44,
      height: 24,
      /* Fully rounded corners for a pill shape */
      borderRadius: 12,
      backgroundColor: bgColor,
      /* Center children vertically and horizontally (though thumb translates horizontally) */
      justifyContent: 'center',
      padding: 2,
    },
    thumb: {
      width: 20,
      height: 20,
      /* Fully rounded corners for a circular thumb */
      borderRadius: 10,
      backgroundColor: '#fff',
      /* Subdued shadow to give a slight 3D elevation over the track */
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
      /* Note: translateX is applied dynamically via Animated.View in Switch.tsx */
    },
    label: {
      color: theme?.foreground || '#000',
      fontSize: 14,
      /* Spacing between the switch track and the label */
      marginLeft: 8,
    }
  };
}
