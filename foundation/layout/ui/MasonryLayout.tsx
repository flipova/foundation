/**
 * MasonryLayout
 *
 * Multi-column masonry grid with alternating item distribution.
 * Supports scrolling, directional padding, and custom backgrounds.
 */

import React, { useMemo } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken, SpacingToken } from "../../tokens";
import { LayoutPadding } from "../types";
import { applyDefaults, getLayoutMeta } from "../registry";
import { useStudioItems } from "../hooks/useStudioItems";
import Box from "./primitives/Box";
import Scroll from "./primitives/Scroll";

const META = getLayoutMeta("MasonryLayout")!;

export interface MasonryLayoutProps {
  items?: React.ReactNode[];
  children?: React.ReactNode | React.ReactNode[]; // backward compat
  columns?: number;
  spacing?: SpacingToken;
  maxWidth?: number;
  scrollable?: boolean;
  background?: string;
  borderRadius?: RadiusToken;
  itemBackground?: string;
  itemBorderRadius?: RadiusToken;
  padding?: LayoutPadding;
}

const MasonryLayout: React.FC<MasonryLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    items: itemsProp, children: childrenProp,
    columns, spacing, maxWidth, scrollable,
    background, borderRadius, itemBackground, itemBorderRadius, padding,
  } = applyDefaults(rawProps, META, theme) as Required<MasonryLayoutProps>;

  // Standard: items > children (backward compat)
  const rawItems = Array.isArray(itemsProp) && itemsProp.length > 0
    ? itemsProp
    : React.Children.toArray(childrenProp as React.ReactNode).filter(Boolean);

  const resolvedItems = useStudioItems(
    rawItems,
    4,
    (i) => <Box key={i} height={120} bg={itemBackground} borderRadius={itemBorderRadius} opacity={0.4} />
  );

  const columnWrappers = useMemo(() => {
    const wrappers: React.ReactNode[][] = Array.from({ length: columns }, () => []);
    resolvedItems.forEach((item, index) => {
      wrappers[index % columns].push(item);
    });
    return wrappers;
  }, [resolvedItems, columns]);

  const renderMasonryContent = () => (
    <Box 
      flexDirection="row" 
      gap={spacing} 
      width="100%"
      pt={padding?.vertical ?? padding?.top}
      pb={padding?.vertical ?? padding?.bottom}
      pl={padding?.horizontal ?? padding?.left}
      pr={padding?.horizontal ?? padding?.right}
    >
      {columnWrappers.map((column, columnIndex) => (
        <Box 
          key={`masonry-col-${columnIndex}`} 
          flex={1} 
          gap={spacing}
        >
          {column.map((item, itemIndex) => (
            <Box 
              key={`masonry-item-${itemIndex}`} 
              bg={itemBackground}
              borderRadius={itemBorderRadius}
              overflow="hidden"
            >
              {item}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );

  return (
    <Box 
      flex={1} 
      bg={background} 
      borderRadius={borderRadius} 
      maxWidth={maxWidth} 
      alignSelf="center" 
      width="100%"
      overflow="hidden"
    >
      {scrollable ? (
        <Scroll contentContainerStyle={{ flexGrow: 1 }}>
          {renderMasonryContent()}
        </Scroll>
      ) : (
        renderMasonryContent()
      )}
    </Box>
  );
};

export default MasonryLayout;
