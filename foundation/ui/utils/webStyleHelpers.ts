/**
 * @module webStyleHelpers
 * @description Helper functions to convert React Native styles to web CSS
 * and handle platform-specific styling requirements
 */

import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { isWeb } from './platform';

type RNStyle = ViewStyle | TextStyle | ImageStyle | any;

/**
 * Convert React Native shadow properties to CSS box-shadow
 * React Native uses shadowColor, shadowOffset, shadowOpacity, shadowRadius
 * CSS uses box-shadow: offsetX offsetY blurRadius spreadRadius color
 */
export const convertShadowToBoxShadow = (style: RNStyle): React.CSSProperties | {} => {
  if (!isWeb) return {};

  const {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
  } = style as any;

  if (!shadowColor || !shadowOffset) return {};

  const offsetX = shadowOffset.width || 0;
  const offsetY = shadowOffset.height || 0;
  const blurRadius = shadowRadius || 0;
  const opacity = shadowOpacity || 1;

  // Parse color and apply opacity
  let color = shadowColor || '#000000';
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    color = `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } else if (color.startsWith('rgb')) {
    // Insert opacity before the closing paren
    color = color.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
  }

  return {
    boxShadow: `${offsetX}px ${offsetY}px ${blurRadius}px ${color}`,
  } as React.CSSProperties;
};

/**
 * Convert React Native border radius shorthand to CSS
 * React Native uses borderRadius (all corners)
 * CSS can use border-radius with top-left, top-right, etc.
 */
export const convertBorderRadius = (
  style: RNStyle
): React.CSSProperties | {} => {
  if (!isWeb) return {};

  const {
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
  } = style;

  if (!borderRadius && !borderTopLeftRadius && !borderTopRightRadius && 
      !borderBottomLeftRadius && !borderBottomRightRadius) {
    return {};
  }

  if (borderRadius) {
    return { borderRadius: `${borderRadius}px` } as React.CSSProperties;
  }

  return {
    borderTopLeftRadius: borderTopLeftRadius ? `${borderTopLeftRadius}px` : undefined,
    borderTopRightRadius: borderTopRightRadius ? `${borderTopRightRadius}px` : undefined,
    borderBottomLeftRadius: borderBottomLeftRadius ? `${borderBottomLeftRadius}px` : undefined,
    borderBottomRightRadius: borderBottomRightRadius ? `${borderBottomRightRadius}px` : undefined,
  } as React.CSSProperties;
};

/**
 * Convert React Native elevation (Android shadow) to CSS box-shadow
 * elevation: number on Android creates a layered shadow effect
 */
export const convertElevationToBoxShadow = (
  elevation: number | undefined
): React.CSSProperties | {} => {
  if (!isWeb || !elevation) return {};

  // Approximate Material Design elevation shadows
  const elevationMap: Record<number, string> = {
    1: '0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24)',
    2: '0px 3px 6px rgba(0,0,0,0.16), 0px 3px 6px rgba(0,0,0,0.23)',
    3: '0px 10px 20px rgba(0,0,0,0.19), 0px 6px 6px rgba(0,0,0,0.23)',
    4: '0px 15px 25px rgba(0,0,0,0.15), 0px 5px 10px rgba(0,0,0,0.05)',
    5: '0px 20px 40px rgba(0,0,0,0.2)',
  };

  const boxShadow = elevationMap[Math.min(elevation, 5)] || 
                    elevationMap[5];

  return { boxShadow } as React.CSSProperties;
};

/**
 * Convert React Native transform array to CSS transform string
 * React Native: transform: [{ translateX: 10 }, { scale: 0.5 }]
 * CSS: transform: translateX(10px) scale(0.5)
 */
export const convertTransformToCSS = (
  transform: any[] | undefined
): React.CSSProperties | {} => {
  if (!isWeb || !transform) return {};

  const cssTransforms = transform
    .map((t) => {
      const [[key, value]] = Object.entries(t);
      
      // Add px for translate transforms, not for rotate/scale
      const hasUnit = ['translateX', 'translateY', 'translateZ'].includes(key);
      const unit = hasUnit ? 'px' : '';

      return `${key}(${value}${unit})`;
    })
    .join(' ');

  return { transform: cssTransforms } as React.CSSProperties;
};

/**
 * Convert React Native perspective to CSS
 */
export const convertPerspectiveToCSS = (
  style: RNStyle
): React.CSSProperties | {} => {
  if (!isWeb) return {};

  const { perspective } = style;
  if (!perspective) return {};

  return { perspective: `${perspective}px` } as React.CSSProperties;
};

/**
 * Merge multiple style converters and apply to a style object
 */
export const applyWebStyleConversions = (
  style: RNStyle
): React.CSSProperties => {
  if (!isWeb) return style;

  return {
    ...style,
    ...convertShadowToBoxShadow(style),
    ...convertBorderRadius(style),
    ...convertElevationToBoxShadow(style.elevation),
    ...convertTransformToCSS(style.transform),
    ...convertPerspectiveToCSS(style),
  } as React.CSSProperties;
};

/**
 * Handle cursor styles on web
 * Maps React Native gestures to web cursor values
 */
export const getCursorStyle = (pointerEvents?: string): React.CSSProperties => {
  if (!isWeb) return {};

  switch (pointerEvents) {
    case 'none':
      return { cursor: 'auto', pointerEvents: 'none' };
    case 'auto':
      return { cursor: 'auto', pointerEvents: 'auto' };
    case 'box-none':
      return { cursor: 'auto', pointerEvents: 'none' };
    case 'box-only':
      return { cursor: 'pointer', pointerEvents: 'auto' };
    default:
      return {};
  }
};

/**
 * Handle text selection on web
 * React Native doesn't use this, but web needs proper cursor feedback
 */
export const getSelectableStyle = (
  selectable?: boolean
): React.CSSProperties => {
  if (!isWeb) return {};

  return {
    userSelect: selectable ? 'auto' : 'none',
  } as React.CSSProperties;
};

/**
 * Ensure specific CSS classes are NOT applied on web (for RN-specific layouts)
 * Useful for preventing Tailwind or custom CSS from interfering
 */
export const getWebSafeClassName = (
  className: string | undefined,
  removeClasses: string[] = []
): string => {
  if (!isWeb || !className) return className || '';

  return className
    .split(' ')
    .filter(cls => !removeClasses.includes(cls))
    .join(' ');
};

/**
 * Convert React Native layout props to CSS flexbox equivalents
 */
export const flexboxConverter = (style: RNStyle): React.CSSProperties => {
  if (!isWeb) return {};

  const cssProps: React.CSSProperties = {};

  // React Native flex
  if (style.flex !== undefined) {
    cssProps.flex = style.flex === 1 ? '1 1 auto' : `${style.flex}`;
  }

  // flexDirection
  if (style.flexDirection) {
    cssProps.flexDirection = style.flexDirection as any;
  }

  // justifyContent
  if (style.justifyContent) {
    cssProps.justifyContent = style.justifyContent as any;
  }

  // alignItems
  if (style.alignItems) {
    cssProps.alignItems = style.alignItems as any;
  }

  // alignContent
  if (style.alignContent) {
    cssProps.alignContent = style.alignContent as any;
  }

  // flexWrap
  if (style.flexWrap) {
    cssProps.flexWrap = style.flexWrap as any;
  }

  // gap (React Native added gap support in newer versions)
  if ((style as any).gap !== undefined) {
    cssProps.gap = `${(style as any).gap}px`;
  }

  // columnGap / rowGap
  if ((style as any).columnGap !== undefined) {
    cssProps.columnGap = `${(style as any).columnGap}px`;
  }
  if ((style as any).rowGap !== undefined) {
    cssProps.rowGap = `${(style as any).rowGap}px`;
  }

  return cssProps;
};
