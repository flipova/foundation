/**
 * GridLayout — Web Layout
 *
 * Grille CSS responsive avec colonnes adaptatives.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken, spacing, SpacingToken } from "../../tokens";
import { applyDefaults, getLayoutMeta } from "../../layout/registry";

const META = getLayoutMeta("GridLayout")!;

export interface GridLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  cellHeight?: number;
  spacing?: SpacingToken;
  maxWidth?: number;
  scrollable?: boolean;
  padding?: SpacingToken;
  itemBackground?: string;
  itemBorderRadius?: RadiusToken;
  background?: string;
  borderRadius?: RadiusToken;
  compact?: boolean;
  /** Individual items — if provided, renders inside the grid */
  items?: React.ReactNode[];
}

const GridLayout: React.FC<GridLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    columns, cellHeight, spacing: spacingToken, maxWidth, scrollable,
    padding: paddingToken, itemBackground, itemBorderRadius, background,
    borderRadius, compact, items, children, style, ...rest
  } = applyDefaults(rawProps, META, theme) as Required<GridLayoutProps> & typeof rawProps;

  const gap = spacingToken != null ? spacing[spacingToken] : 0;
  const pad = paddingToken != null ? spacing[paddingToken] : 0;
  const minCellWidth = compact ? 140 : 200;

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: columns
      ? `repeat(${columns}, 1fr)`
      : `repeat(auto-fill, minmax(${minCellWidth}px, 1fr))`,
    gap,
    width: "100%",
    maxWidth: maxWidth ?? undefined,
    padding: pad,
    backgroundColor: background ?? "transparent",
    borderRadius: borderRadius ? radii[borderRadius] : undefined,
    overflowY: scrollable ? "auto" : undefined,
    boxSizing: "border-box",
    ...style,
  };

  const cellStyle: CSSProperties = {
    height: cellHeight ?? undefined,
    backgroundColor: itemBackground ?? theme.card,
    borderRadius: itemBorderRadius ? radii[itemBorderRadius] : undefined,
    overflow: "hidden",
    boxSizing: "border-box",
  };

  if (items && items.length > 0) {
    return (
      <div style={gridStyle} {...rest}>
        {items.map((item, i) => (
          <div key={i} style={cellStyle}>{item}</div>
        ))}
      </div>
    );
  }

  return (
    <div style={gridStyle} {...rest}>
      {children}
    </div>
  );
};

export default GridLayout;
