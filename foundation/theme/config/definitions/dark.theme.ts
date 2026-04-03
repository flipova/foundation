import { createTheme } from "../create.theme";
import { colors } from "../../../tokens";

export const darkTheme = createTheme({
  background: colors.black,          
  foreground: colors.white,          
  
  card: colors.primary900, 
  cardForeground: colors.gray100,
  
  primary: colors.primary500,        
  primaryForeground: colors.white,
  
  secondary: colors.secondary500,    
  secondaryForeground: colors.white,

  muted: colors.primary900, 
  mutedForeground: colors.gray500,
  
  accent: colors.primary900,
  accentForeground: colors.primary200,

  destructive: colors.error500,
  destructiveForeground: colors.white,
  
  border: colors.primary800,
  input: colors.primary900,
  ring: colors.secondary600, 

  success: colors.success500,
  warning: colors.warning500,
  error: colors.error500,
  info: colors.info500,
  transparent: colors.transparent,

  gradients: {
    // Dégradé Institutionnel : Bleu très sombre vers Noir (effet profondeur)
    primary: [colors.primary800, colors.black], 
    
    // Dégradé Électrique : Midnight Blue vers Noir
    secondary: [colors.secondary900, colors.black], 
    
    // Mélange Signature Flipove Dark : Transition sombre et mystérieuse
    vibrant: [colors.primary800, colors.secondary900],

    // États : On part du sombre vers le noir pour un effet "Glow" subtil
    success: [colors.success50, colors.success100], 
    warning: [colors.warning50, colors.warning100], 
    error: [colors.error50, colors.error100], 
    info: [colors.primary50, colors.primary200], 

    // Dégradé de fond ultra-profond
    subtle: [colors.primary900, colors.black], 
  },
});