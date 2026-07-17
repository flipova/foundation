import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Hook pour gérer le schéma de couleurs du thème dans l'application.
 * 
 * Ce hook fournit une manière unifiée de gérer la sélection du thème :
 * - Utilisation du mode de thème fourni explicitement s'il est spécifié.
 * - Utilisation du schéma de couleurs natif de l'appareil (clair/sombre) par défaut.
 * - Utilisation du thème clair par défaut si le schéma natif n'est pas disponible.
 * 
 * @param theme - (Optionnel) Mode de thème explicite à utiliser au lieu de la préférence de l'appareil.
 * @returns Le mode de thème résolu ('light' ou 'dark').
 * 
 * @example
 * ```typescript
 * // Utiliser le schéma de couleurs natif de l'appareil
 * const theme = useColorScheme();
 * 
 * // Forcer le thème clair indépendamment de la préférence de l'appareil
 * const lightTheme = useColorScheme('light');
 * 
 * // Forcer le thème sombre indépendamment de la préférence de l'appareil
 * const darkTheme = useColorScheme('dark');
 * ```
 * 
 * @remarks
 * - Le hook exploite le hook `useColorScheme` intégré de React Native.
 * - Sur les plateformes où la détection du schéma de couleurs n'est pas disponible, il utilise 'light' par défaut.
 * - Ceci est généralement utilisé avec le ThemeProvider pour garantir une thématisation cohérente dans toute l'application.
 */
export function useColorScheme(theme?: 'light' | 'dark'): 'light' | 'dark' {
  const nativeScheme = useRNColorScheme();
  if (theme) return theme;
  return (nativeScheme ?? 'light') as 'light' | 'dark';
}
