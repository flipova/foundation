import { createTheme } from "../create.theme";
import type { ColorScheme } from "../../types";
import { colors } from "../../../tokens";

export const winterTheme: ColorScheme = createTheme({
  // ❄️ Hiver - Glacial et élégant
  background: colors.winter.background,        // Bleu nuit très foncé
  foreground: colors.winter.text,              // Texte blanc glacial
  card: colors.winter.surface,                // Bleu nuit clair
  cardForeground: colors.winter.text,
  
  primary: colors.winter.primary,             // Bleu glacial
  primaryForeground: colors.white,            // Texte blanc sur bleu
  secondary: colors.winter.secondary,         // Blanc argenté
  secondaryForeground: colors.black,           // Texte noir sur argent
  
  muted: colors.winter.muted,                 // Bleu nuit
  mutedForeground: colors.winter.textSecondary, // Texte argenté
  accent: colors.winter.accent,               // Violet givré
  accentForeground: colors.white,             // Texte blanc sur violet
  
  destructive: colors.error600,               // Rouge standard
  destructiveForeground: colors.white,
  border: colors.winter.border,               // Bordure bleue
  input: colors.winter.surface,               // Input avec fond bleu nuit
  ring: colors.winter.primaryLight,           // Anneaux bleu clair
  
  success: colors.winter.success,             // Vert sapin
  warning: colors.warning500,                 // Orange standard
  error: colors.error500,                     // Rouge standard
  info: colors.info500,                       // Bleu standard
  transparent: colors.transparent,
  
  gradients: {
    primary: [colors.winter.primaryLight, colors.winter.primaryDark],     // Bleu dégradé
    secondary: [colors.winter.secondaryLight, colors.winter.secondaryDark], // Argent dégradé
    success: [colors.winter.successLight, colors.winter.success],        // Vert dégradé
    warning: [colors.warning100, colors.warning600],                      // Orange standard
    error: [colors.error100, colors.error600],                            // Rouge standard
    info: [colors.info100, colors.info600],                                // Bleu standard
    subtle: [colors.winter.background, colors.winter.muted],             // Bleu nuit vers clair
    vibrant: [colors.winter.accentLight, colors.winter.primary],          // Violet vers bleu
  },
});
