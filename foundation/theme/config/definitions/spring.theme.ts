import { createTheme } from "../create.theme";
import type { ColorScheme } from "../../types";
import { colors } from "../../../tokens";

export const springTheme: ColorScheme = createTheme({
  // 🌸 Printemps - Frais et floral
  background: colors.spring.background,        // Blanc cassé très clair
  foreground: colors.spring.text,              // Texte gris foncé
  card: colors.spring.surface,                // Blanc pur pour les cartes
  cardForeground: colors.spring.text,
  
  primary: colors.spring.primary,             // Rose printanier
  primaryForeground: colors.white,            // Texte blanc sur rose
  secondary: colors.spring.secondary,         // Vert frais
  secondaryForeground: colors.white,           // Texte blanc sur vert
  
  muted: colors.spring.muted,                 // Gris très clair
  mutedForeground: colors.spring.textSecondary, // Texte secondaire
  accent: colors.spring.accent,               // Jaune doux
  accentForeground: colors.black,             // Texte noir sur jaune
  
  destructive: colors.error600,               // Rouge standard
  destructiveForeground: colors.white,
  border: colors.spring.border,               // Bordure douce
  input: colors.spring.surface,               // Input avec fond blanc
  ring: colors.spring.primaryLight,           // Anneaux rose clair
  
  success: colors.spring.success,             // Vert printanier
  warning: colors.warning500,                 // Orange standard
  error: colors.error500,                     // Rouge standard
  info: colors.info500,                       // Bleu standard
  transparent: colors.transparent,
  
  gradients: {
    primary: [colors.spring.primaryLight, colors.spring.primaryDark],     // Rose dégradé
    secondary: [colors.spring.secondaryLight, colors.spring.secondaryDark], // Vert dégradé
    success: [colors.spring.successLight, colors.spring.success],        // Vert dégradé
    warning: [colors.warning100, colors.warning600],                      // Orange standard
    error: [colors.error100, colors.error600],                            // Rouge standard
    info: [colors.info100, colors.info600],                                // Bleu standard
    subtle: [colors.spring.background, colors.spring.muted],             // Blanc cassé vers gris
    vibrant: [colors.spring.accentLight, colors.spring.primary],          // Jaune vers rose
  },
});
