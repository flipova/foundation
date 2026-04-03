import { createTheme } from "../create.theme";
import type { ColorScheme } from "../../types";
import { colors } from "../../../tokens";

export const summerTheme: ColorScheme = createTheme({
  // ☀️ Été - Vibrant et solaire
  background: colors.summer.background,        // Jaune crème très clair
  foreground: colors.summer.text,              // Texte brun doré
  card: colors.summer.surface,                // Blanc pur
  cardForeground: colors.summer.text,
  
  primary: colors.summer.primary,             // Orange solaire
  primaryForeground: colors.white,            // Texte blanc sur orange
  secondary: colors.summer.secondary,         // Rouge vif
  secondaryForeground: colors.white,           // Texte blanc sur rouge
  
  muted: colors.summer.muted,                 // Jaune très clair
  mutedForeground: colors.summer.textSecondary, // Texte secondaire
  accent: colors.summer.accent,               // Bleu ciel
  accentForeground: colors.white,             // Texte blanc sur bleu
  
  destructive: colors.error600,               // Rouge standard
  destructiveForeground: colors.white,
  border: colors.summer.border,               // Bordure jaune
  input: colors.summer.surface,               // Input avec fond blanc
  ring: colors.summer.primaryLight,           // Anneaux jaune vif
  
  success: colors.summer.success,             // Vert frais
  warning: colors.warning500,                 // Orange standard
  error: colors.error500,                     // Rouge standard
  info: colors.info500,                       // Bleu standard
  transparent: colors.transparent,
  
  gradients: {
    primary: [colors.summer.primaryLight, colors.summer.primaryDark],     // Jaune vers orange
    secondary: [colors.summer.secondaryLight, colors.summer.secondaryDark], // Rouge dégradé
    success: [colors.summer.successLight, colors.summer.success],        // Vert dégradé
    warning: [colors.warning100, colors.warning600],                      // Orange standard
    error: [colors.error100, colors.error600],                            // Rouge standard
    info: [colors.info100, colors.info600],                                // Bleu standard
    subtle: [colors.summer.background, colors.summer.muted],             // Jaune crème vers clair
    vibrant: [colors.summer.accentLight, colors.summer.primary],          // Bleu vers orange
  },
});
