import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Hook to manage the theme color scheme in the application.
 * 
 * This hook provides a unified way to manage theme selection:
 * - Uses the explicitly provided theme mode if specified.
 * - Uses the device's native color scheme (light/dark) by default.
 * - Defaults to light theme if the native scheme is unavailable.
 * 
 * @param theme - (Optional) Explicit theme mode to use instead of the device preference.
 * @returns The resolved theme mode ('light' or 'dark').
 * 
 * @example
 * ```typescript
 * // Use the device's native color scheme
 * const theme = useColorScheme();
 * 
 * // Force light theme regardless of device preference
 * const lightTheme = useColorScheme('light');
 * 
 * // Force dark theme regardless of device preference
 * const darkTheme = useColorScheme('dark');
 * ```
 * 
 * @remarks
 * - The hook leverages the built-in `useColorScheme` hook from React Native.
 * - On platforms where color scheme detection is not available, it defaults to 'light'.
 * - This is typically used with the ThemeProvider to ensure consistent theming throughout the application.
 */
export function useColorScheme(theme?: 'light' | 'dark'): 'light' | 'dark' {
  const nativeScheme = useRNColorScheme();
  if (theme) return theme;
  return (nativeScheme ?? 'light') as 'light' | 'dark';
}
