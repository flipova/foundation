import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useDividerStyle(logic: any) {
  const { theme } = useTheme();

  const isHorizontal = logic.orientation === 'horizontal';
  const bgColor = logic.color ? ((theme as any)?.[logic.color] || logic.color) : (theme?.border || '#e5e7eb');

  return {
    container: {
      backgroundColor: bgColor,
      // If horizontal, the height is the thickness and width fills the container.
      // If vertical, the width is the thickness and height fills the container.
      height: isHorizontal ? logic.thickness : '100%',
      width: isHorizontal ? '100%' : logic.thickness,
    }
  };
}
