import { useEffect, useState } from 'react';

/**
 * Web-compatible hook for managing theme color scheme in the application.
 *
 * This hook provides a unified way to handle theme selection by:
 * - Using the explicitly provided theme mode if specified
 * - Falling back to the browser's preferred color scheme (light/dark) via `prefers-color-scheme`
 * - Defaulting to 'light' theme when the media query is unavailable
 *
 * @param theme - Optional explicit theme mode to use instead of system preference
 * @returns The resolved theme mode ('light' | 'dark')
 *
 * @example
 * ```typescript
 * // Use browser's system color scheme
 * const theme = useColorScheme();
 *
 * // Force light theme regardless of system preference
 * const lightTheme = useColorScheme('light');
 *
 * // Force dark theme regardless of system preference
 * const darkTheme = useColorScheme('dark');
 * ```
 *
 * @remarks
 * - Uses the `prefers-color-scheme` CSS media query via `window.matchMedia`
 * - Listens for system theme changes in real time and updates accordingly
 * - Falls back to 'light' on environments where `matchMedia` is unavailable (e.g. SSR)
 */
export function useColorScheme(theme?: 'light' | 'dark'): 'light' | 'dark' {
  // If an explicit theme is provided, use it directly
  if (theme) return theme;

  const getSystemScheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined' || !window.matchMedia) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [scheme, setScheme] = useState<'light' | 'dark'>(getSystemScheme);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event: MediaQueryListEvent) => {
      setScheme(event.matches ? 'dark' : 'light');
    };

    // Use modern addEventListener API
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return scheme;
}