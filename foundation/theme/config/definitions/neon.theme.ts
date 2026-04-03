import { createTheme } from "../create.theme";
import type { ColorScheme } from "../../types";
import { colors } from "../../../tokens";

export const neonTheme: ColorScheme = createTheme({
  // Fond violet presque transparent et brillant
  background: colors.neon.background,        // Violet très foncé et transparent
  foreground: colors.neon.text,              // Blanc pur pour contraste maximal
  card: colors.neon.surface,                 // Surface violet clair
  cardForeground: colors.neon.text,
  
  // Couleurs principales - Vibrantes et brillantes
  primary: colors.neon.primary,              // Violet vif et brillant
  primaryForeground: colors.black,            // Texte noir sur violet brillant
  secondary: colors.neon.secondary,          // Cyan électrique brillant
  secondaryForeground: colors.black,          // Texte noir sur cyan
  
  // Éléments en retrait et accents brillants
  muted: colors.neon.muted,                  // Violet foncé pour éléments discrets
  mutedForeground: colors.neon.textSecondary, // Texte secondaire violet clair
  accent: colors.neon.accent,                // Rose neon vif
  accentForeground: colors.white,             // Texte blanc sur rose
  
  // Actions et états
  destructive: colors.error600,              // Rouge standard pour erreurs
  destructiveForeground: colors.white,
  border: colors.neon.border,                // Bordures violettes vibrantes
  input: colors.neon.surface,                // Input avec fond de surface
  ring: colors.neon.primaryLight,            // Anneaux avec violet très brillant
  
  // États sémantiques - Couleurs brillantes
  success: colors.neon.success,              // Vert électrique brillant
  warning: colors.warning500,                // Orange standard
  error: colors.error500,                    // Rouge standard
  info: colors.neon.secondary,               // Cyan brillant pour informations
  transparent: colors.transparent,
  
  // Dégradés - Vibrants et électriques
  gradients: {
    primary: [colors.neon.primaryLight, colors.neon.primaryDark],     // Violet brillant dégradé
    secondary: [colors.neon.secondaryLight, colors.neon.secondaryDark], // Cyan électrique dégradé
    success: [colors.neon.successLight, colors.neon.success],        // Vert électrique dégradé
    warning: [colors.warning100, colors.warning600],                  // Orange standard
    error: [colors.error100, colors.error600],                        // Rouge standard
    info: [colors.neon.secondaryLight, colors.neon.secondaryDark],     // Cyan brillant dégradé
    subtle: [colors.neon.background, colors.neon.muted],             // Violet transparent vers foncé
    vibrant: [colors.neon.accentLight, colors.neon.primary],          // Rose vers violet brillant
  },
});
