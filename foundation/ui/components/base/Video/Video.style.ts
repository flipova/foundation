import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useVideoStyle(logic: any) {
  const { theme } = useTheme();
  return {
    container: {
      /* Fill available space by default if placed in a flex container */
      flex: 1,
      /* Ensure the video has a sensible minimum height to avoid zero-height collapses */
      minHeight: 200,
      /* Black background to provide a standard letterbox/pillarbox color */
      backgroundColor: '#000',
    }
  };
}
