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
import Box from "./primitives/Box";
import Scroll from "./primitives/Scroll";

const META = getLayoutMeta("GridLayout")!;

export interface GridLayoutProps {
  children: React.ReactNode[];
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

  const gridRows = useMemo(() => {
    const arr = React.Children.toArray(cfg.children).filter(Boolean);
    const rows: React.ReactNode[][] = [];
    for (let i = 0; i < arr.length; i += columns) {
      rows.push(arr.slice(i, i + columns));
    }
    return rows;
  }, [cfg.children, columns]);

  const content = (
    <Box flex={1} p={cfg.padding} width="100%" maxWidth={cfg.maxWidth} alignSelf="center" gap={finalSpacing}>
      {gridRows.map((row, rowIndex) => (
        <Box key={`row-${rowIndex}`} flexDirection="row" gap={finalSpacing} width="100%">
          {row.map((child, colIndex) => (
            <Box key={`col-${colIndex}`} flex={1} height={cfg.cellHeight} bg={cfg.itemBackground} borderRadius={cfg.itemBorderRadius} overflow="hidden">
              {child}
            </Box>
          ))}
          {row.length < columns &&
            Array.from({ length: columns - row.length }).map((_, i) => (
              <Box key={`empty-${i}`} flex={1} height={cfg.cellHeight} bg="transparent" />
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
