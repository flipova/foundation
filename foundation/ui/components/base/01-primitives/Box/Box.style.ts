import { useTheme } from "../../../../../theme/providers/ThemeProvider";

export function useBoxStyle(logic: any) {
  const { theme } = useTheme();
  const { layoutProps } = logic;

  // Optimised style generation based on layout props
  const style: Record<string, any> = {};

  // Flex property sets the flex grow/shrink behavior. 
  // It dictates how this box behaves inside a flex parent.
  if (layoutProps.flex !== undefined) style.flex = layoutProps.flex;
  
  // Safe color mapping
  if (layoutProps.bg) {
    style.backgroundColor = (theme as any)?.[layoutProps.bg] || layoutProps.bg;
  }

  // Spacing mapping (simplified, assuming values are passed directly to RN which handles numbers as dp)
  if (layoutProps.p !== undefined) style.padding = layoutProps.p;
  if (layoutProps.px !== undefined) style.paddingHorizontal = layoutProps.px;
  if (layoutProps.py !== undefined) style.paddingVertical = layoutProps.py;
  
  if (layoutProps.m !== undefined) style.margin = layoutProps.m;
  if (layoutProps.mx !== undefined) style.marginHorizontal = layoutProps.mx;
  if (layoutProps.my !== undefined) style.marginVertical = layoutProps.my;

  // Dimensions
  if (layoutProps.width !== undefined) style.width = layoutProps.width;
  if (layoutProps.height !== undefined) style.height = layoutProps.height;
  if (layoutProps.maxWidth !== undefined) style.maxWidth = layoutProps.maxWidth;
  if (layoutProps.minHeight !== undefined) style.minHeight = layoutProps.minHeight;

  // Borders & Overflow
  // Uses theme tokens for radius if available, fallback to raw values
  if (layoutProps.borderRadius !== undefined) {
    style.borderRadius = (theme as any)?.radius?.[layoutProps.borderRadius] || layoutProps.borderRadius;
  }
  // Controls clipping of content, useful for rounded corners or absolute positioned children
  if (layoutProps.overflow !== undefined) style.overflow = layoutProps.overflow;

  // Alignment
  // Structural choices for child layout when Box acts as a flex container
  if (layoutProps.justifyContent !== undefined) style.justifyContent = layoutProps.justifyContent;
  if (layoutProps.alignItems !== undefined) style.alignItems = layoutProps.alignItems;
  if (layoutProps.alignSelf !== undefined) style.alignSelf = layoutProps.alignSelf;

  return { container: style };
}
