import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useSliderStyle(logic: any) {
  const { theme } = useTheme();

  return {
    container: {
      height: 20,
      // Center the slider vertically within its container.
      justifyContent: 'center',
      opacity: logic.disabled ? 0.5 : 1,
    },
    track: {
      height: 4,
      backgroundColor: theme?.secondary || '#e5e7eb',
      borderRadius: 2,
      width: '100%',
      // Absolute positioning allows layering of track, fill, and thumb (if custom rendering).
      position: 'absolute',
    },
    fill: {
      height: 4,
      backgroundColor: theme?.primary || '#000',
      borderRadius: 2,
      // Dynamic width corresponding to the slider's percentage.
      width: `${logic.percentage}%`,
      position: 'absolute',
    },
    thumb: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: theme?.primary || '#000',
      position: 'absolute',
      // Horizontally offset by percentage to position the thumb along the track.
      left: `${logic.percentage}%`,
      marginLeft: -8, // center thumb based on its width
    }
  };
}
