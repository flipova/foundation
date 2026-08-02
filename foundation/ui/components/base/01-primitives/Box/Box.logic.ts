import React, { useMemo } from 'react';
import BoxMeta from './Box.meta.yaml';

/**
 * Properties for the Box component.
 */
export interface BoxProps {
  /** The content to be rendered inside the Box. */
  children?: React.ReactNode;
  /** Defines how the Box grows or shrinks to fill available space within a flex container. */
  flex?: number;
  /** Background color of the Box. Can be a theme token or a literal color value. */
  bg?: string;
  /** Padding applied uniformly to all sides. */
  p?: number | string;
  /** Padding applied to the horizontal sides (left and right). */
  px?: number | string;
  /** Padding applied to the vertical sides (top and bottom). */
  py?: number | string;
  /** Margin applied uniformly to all sides. */
  m?: number | string;
  /** Margin applied to the horizontal sides (left and right). */
  mx?: number | string;
  /** Margin applied to the vertical sides (top and bottom). */
  my?: number | string;
  /** Fixed width of the Box. */
  width?: number | string;
  /** Fixed height of the Box. */
  height?: number | string;
  /** Maximum width the Box can grow to. */
  maxWidth?: number | string;
  /** Minimum height the Box must have. */
  minHeight?: number | string;
  /** Border radius for rounding the corners of the Box. */
  borderRadius?: number | string;
  /** Determines how to handle content that overflows the Box's bounds. */
  overflow?: 'visible' | 'hidden' | 'scroll';
  /** Flexbox property to align children along the main axis. */
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  /** Flexbox property to align children along the cross axis. */
  alignItems?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
  /** Overrides the alignItems value for this specific Box within its parent flex container. */
  alignSelf?: 'auto' | 'flex-start' | 'center' | 'flex-end' | 'stretch';
  /** Any other props (including accessibility and View props) to spread onto the root element. */
  [key: string]: any;
}

export function useBoxLogic(props: BoxProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (BoxMeta?.props) {
      BoxMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  
  // Explicitly extract known layout props for security and optimization
  const { 
    children, flex, bg, p, px, py, m, mx, my, width, height, 
    maxWidth, minHeight, borderRadius, overflow, 
    justifyContent, alignItems, alignSelf, ...rest 
  } = merged;

  const layoutProps = {
    flex, bg, p, px, py, m, mx, my, width, height, 
    maxWidth, minHeight, borderRadius, overflow, 
    justifyContent, alignItems, alignSelf
  };

  return { children, layoutProps, rest };
}
