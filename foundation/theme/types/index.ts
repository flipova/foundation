import type { ThemeName } from '../generated';

/**
 * Type représentant les modes de thème intégrés (clair ou sombre) et générés.
 */
export type ThemeMode = ThemeName | 'light' | 'dark';

/**
 * Type représentant un mode de thème personnalisé sous forme de chaîne de caractères.
 */
export type CustomThemeMode = string;

/**
 * Gradients du thème.
 * Chaque gradient est un tableau de 2+ couleurs hex.
 */
export type ThemeGradients = {
  primary: string[];
  secondary: string[];
  success: string[];
  warning: string[];
  error: string[];
  info: string[];
  subtle: string[];
  vibrant: string[];
};

/**
 * Schéma de couleurs d'un thème.
 *
 * Contient UNIQUEMENT les couleurs et gradients — les tokens statiques
 * (spacing, radii, shadows, typography) sont importés directement
 * depuis `foundation/tokens` car ils ne changent pas entre les thèmes.
 */
export type ColorScheme = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  transparent: string;
  gradients: ThemeGradients;
};

/**
 * Registre des thèmes disponibles dans l'application.
 * Contient au minimum les thèmes clair et sombre, plus tout thème personnalisé.
 */
export type ThemeRegistry = {
  light: ColorScheme;
  dark: ColorScheme;
  [key: string]: ColorScheme;
};
