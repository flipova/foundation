/**
 * GridLayout
 *
 * Responsive grid with adaptive columns based on breakpoint.
 * Supports scrolling, padding, and compact mode.
 */

import React, { useMemo } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken, SpacingToken } from "../../tokens";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { applyDefaults, getLayoutMeta } from "../registry";
import { useStudioItems } from "../hooks/useStudioItems";
import Box from "./primitives/Box";
import Scroll from "./primitives/Scroll";

const META = getLayoutMeta("GridLayout")!;

export interface GridLayoutProps {
  items?: React.ReactNode[];
  children?: React.ReactNode | React.ReactNode[]; // backward compat
  columns?: number;
  cellHeight?: number | "auto";
  spacing?: SpacingToken;
  maxWidth?: number;
  scrollable?: boolean;
  padding?: SpacingToken;
  itemBackground?: string;
  itemBorderRadius?: RadiusToken;
  background?: string;
  borderRadius?: RadiusToken;
  compact?: boolean;
}

const GridLayout: React.FC<GridLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const cfg = applyDefaults(rawProps, META, theme) as Required<GridLayoutProps>;
  const { isMobile, isTablet } = useBreakpoint();

  const defaultColumns = useMemo(() => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  }, [isMobile, isTablet]);

  const columns = cfg.columns ?? defaultColumns;
  const finalSpacing = cfg.compact ? 2 as SpacingToken : cfg.spacing;

  // Standard: accept `items` (primary) or `children` (backward compat)
  const rawItems = Array.isArray(cfg.items) && cfg.items.length > 0
    ? cfg.items
    : React.Children.toArray(cfg.children as React.ReactNode).filter(Boolean);
  const resolvedChildren = useStudioItems(
    rawItems,
    4,
    (i) => <Box key={i} flex={1} minHeight={80} bg={cfg.itemBackground} borderRadius={cfg.itemBorderRadius} opacity={0.4} />
  );

  const gridRows = useMemo(() => {
    const rows: React.ReactNode[][] = [];
    for (let i = 0; i < resolvedChildren.length; i += columns) {
      rows.push(resolvedChildren.slice(i, i + columns));
    }
    return rows;
  }, [resolvedChildren, columns]);

  const content = (
    <Box flex={1} p={cfg.padding} width="100%" maxWidth={cfg.maxWidth} alignSelf="center" gap={finalSpacing}>
      {gridRows.map((row, rowIndex) => (
        <Box key={`row-${rowIndex}`} flexDirection="row" gap={finalSpacing} width="100%">
          {row.map((child, colIndex) => (
            <Box key={`col-${colIndex}`} flex={1} height={cfg.cellHeight ?? undefined} bg={cfg.itemBackground} borderRadius={cfg.itemBorderRadius} overflow="hidden">
              {child}
            </Box>
          ))}
          {row.length < columns &&
            Array.from({ length: columns - row.length }).map((_, i) => (
              <Box key={`empty-${i}`} flex={1} height={cfg.cellHeight ?? undefined} bg="transparent" />
            ))}
        </Box>
      ))}
    </Box>
  );

  return (
    <Box flex={1} bg={cfg.background} borderRadius={cfg.borderRadius} overflow="hidden">
      {cfg.scrollable ? (
        <Scroll contentContainerStyle={{ flexGrow: 1 }}>{content}</Scroll>
      ) : (
        content
      )}
    </Box>
  );
};

export default GridLayout;
