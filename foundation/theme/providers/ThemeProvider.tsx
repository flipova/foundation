import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  autumnTheme,
  christmasTheme,
  darkTheme,
  halloweenTheme,
  lightTheme,
  neonTheme,
  springTheme,
  summerTheme,
  winterTheme
} from '../config';
import { useColorScheme } from '../hooks/useColorScheme';
import type { ColorScheme, CustomThemeMode, ThemeMode, ThemeRegistry } from '../types';

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
 * Hook for accessing the theme context.
 * 
 * @param customTheme - Optional custom theme mode to use instead of the current context theme
 * @returns The theme context value with current theme, mode, setter, and available themes
 * @throws Error if used outside of a ThemeProvider
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const { theme, mode, setTheme } = useTheme();
 * 
 * // With custom theme
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
 * Props for the ThemeProvider component.
 */
interface ThemeProviderProps {
  /** Child components that will have access to the theme context */
  children: React.ReactNode;
  /** Default theme to use when no theme is stored in state */
  defaultTheme?: ThemeMode | CustomThemeMode;
  /** Additional custom themes to merge with built-in themes */
  customThemes?: Partial<ThemeRegistry>;
}

/**
 * Provides theme context to child components.
 * 
 * Manages the current theme state and provides access to theme switching functionality.
 * Supports built-in themes (light, dark, neon) and custom themes.
 * 
 * @param props - The theme provider props
 * @returns A context provider component
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
  const [currentTheme, setCurrentTheme] = useState<ThemeMode | CustomThemeMode>(
    defaultTheme || useColorScheme()
  );
  const [isManualSelection, setIsManualSelection] = useState(false);
  
  // Build theme registry with built-in and custom themes
  const themeRegistry: ThemeRegistry = {
    light: lightTheme,
    dark: darkTheme,
    neon: neonTheme,
    spring: springTheme,
    summer: summerTheme,
    autumn: autumnTheme,
    winter: winterTheme,
    halloween: halloweenTheme,
    christmas: christmasTheme,
    ...customThemes,
  };
  
  // Listen for system theme changes when no explicit theme is set
  const systemColorScheme = useColorScheme();
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
  
  const activeTheme = themeRegistry[currentTheme] || lightTheme;
  
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
