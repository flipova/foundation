import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Hook for managing theme color scheme in the application.
 * 
 * This hook provides a unified way to handle theme selection by:
 * - Using the explicitly provided theme mode if specified
 * - Falling back to the device's native color scheme (light/dark) when no theme is provided
 * - Defaulting to 'light' theme when the native scheme is unavailable
 * 
 * @param theme - Optional explicit theme mode to use instead of device preference
 * @returns The resolved theme mode ('light' | 'dark')
 * 
 * @example
 * ```typescript
 * // Use device's native color scheme
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
 * - The hook leverages React Native's built-in `useColorScheme` hook
 * - On platforms where color scheme detection is not available, defaults to 'light'
 * - This is typically used in conjunction with the ThemeProvider to ensure
 *   consistent theming across the entire application
 */
export function useColorScheme(theme?: 'light' | 'dark'): 'light' | 'dark' {
  // If an explicit theme is provided, use it directly
  if (theme) return theme;
  
  // Otherwise, fall back to the device's native color scheme
  const nativeScheme = useRNColorScheme();
  
  // Default to 'light' if native scheme is null/undefined
  return (nativeScheme ?? 'light') as 'light' | 'dark';
}
