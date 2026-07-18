
import { useTheme } from "../../../../theme/providers/ThemeProvider";
import { spacing, radii } from "../../../../tokens";

export function useSplitLayoutStyle(logic: any) {
  const { theme } = useTheme();

  const isVertical = logic.orientation === 'vertical';

  const getSpacing = (val: string | number) => {
    if (typeof val === 'number') return val;
    return (spacing as any)[val] || 0;
  };

  const getRadius = (val: string) => (radii as any)[val] || 0;
  const getColor = (val: string) => (theme as any)[val] || val;

  const gap = getSpacing(logic.spacing);

  return {
    container: {
      flex: 1,
      flexDirection: isVertical ? 'column' : 'row',
      backgroundColor: getColor(logic.background),
      borderRadius: getRadius(logic.borderRadius),
      overflow: 'hidden',
      gap,
    },
    left: {
      flex: logic.leftWidth ? undefined : logic.ratio,
      width: isVertical ? '100%' : logic.leftWidth,
      height: isVertical ? logic.leftWidth : '100%',
      backgroundColor: getColor(logic.leftBackground),
      borderRadius: getRadius(logic.leftBorderRadius),
      display: logic.hideLeftOnMobile ? 'none' : 'flex', // En conditions réelles, utiliser un hook de media query
    },
    right: {
      flex: logic.leftWidth ? 1 : (1 - logic.ratio),
      backgroundColor: getColor(logic.rightBackground),
      borderRadius: getRadius(logic.rightBorderRadius),
    }
  };
}
