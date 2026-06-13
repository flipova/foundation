/**
 * Box — Web Primitive (niveau 0)
 *
 * Miroir web du composant RN Box.
 * Résout les spacing/radius tokens et rend un <div> stylé.
 * Même API de props que son homologue React Native.
 *
 * Règle : tout composant web passe par Box. Box est l'unique pont
 * entre les tokens et le DOM.
 */

import React, { CSSProperties, useMemo } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import type { ColorScheme, CustomThemeMode, ThemeMode } from "../../theme/types";
import { radii, RadiusToken, shadows, ShadowToken, spacing, SpacingToken } from "../../tokens";

// ─── Types ────────────────────────────────────────────────────────────────────

export type GradientDirection =
  | "toTop"
  | "toBottom"
  | "toLeft"
  | "toRight"
  | "toTopLeft"
  | "toTopRight"
  | "toBottomLeft"
  | "toBottomRight";

type CSSFlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
type CSSAlignItems = "stretch" | "flex-start" | "flex-end" | "center" | "baseline";
type CSSJustifyContent =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  // ── Espacement ──────────────────────────────────────────────────────────────
  p?: SpacingToken;
  pt?: SpacingToken;
  pr?: SpacingToken;
  pb?: SpacingToken;
  pl?: SpacingToken;
  px?: SpacingToken;
  py?: SpacingToken;
  m?: SpacingToken;
  mt?: SpacingToken;
  mr?: SpacingToken;
  mb?: SpacingToken;
  ml?: SpacingToken;
  mx?: SpacingToken;
  my?: SpacingToken;

  // ── Fond & gradient ─────────────────────────────────────────────────────────
  bg?: string;
  gradient?: keyof ColorScheme["gradients"] | [string, string, ...string[]];
  gradientDirection?: GradientDirection;

  // ── Bordure ─────────────────────────────────────────────────────────────────
  borderRadius?: RadiusToken;
  borderTopLeftRadius?: RadiusToken;
  borderTopRightRadius?: RadiusToken;
  borderBottomLeftRadius?: RadiusToken;
  borderBottomRightRadius?: RadiusToken;

  // ── Ombre ───────────────────────────────────────────────────────────────────
  shadow?: ShadowToken;

  // ── Flex ────────────────────────────────────────────────────────────────────
  flex?: number;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: CSSProperties["flexBasis"];
  flexDirection?: CSSFlexDirection;
  alignItems?: CSSAlignItems;
  alignSelf?: CSSProperties["alignSelf"];
  justifyContent?: CSSJustifyContent;
  gap?: SpacingToken;
  rowGap?: SpacingToken;
  columnGap?: SpacingToken;
  flexWrap?: CSSProperties["flexWrap"];

  // ── Dimensions ──────────────────────────────────────────────────────────────
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  minWidth?: CSSProperties["minWidth"];
  minHeight?: CSSProperties["minHeight"];
  maxWidth?: CSSProperties["maxWidth"];
  maxHeight?: CSSProperties["maxHeight"];

  // ── Positionnement ──────────────────────────────────────────────────────────
  position?: CSSProperties["position"];
  top?: CSSProperties["top"];
  right?: CSSProperties["right"];
  bottom?: CSSProperties["bottom"];
  left?: CSSProperties["left"];
  zIndex?: CSSProperties["zIndex"];

  // ── Divers ──────────────────────────────────────────────────────────────────
  overflow?: CSSProperties["overflow"];
  opacity?: number;

  // ── Escape hatch ────────────────────────────────────────────────────────────
  style?: CSSProperties;

  /** Surcharge de thème local */
  theme?: ThemeMode | CustomThemeMode;

  /** Rendu en tant qu'élément différent (polymorphism) */
  as?: keyof React.JSX.IntrinsicElements;

  children?: React.ReactNode;
}

// ─── Gradient helpers ─────────────────────────────────────────────────────────

const GRADIENT_ANGLES: Record<GradientDirection, string> = {
  toTop:         "to top",
  toBottom:      "to bottom",
  toLeft:        "to left",
  toRight:       "to right",
  toTopLeft:     "to top left",
  toTopRight:    "to top right",
  toBottomLeft:  "to bottom left",
  toBottomRight: "to bottom right",
};

function buildGradient(
  colors: string[],
  direction: GradientDirection
): string {
  return `linear-gradient(${GRADIENT_ANGLES[direction]}, ${colors.join(", ")})`;
}

// ─── Shadow helper — convertit le format RN en box-shadow CSS ─────────────────

function rnShadowToCss(s: Record<string, unknown>): string {
  const ox = (s.shadowOffset as { width?: number } | undefined)?.width ?? 0;
  const oy = (s.shadowOffset as { height?: number } | undefined)?.height ?? 2;
  const blur = (s.shadowRadius as number | undefined) ?? 2;
  const opacity = (s.shadowOpacity as number | undefined) ?? 0.2;
  return `${ox}px ${oy}px ${blur * 2}px rgba(0,0,0,${opacity})`;
}

// ─── Composant ────────────────────────────────────────────────────────────────

