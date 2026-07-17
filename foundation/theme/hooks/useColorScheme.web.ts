import { useEffect, useState } from 'react';

/**
 * Hook compatible avec le web pour gérer le schéma de couleurs du thème dans l'application.
 *
 * Ce hook fournit une manière unifiée de gérer la sélection du thème :
 * - Utilisation du mode de thème fourni explicitement s'il est spécifié.
 * - Utilisation de la préférence du navigateur (clair/sombre) via `prefers-color-scheme`.
 * - Utilisation du thème clair par défaut si la requête média n'est pas disponible.
 *
 * @param theme - (Optionnel) Mode de thème explicite à utiliser au lieu de la préférence système.
 * @returns Le mode de thème résolu ('light' ou 'dark').
 *
 * @example
 * ```typescript
 * // Utiliser le schéma de couleurs du système
 * const theme = useColorScheme();
 *
 * // Forcer le thème clair indépendamment de la préférence du système
 * const lightTheme = useColorScheme('light');
 *
 * // Forcer le thème sombre indépendamment de la préférence du système
 * const darkTheme = useColorScheme('dark');
 * ```
 *
 * @remarks
 * - Utilise la requête média CSS `prefers-color-scheme` via `window.matchMedia`.
 * - Écoute les changements de thème du système en temps réel et se met à jour.
 * - Utilise 'light' par défaut dans les environnements où `matchMedia` n'est pas disponible (ex: SSR).
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