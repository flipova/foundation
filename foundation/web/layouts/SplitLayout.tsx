/**
 * SplitLayout — Web Layout
 *
 * Deux panneaux avec séparation redimensionnable optionnelle.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken, spacing, SpacingToken } from "../../tokens";
import { applyDefaults, getLayoutMeta } from "../../layout/registry";

const META = getLayoutMeta("SplitLayout")!;

export interface SplitLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  left?: React.ReactNode;
  right?: React.ReactNode;
  spacing?: SpacingToken;
  leftWidth?: number;
  ratio?: number;
  orientation?: "horizontal" | "vertical";
  hideLeftOnMobile?: boolean;
  background?: string;
  borderRadius?: RadiusToken;
  leftBackground?: string;
  rightBackground?: string;
  leftBorderRadius?: RadiusToken;
  rightBorderRadius?: RadiusToken;
}

const SplitLayout: React.FC<SplitLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    left, right, spacing: spacingToken, leftWidth, ratio, orientation,
    hideLeftOnMobile, background, borderRadius, leftBackground,
    rightBackground, leftBorderRadius, rightBorderRadius,
    children, style, ...rest
  } = applyDefaults(rawProps, META, theme) as Required<SplitLayoutProps> & typeof rawProps;

  const gap = spacingToken != null ? spacing[spacingToken] : 0;
  const r = ratio ?? 0.5;
  const isVertical = orientation === "vertical";

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: isVertical ? "column" : "row",
    gap,
    width: "100%",
    height: isVertical ? "100%" : undefined,
    minHeight: isVertical ? undefined : "100%",
    backgroundColor: background ?? undefined,
    borderRadius: borderRadius ? radii[borderRadius] : undefined,
    boxSizing: "border-box",
    ...style,
  };

  const leftStyle: CSSProperties = {
    flex: leftWidth ? undefined : r,
    width: leftWidth ?? undefined,
    flexShrink: 0,
    backgroundColor: leftBackground ?? theme.card,
    borderRadius: leftBorderRadius ? radii[leftBorderRadius] : undefined,
    overflow: "auto",
    boxSizing: "border-box",
  };

  const rightStyle: CSSProperties = {
    flex: 1 - r,
    backgroundColor: rightBackground ?? theme.card,
    borderRadius: rightBorderRadius ? radii[rightBorderRadius] : undefined,
    overflow: "auto",
    minWidth: 0,
    boxSizing: "border-box",
  };

  return (
    <>
      {hideLeftOnMobile && (
        <style>{`
          @media (max-width: 768px) { .flipova-split-left { display: none !important; } }
        `}</style>
      )}
      <div style={containerStyle} {...rest}>
        <div className="flipova-split-left" style={leftStyle}>{left}</div>
        <div style={rightStyle}>{right ?? children}</div>
      </div>
    </>
  );
};

export default SplitLayout;
