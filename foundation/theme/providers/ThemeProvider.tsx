import React, { createContext, useContext, useEffect, useState } from 'react';
import { themes as generatedThemes, type ThemeName } from '../generated';
import { useColorScheme } from '../hooks/useColorScheme';
import type { ColorScheme, CustomThemeMode, ThemeRegistry, ThemeMode } from '../types';

/**
 * Defines the shape of the theme context value.
 * Provides access to the current theme, mode, theme setter, and available themes.
 */
interface ThemeContextType {
  /** The current active color scheme object */
  theme: ColorScheme;
  /** The current theme mode (built-in or custom) */
  mode: ThemeMode | CustomThemeMode;
  /** Function to change the current theme */
  setTheme: (theme: ThemeMode | CustomThemeMode) => void;
  /** Registry of all available themes */
  availableThemes: ThemeRegistry;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

/**
 * Hook pour accéder au contexte du thème.
 * 
 * @param customTheme - (Optionnel) Mode de thème personnalisé à utiliser au lieu du thème du contexte actuel.
 * @returns La valeur du contexte du thème avec le thème actuel, le mode, la fonction pour le modifier et les thèmes disponibles.
 * @throws Erreur s'il est utilisé en dehors d'un ThemeProvider.
 * 
 * @example
 * ```tsx
 * // Utilisation de base
 * const { theme, mode, setTheme } = useTheme();
 * 
 * // Avec un thème personnalisé
 * const { theme } = useTheme('neon');
 * ```
 */
export const useTheme = (customTheme?: ThemeMode | CustomThemeMode) => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  // If custom theme is requested, check if it exists in registry
  if (customTheme && context.availableThemes[customTheme]) {
    return {
      theme: context.availableThemes[customTheme],
      mode: customTheme,
      setTheme: context.setTheme,
      availableThemes: context.availableThemes,
    };
  }
  
  return context;
};

/**
 * Propriétés (props) pour le composant ThemeProvider.
 */
interface ThemeProviderProps {
  /** Composants enfants qui auront accès au contexte du thème */
  children: React.ReactNode;
  /** Thème par défaut à utiliser lorsqu'aucun thème n'est stocké dans l'état */
  defaultTheme?: ThemeMode | CustomThemeMode;
  /** Thèmes personnalisés supplémentaires à fusionner avec les thèmes intégrés */
  customThemes?: Partial<ThemeRegistry>;
}

/**
 * Fournit le contexte du thème aux composants enfants.
 * 
 * Gère l'état du thème actuel et permet d'accéder à la fonctionnalité de changement de thème.
 * Prend en charge les thèmes intégrés (clair, sombre, néon) et les thèmes personnalisés.
 * Provides the theme context to child components.
 * 
 * Manages the current theme state and provides access to theme changing functionality.
 * Supports built-in themes (light, dark, neon) and custom themes.
 * 
 * @param props - The theme provider properties.
 * @returns A context provider component.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * 
 * // With default theme and custom themes
 * <ThemeProvider defaultTheme="dark" customThemes={{ myTheme: customThemeConfig }}>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme,
  customThemes = {}
}) => {
  const systemColorScheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState<ThemeMode | CustomThemeMode>(
    defaultTheme || systemColorScheme
  );
  const [isManualSelection, setIsManualSelection] = useState(false);
  
  // Build theme registry with built-in and custom themes
  const themeRegistry: ThemeRegistry = {
    ...generatedThemes,
    ...customThemes,
  };

  // Sync with defaultTheme prop changes
  useEffect(() => {
    if (defaultTheme) {
      setCurrentTheme(defaultTheme);
    }
  }, [defaultTheme]);

  // Rebuild registry when customThemes change
  useEffect(() => {
    if (defaultTheme && customThemes && Object.keys(customThemes).length > 0) {
      setCurrentTheme(prev => prev);
    }
  }, [customThemes, defaultTheme]);
  
  // Listen for system theme changes when no explicit theme is set
  useEffect(() => {
    // Only auto-update if user hasn't manually selected a theme
    if (!isManualSelection && !defaultTheme) {
      setCurrentTheme(systemColorScheme);
    }
  }, [systemColorScheme, defaultTheme, isManualSelection]);
  
  const setTheme = (theme: ThemeMode | CustomThemeMode) => {
    if (themeRegistry[theme]) {
      setCurrentTheme(theme);
      setIsManualSelection(true); // Mark that user manually selected a theme
    } else {
      console.warn(`Theme "${theme}" is not available. Available themes:`, Object.keys(themeRegistry));
    }
  };
  
  const activeTheme = themeRegistry[currentTheme] || generatedThemes.light;
  
  const value: ThemeContextType = {
    theme: activeTheme,
    mode: currentTheme,
    setTheme,
    availableThemes: themeRegistry,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
