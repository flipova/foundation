import { createTheme } from "../create.theme";
import type { ColorScheme } from "../../types";
import { colors } from "../../../tokens";

export const autumnTheme: ColorScheme = createTheme({
  // 🍂 Automne - Chaleureux et terrien
  background: colors.autumn.background,        // Brun très foncé
  foreground: colors.autumn.text,              // Texte crème
  card: colors.autumn.surface,                // Brun clair
  cardForeground: colors.autumn.text,
  
  primary: colors.autumn.primary,             // Orange automnal
  primaryForeground: colors.white,            // Texte blanc sur orange
  secondary: colors.autumn.secondary,         // Or doré
  secondaryForeground: colors.black,           // Texte noir sur or
  
  muted: colors.autumn.muted,                 // Brun très foncé
  mutedForeground: colors.autumn.textSecondary, // Texte secondaire
  accent: colors.autumn.accent,               // Rouge feuille
  accentForeground: colors.white,             // Texte blanc sur rouge
  
  destructive: colors.error600,               // Rouge standard
  destructiveForeground: colors.white,
  border: colors.autumn.border,               // Bordure brun
  input: colors.autumn.surface,               // Input avec fond brun
  ring: colors.autumn.primaryLight,           // Anneaux orange clair
  
  success: colors.autumn.success,             // Vert forêt
  warning: colors.warning500,                 // Orange standard
  error: colors.error500,                     // Rouge standard
  info: colors.info500,                       // Bleu standard
  transparent: colors.transparent,
  
  gradients: {
    primary: [colors.autumn.primaryLight, colors.autumn.primaryDark],     // Orange dégradé
    secondary: [colors.autumn.secondaryLight, colors.autumn.secondaryDark], // Or dégradé
    success: [colors.autumn.successLight, colors.autumn.success],        // Vert dégradé
    warning: [colors.warning100, colors.warning600],                      // Orange standard
    error: [colors.error100, colors.error600],                            // Rouge standard
    info: [colors.info100, colors.info600],                                // Bleu standard
    subtle: [colors.autumn.background, colors.autumn.muted],             // Brun foncé vers très foncé
    vibrant: [colors.autumn.accentLight, colors.autumn.primary],          // Rouge vers orange
  },
});
