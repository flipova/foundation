import { createTheme } from "../create.theme";
import type { ColorScheme } from "../../types";
import { colors } from "../../../tokens";

export const christmasTheme: ColorScheme = createTheme({
  // 🎄 Noël - Festif et chaleureux
  background: colors.christmas.background,        // Vert sapin très foncé
  foreground: colors.christmas.text,              // Texte blanc neige
  card: colors.christmas.surface,                // Vert sapin clair
  cardForeground: colors.christmas.text,
  
  primary: colors.christmas.primary,             // Rouge Noël
  primaryForeground: colors.white,               // Texte blanc sur rouge
  secondary: colors.christmas.secondary,         // Or festif
  secondaryForeground: colors.black,             // Texte noir sur or
  
  muted: colors.christmas.muted,                 // Vert très foncé
  mutedForeground: colors.christmas.textSecondary, // Texte doré
  accent: colors.christmas.accent,               // Blanc neige
  accentForeground: colors.black,               // Texte noir sur blanc
  
  destructive: colors.error600,                  // Rouge standard
  destructiveForeground: colors.white,
  border: colors.christmas.border,               // Bordure verte
  input: colors.christmas.surface,               // Input avec fond vert
  ring: colors.christmas.primaryLight,           // Anneaux rouge clair
  
  success: colors.christmas.success,             // Vert succès
  warning: colors.warning500,                    // Orange standard
  error: colors.error500,                        // Rouge standard
  info: colors.info500,                          // Bleu standard
  transparent: colors.transparent,
  
  gradients: {
    primary: [colors.christmas.primaryLight, colors.christmas.primaryDark],     // Rouge dégradé
    secondary: [colors.christmas.secondaryLight, colors.christmas.secondaryDark], // Or dégradé
    success: [colors.christmas.successLight, colors.christmas.success],        // Vert dégradé
    warning: [colors.warning100, colors.warning600],                            // Orange standard
    error: [colors.error100, colors.error600],                                  // Rouge standard
    info: [colors.info100, colors.info600],                                      // Bleu standard
    subtle: [colors.christmas.background, colors.christmas.muted],             // Vert foncé vers très foncé
    vibrant: [colors.christmas.accentLight, colors.christmas.primary],          // Blanc vers rouge
  },
});