const Box = React.forwardRef<HTMLDivElement, BoxProps>(({
  // Padding
  p, pt, pr, pb, pl, px, py,
  // Margin
  m, mt, mr, mb, ml, mx, my,
  // Fond
  bg, gradient, gradientDirection = "toBottom",
  // Bordure
  borderRadius, borderTopLeftRadius, borderTopRightRadius,
  borderBottomLeftRadius, borderBottomRightRadius,
  // Ombre
  shadow,
  // Flex
  flex, flexGrow, flexShrink, flexBasis, flexDirection,
  alignItems, alignSelf, justifyContent, gap, rowGap, columnGap, flexWrap,
  // Dimensions
  width, height, minWidth, minHeight, maxWidth, maxHeight,
  // Position
  overflow, opacity, position, top, right, bottom, left, zIndex,
  style,
  theme: themeProp,
  as: Tag = "div",
  children,
  ...rest
}, ref) => {
  const { theme: currentTheme } = useTheme(themeProp);

  const computedStyle = useMemo<CSSProperties>(() => {
    // Gradient
    let backgroundImage: string | undefined;
    let backgroundColor: string | undefined;

    if (gradient) {
      const colors: string[] = Array.isArray(gradient)
        ? gradient
        : (currentTheme.gradients[gradient] ?? [bg ?? "transparent", bg ?? "transparent"]);
      backgroundImage = buildGradient(colors, gradientDirection);
    } else {
      backgroundColor = bg;
    }

    // Shadow → box-shadow
    let boxShadow: string | undefined;
    if (shadow) {
      boxShadow = rnShadowToCss(shadows[shadow] as Record<string, unknown>);
    }

    const sp = (token: SpacingToken | undefined): number | undefined =>
      token != null ? spacing[token] : undefined;

    const resolved: CSSProperties = {
      // Padding
      padding:         sp(p) != null && !px && !py && !pt && !pr && !pb && !pl ? sp(p) : undefined,
      paddingTop:      sp(pt) ?? sp(py) ?? sp(p),
      paddingRight:    sp(pr) ?? sp(px) ?? sp(p),
      paddingBottom:   sp(pb) ?? sp(py) ?? sp(p),
      paddingLeft:     sp(pl) ?? sp(px) ?? sp(p),

      // Margin
      margin:          sp(m) != null && !mx && !my && !mt && !mr && !mb && !ml ? sp(m) : undefined,
      marginTop:       sp(mt) ?? sp(my) ?? sp(m),
      marginRight:     sp(mr) ?? sp(mx) ?? sp(m),
      marginBottom:    sp(mb) ?? sp(my) ?? sp(m),
      marginLeft:      sp(ml) ?? sp(mx) ?? sp(m),

      // Background
      backgroundColor,
      backgroundImage,

      // Border radius
      borderRadius:            borderRadius            ? radii[borderRadius]            : undefined,
      borderTopLeftRadius:     borderTopLeftRadius     ? radii[borderTopLeftRadius]     : undefined,
      borderTopRightRadius:    borderTopRightRadius    ? radii[borderTopRightRadius]    : undefined,
      borderBottomLeftRadius:  borderBottomLeftRadius  ? radii[borderBottomLeftRadius]  : undefined,
      borderBottomRightRadius: borderBottomRightRadius ? radii[borderBottomRightRadius] : undefined,

      // Shadow
      boxShadow,

      // Flex
      display: flex != null || flexDirection || alignItems || justifyContent || flexGrow != null
        ? "flex"
        : undefined,
      flex,
      flexGrow,
      flexShrink,
      flexBasis,
      flexDirection,
      alignItems,
      alignSelf,
      justifyContent,
      gap:       gap       != null ? spacing[gap]       : undefined,
      rowGap:    rowGap    != null ? spacing[rowGap]    : undefined,
      columnGap: columnGap != null ? spacing[columnGap] : undefined,
      flexWrap,

      // Dimensions
      width, height, minWidth, minHeight, maxWidth, maxHeight,

      // Misc
      overflow, opacity, position, top, right, bottom, left, zIndex,

      // Merge user style last
      ...style,
    };

    // Remove undefined keys to keep style lean
    return Object.fromEntries(
      Object.entries(resolved).filter(([, v]) => v !== undefined)
    ) as CSSProperties;
  }, [
    p, pt, pr, pb, pl, px, py,
    m, mt, mr, mb, ml, mx, my,
    bg, gradient, gradientDirection, currentTheme,
    borderRadius, borderTopLeftRadius, borderTopRightRadius,
    borderBottomLeftRadius, borderBottomRightRadius,
    shadow, flex, flexGrow, flexShrink, flexBasis, flexDirection,
    alignItems, alignSelf, justifyContent, gap, rowGap, columnGap, flexWrap,
    width, height, minWidth, minHeight, maxWidth, maxHeight,
    overflow, opacity, position, top, right, bottom, left, zIndex, style,
  ]);

  return React.createElement(Tag as string, { ref, style: computedStyle, ...rest }, children);
});

Box.displayName = "Box";

export default Box;
