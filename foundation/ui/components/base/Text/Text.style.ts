import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useTextStyle(logic: any) {
  const { theme } = useTheme();
  
  let fontSize = 16;
  let fontWeight = logic.weight || 'normal';
  let color = theme?.foreground || '#000000';
  let marginBottom = 0;

  switch (logic.variant) {
    case 'h1': fontSize = 36; fontWeight = logic.weight || 'bold'; marginBottom = 16; break;
    case 'h2': fontSize = 30; fontWeight = logic.weight || 'bold'; marginBottom = 14; break;
    case 'h3': fontSize = 24; fontWeight = logic.weight || '600'; marginBottom = 12; break;
    case 'h4': fontSize = 20; fontWeight = logic.weight || '600'; marginBottom = 10; break;
    case 'small': fontSize = 12; break;
    case 'muted': fontSize = 14; color = theme?.mutedForeground || '#6b7280'; break;
    case 'p':
    default: fontSize = 16; marginBottom = 8; break;
  }

  return {
    text: {
      fontSize,
      fontWeight,
      color,
      textAlign: logic.align,
      /* Bottom margin varies depending on typography variant to provide standard spacing */
      marginBottom,
    }
  };
}
