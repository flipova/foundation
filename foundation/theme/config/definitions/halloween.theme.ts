import { createTheme } from "../create.theme";
import type { ColorScheme } from "../../types";
import { colors } from "../../../tokens";

export const halloweenTheme: ColorScheme = createTheme({
  // 🎃 Halloween - Sombre et mystérieux
  background: colors.halloween.background,        // Noir absolu
  foreground: colors.halloween.text,              // Texte orange
  card: colors.halloween.surface,                // Gris très foncé
  cardForeground: colors.halloween.text,
  
  primary: colors.halloween.primary,             // Orange citrouille
  primaryForeground: colors.black,               // Texte noir sur orange
  secondary: colors.halloween.secondary,         // Brun chocolat
  secondaryForeground: colors.white,             // Texte blanc sur brun
  
  muted: colors.halloween.muted,                 // Noir absolu
  mutedForeground: colors.halloween.textSecondary, // Texte doré
  accent: colors.halloween.accent,               // Violet magique
  accentForeground: colors.white,               // Texte blanc sur violet
  
  destructive: colors.error600,                  // Rouge standard
  destructiveForeground: colors.white,
  border: colors.halloween.border,               // Bordure grise
  input: colors.halloween.surface,               // Input avec fond gris
  ring: colors.halloween.primaryLight,           // Anneaux orange clair
  
  success: colors.halloween.success,             // Vert sorcière
  warning: colors.warning500,                    // Orange standard
  error: colors.error500,                        // Rouge standard
  info: colors.info500,                          // Bleu standard
  transparent: colors.transparent,
  
  gradients: {
    primary: [colors.halloween.primaryLight, colors.halloween.primaryDark],     // Orange dégradé
    secondary: [colors.halloween.secondaryLight, colors.halloween.secondaryDark], // Brun dégradé
    success: [colors.halloween.successLight, colors.halloween.success],        // Vert dégradé
    warning: [colors.warning100, colors.warning600],                            // Orange standard
    error: [colors.error100, colors.error600],                                  // Rouge standard
    info: [colors.info100, colors.info600],                                      // Bleu standard
    subtle: [colors.halloween.background, colors.halloween.muted],             // Noir vers gris
    vibrant: [colors.halloween.accentLight, colors.halloween.primary],          // Violet vers orange
  },
});
