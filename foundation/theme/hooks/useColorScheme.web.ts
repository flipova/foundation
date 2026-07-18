import { useEffect, useState } from 'react';

/**
 * Hook compatible avec le web pour gérer le schéma de couleurs du thème dans l'application.
 *
 * Ce hook fournit une manière unifiée de gérer la sélection du thème :
 * - Utilisation du mode de thème fourni explicitement s'il est spécifié.
 * - Utilisation de la préférence du navigateur (clair/sombre) via `prefers-color-scheme`.
 * - Utilisation du thème clair par défaut si la requête média n'est pas disponible.
 * Web-compatible hook to manage the color scheme of the theme in the application.
 *
 * This hook provides a unified way to manage theme selection:
 * - Uses the explicitly provided theme mode if specified.
 * - Uses the browser's preference (light/dark) via `prefers-color-scheme`.
 * - Uses the light theme by default if the media query is not available.
 *
 * @param theme - (Optional) Explicit theme mode to use instead of the system preference.
 * @returns The resolved theme mode ('light' or 'dark').
 *
 * @example
 * ```typescript
 * // Use the system's color scheme
 * const { colorScheme } = useColorScheme();
 * 
 * // Force light theme regardless of system preference
 * const { colorScheme } = useColorScheme('light');
 * 
 * // Force dark theme regardless of system preference
 * const { colorScheme } = useColorScheme('dark');
 * ```
 *
 * @remarks
 * - Uses the CSS media query `prefers-color-scheme` via `window.matchMedia`.
 * - Listens for system theme changes in real-time and updates accordingly.
 * - Defaults to 'light' in environments where `matchMedia` is not available (e.g., SSR).
 */
export function useColorScheme(theme?: 'light' | 'dark'): 'light' | 'dark' {
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
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (theme) return theme;
  return scheme;
}