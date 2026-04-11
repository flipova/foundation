/**
 * BentoLayout
 *
 * Dynamic bento-box grid for displaying content of varying sizes.
 * Automatically generates cell configurations or accepts manual ones, adapting to mobile/desktop.
 */

import React, { useMemo } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken } from "../../tokens/radii";
import { SpacingToken } from "../../tokens/spacing";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { applyDefaults, getLayoutMeta } from "../registry";
import { useStudioItems } from "../hooks/useStudioItems";
import Box from "./primitives/Box";
import Scroll from "./primitives/Scroll";

const META = getLayoutMeta("BentoLayout")!;

export interface BentoCellConfig {
  index: number;
  cols: number;
  rows: number;
  priority?: 'high' | 'medium' | 'low';
}

export interface BentoLayoutProps {
  items?: React.ReactNode[];
  children?: React.ReactNode | React.ReactNode[]; // backward compat
  spacing?: SpacingToken;
  itemBackground?: string;
  itemBorderRadius?: RadiusToken;
  scrollable?: boolean;
  maxWidth?: number;
  cellConfig?: BentoCellConfig[];
  baseHeight?: number;
  background?: string;
  borderRadius?: RadiusToken;
}

const generateModernBentoConfig = (itemCount: number, isMobile: boolean): BentoCellConfig[] => {
  const config: BentoCellConfig[] = [];
  const patterns = [
    [{ cols: 2, rows: 2 }, { cols: 2, rows: 1 }, { cols: 2, rows: 1 }],
    [{ cols: isMobile ? 2 : 1, rows: 1 }, { cols: isMobile ? 2 : 1, rows: 1 }, { cols: isMobile ? 2 : 2, rows: isMobile ? 1 : 2 }],
    [{ cols: 2, rows: 2 }, { cols: 1, rows: 1 }, { cols: 1, rows: 1 }],
    [{ cols: 3, rows: 1 }, { cols: 1, rows: 1 }, { cols: 1, rows: 1 }],
  ];

  let itemIndex = 0;
  let patternIndex = 0;

  while (itemIndex < itemCount) {
    const pattern = patterns[patternIndex % patterns.length];
    for (const cell of pattern) {
      if (itemIndex >= itemCount) break;
      config.push({
        index: itemIndex,
        cols: isMobile ? Math.min(cell.cols, 2) : cell.cols,
        rows: cell.rows,
      });
      itemIndex++;
    }
    patternIndex++;
  }
  return config;
};

const BentoLayout: React.FC<BentoLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    items: itemsProp, children: childrenProp,
    spacing, itemBackground, itemBorderRadius,
    scrollable, maxWidth, cellConfig, baseHeight, background, borderRadius,
  } = applyDefaults(rawProps, META, theme) as Required<BentoLayoutProps>;

  const { isMobile } = useBreakpoint();
  const maxCols = isMobile ? 2 : 4;

  // Standard: items > children (backward compat)
  const rawItems = Array.isArray(itemsProp) && itemsProp.length > 0
    ? itemsProp
    : React.Children.toArray(childrenProp as React.ReactNode).filter(Boolean);

  const resolvedItems = useStudioItems(
    rawItems,
    4,
    (i) => <Box key={i} flex={1} bg={itemBackground} borderRadius={itemBorderRadius} opacity={0.4} />
  );

  const itemPadding = useMemo(() => (Number(spacing) / 2) as SpacingToken, [spacing]);

  const bentoConfig = useMemo(() => 
    cellConfig || generateModernBentoConfig(resolvedItems.length, isMobile),
    [resolvedItems.length, isMobile, cellConfig]
  );

  const { placements, totalHeight } = useMemo(() => {    const grid: Record<number, Record<number, boolean>> = {};
    const results: any[] = [];

    const canPlace = (row: number, col: number, cols: number, rows: number) => {
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          if (grid[row + r]?.[col + c]) return false;
      return true;
    };

    const markOccupied = (row: number, col: number, cols: number, rows: number) => {
      for (let r = 0; r < rows; r++) {
        if (!grid[row + r]) grid[row + r] = {};
        for (let c = 0; c < cols; c++) grid[row + r][col + c] = true;
      }
    };

    bentoConfig.forEach((cell) => {
      let r = 0, found = false;
      while (!found && r < 1000) {
        for (let c = 0; c <= maxCols - cell.cols; c++) {
          if (canPlace(r, c, cell.cols, cell.rows)) {
            markOccupied(r, c, cell.cols, cell.rows);
            results.push({ index: cell.index, row: r, col: c, cols: cell.cols, rows: cell.rows });
            found = true; break;
          }
        }
        r++;
      }
    });

    return { placements: results, totalHeight: Math.max(...results.map(p => p.row + p.rows), 1) * baseHeight };
  }, [bentoConfig, baseHeight, maxCols]);

  const GridContent = (
    <Box
      width="100%"
      height={totalHeight}
      style={{ maxWidth: isMobile ? '100%' : maxWidth, alignSelf: 'center' }}
    >
      {placements.map((p) => (
        <Box
          key={`bento-${p.index}`}
          position="absolute"
          left={`${(p.col / maxCols) * 100}%`}
          top={p.row * baseHeight}
          width={`${(p.cols / maxCols) * 100}%`}
          height={p.rows * baseHeight}
          p={itemPadding}
        >
          <Box 
            flex={1} 
            bg={itemBackground || 'transparent'} 
            borderRadius={itemBorderRadius}
            overflow="hidden"
          >
            {resolvedItems[p.index]}
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box flex={1} bg={background} borderRadius={borderRadius} overflow="hidden">
      {scrollable ? (
        <Scroll showsVerticalScrollIndicator={false}>
          {GridContent}
        </Scroll>
      ) : (
        GridContent
      )}
    </Box>
  );
};

export default BentoLayout;
