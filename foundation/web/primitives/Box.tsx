import React from 'react';
import { SpacingToken, RadiusToken } from '../../tokens';
import { useTheme } from '../../theme/providers/ThemeProvider';
import { resolveWebSpacing, resolveWebRadius, resolveWebColor } from '../utils/themeUtils';

export interface WebBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: SpacingToken | number | string;
  p?: SpacingToken | number | string;
  paddingTop?: SpacingToken | number | string;
  pt?: SpacingToken | number | string;
  paddingBottom?: SpacingToken | number | string;
  pb?: SpacingToken | number | string;
  paddingLeft?: SpacingToken | number | string;
  pl?: SpacingToken | number | string;
  paddingRight?: SpacingToken | number | string;
  pr?: SpacingToken | number | string;
  paddingHorizontal?: SpacingToken | number | string;
  px?: SpacingToken | number | string;
  paddingVertical?: SpacingToken | number | string;
  py?: SpacingToken | number | string;
  
  margin?: SpacingToken | number | string;
  m?: SpacingToken | number | string;
  marginTop?: SpacingToken | number | string;
  mt?: SpacingToken | number | string;
  marginBottom?: SpacingToken | number | string;
  mb?: SpacingToken | number | string;
  
  borderRadius?: RadiusToken | number | string;
  bg?: string;
  backgroundColor?: string;
  borderWidth?: number | string;
  borderColor?: string;
  flex?: number | string;
  width?: number | string;
  height?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  display?: string;
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Box = React.forwardRef<HTMLDivElement, WebBoxProps>(
  ({
    padding, p, paddingTop, pt, paddingBottom, pb, paddingLeft, pl, paddingRight, pr,
    paddingHorizontal, px, paddingVertical, py,
    margin, m, marginTop, mt, marginBottom, mb,
    borderRadius, bg, backgroundColor, borderWidth, borderColor,
    flex, width, height, maxWidth, maxHeight, display, position,
    style, children, ...rest
  }, ref) => {
    const { theme } = useTheme();

    const resolvedBg = bg || backgroundColor;
    const finalBg = resolvedBg ? resolveWebColor(theme, resolvedBg) : undefined;
    const finalBorderColor = borderColor ? resolveWebColor(theme, borderColor) : undefined;

    const computedStyle: React.CSSProperties = {
      boxSizing: 'border-box',
      padding: resolveWebSpacing(padding ?? p),
      paddingTop: resolveWebSpacing(paddingTop ?? pt ?? paddingVertical ?? py),
      paddingBottom: resolveWebSpacing(paddingBottom ?? pb ?? paddingVertical ?? py),
      paddingLeft: resolveWebSpacing(paddingLeft ?? pl ?? paddingHorizontal ?? px),
      paddingRight: resolveWebSpacing(paddingRight ?? pr ?? paddingHorizontal ?? px),
      margin: resolveWebSpacing(margin ?? m),
      marginTop: resolveWebSpacing(marginTop ?? mt),
      marginBottom: resolveWebSpacing(marginBottom ?? mb),
      borderRadius: resolveWebRadius(borderRadius),
      backgroundColor: finalBg,
      borderWidth: typeof borderWidth === 'number' ? `${borderWidth}px` : borderWidth,
      borderColor: finalBorderColor,
      borderStyle: borderWidth || borderColor ? 'solid' : undefined,
      flex: flex,
      width,
      height,
      maxWidth,
      maxHeight,
      display,
      position,
      ...style,
    };

    return (
      <div ref={ref} style={computedStyle} {...rest}>
        {children}
      </div>
    );
  }
);

Box.displayName = 'Box';
