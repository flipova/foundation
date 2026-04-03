import { createTheme } from "../create.theme";
import { colors } from "../../../tokens";

export const lightTheme = createTheme({
  background: colors.white,          
  foreground: colors.black,          
  
  card: colors.primary50, 
  cardForeground: colors.primary900,
  
  primary: colors.primary500,        
  primaryForeground: colors.white,
  
  secondary: colors.secondary500,    
  secondaryForeground: colors.white,

  muted: colors.gray100, 
  mutedForeground: colors.gray500,
  
  accent: colors.secondary50,
  accentForeground: colors.secondary700,

  destructive: colors.error600,
  destructiveForeground: colors.white,
  
  border: colors.primary100,
  input: colors.white,
  ring: colors.primary500,

  success: colors.success600,
  warning: colors.warning600,
  error: colors.error600,
  info: colors.info600,
  transparent: colors.transparent,

  gradients: {
    // Dégradé Institutionnel : Très aérien (idéal pour des fonds de cartes ou headers légers)
    primary: [colors.primary50, colors.white], 
    
    // Dégradé Électrique : Lumineux et frais
    secondary: [colors.secondary200, colors.white], 
    
    // Mélange Signature Flipove : Version "Aurore" (douce transition entre les deux bleus clairs)
    vibrant: [colors.primary100, colors.secondary100],

    // États : Nuances claires pour ne pas agresser l'œil en mode Light
    success: [colors.success50, colors.success100], 
    warning: [colors.warning50, colors.warning100], 
    error: [colors.error50, colors.error100], 
    info: [colors.primary50, colors.primary200], 

    // Dégradé de fond ultra-subtle
    subtle: [colors.white, colors.primary50], 
  },
});