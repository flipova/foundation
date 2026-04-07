/**
 * Box — Primitive niveau 0
 *
 * Règle d'or : AUCUN layout composant ne touche ViewStyle directement.
 * Tout passe par Box. Box est l'unique pont entre les tokens et React Native.
 *
 * Ce que Box fait :
 *   - Résout les spacing tokens (p, m, gap…) → nombre RN
 *   - Résout les radius tokens, shadow tokens
 *   - Gère le gradient (LinearGradient) de façon transparente
 *   - Supporte les valeurs responsives via ResponsiveValue<T>
 *   - Accepte un override de theme local
 *
 * Ce que Box ne fait PAS :
 *   - Pas d'opinion sur la direction (colonne/ligne → Stack / Inline)
 *   - Pas de scroll (→ Scroll)
 *   - Pas de centrage sémantique (→ Center)
 */

import React, { useMemo } from "react";
import { View, ViewProps, ViewStyle } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import type { ColorScheme, CustomThemeMode, ThemeMode } from "../../../theme/types";
import {
  radii,
  RadiusToken,
  shadows,
  ShadowToken,
  spacing,
  SpacingToken,
} from "../../../tokens";
import { useResponsiveValue } from "../../hooks/useResponsiveValue";
import { ResponsiveValue } from "../../utils/responsive";

// expo-linear-gradient may not be available in all environments (e.g. studio preview)
let LinearGradient: React.ComponentType<any> | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LinearGradient = require("expo-linear-gradient").LinearGradient ?? null;
} catch {
  LinearGradient = null;
}

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

export interface BoxProps extends Omit<ViewProps, "style"> {
  // ── Espacement ──────────────────────────────────────────────────────────────
  p?: ResponsiveValue<SpacingToken>;
  pt?: ResponsiveValue<SpacingToken>;
  pr?: ResponsiveValue<SpacingToken>;
  pb?: ResponsiveValue<SpacingToken>;
  pl?: ResponsiveValue<SpacingToken>;
  px?: ResponsiveValue<SpacingToken>;
  py?: ResponsiveValue<SpacingToken>;
  m?: ResponsiveValue<SpacingToken>;
  mt?: ResponsiveValue<SpacingToken>;
  mr?: ResponsiveValue<SpacingToken>;
  mb?: ResponsiveValue<SpacingToken>;
  ml?: ResponsiveValue<SpacingToken>;
  mx?: ResponsiveValue<SpacingToken>;
  my?: ResponsiveValue<SpacingToken>;

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
  flexBasis?: ViewStyle["flexBasis"];
  flexDirection?: ViewStyle["flexDirection"];
  alignItems?: ViewStyle["alignItems"];
  alignSelf?: ViewStyle["alignSelf"];
  justifyContent?: ViewStyle["justifyContent"];
  gap?: SpacingToken;
  rowGap?: SpacingToken;
  columnGap?: SpacingToken;
  flexWrap?: ViewStyle["flexWrap"];

  // ── Dimensions ──────────────────────────────────────────────────────────────
  width?: ViewStyle["width"];
  height?: ViewStyle["height"];
  minWidth?: ViewStyle["minWidth"];
  minHeight?: ViewStyle["minHeight"];
  maxWidth?: ViewStyle["maxWidth"];
  maxHeight?: ViewStyle["maxHeight"];

  // ── Positionnement ──────────────────────────────────────────────────────────
  position?: ViewStyle["position"];
  top?: ViewStyle["top"] | SpacingToken;
  right?: ViewStyle["right"] | SpacingToken;
  bottom?: ViewStyle["bottom"] | SpacingToken;
  left?: ViewStyle["left"] | SpacingToken;
  zIndex?: ViewStyle["zIndex"];

  // ── Divers ──────────────────────────────────────────────────────────────────
  overflow?: ViewStyle["overflow"];
  opacity?: ViewStyle["opacity"];

  // ── Escape hatch — à éviter, documenter si utilisé ─────────────────────────
  style?: ViewStyle | ViewStyle[];

  children?: React.ReactNode;

  /** Surcharge de thème local (ex. : forcer dark dans un composant). */
  theme?: ThemeMode | CustomThemeMode;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const GRADIENT_VECTORS: Record<
  GradientDirection,
  { start: { x: number; y: number }; end: { x: number; y: number } }
> = {
  toTop:         { start: { x: 0.5, y: 1   }, end: { x: 0.5, y: 0   } },
  toBottom:      { start: { x: 0.5, y: 0   }, end: { x: 0.5, y: 1   } },
  toLeft:        { start: { x: 1,   y: 0.5 }, end: { x: 0,   y: 0.5 } },
  toRight:       { start: { x: 0,   y: 0.5 }, end: { x: 1,   y: 0.5 } },
  toTopLeft:     { start: { x: 1,   y: 1   }, end: { x: 0,   y: 0   } },
  toTopRight:    { start: { x: 0,   y: 1   }, end: { x: 1,   y: 0   } },
  toBottomLeft:  { start: { x: 1,   y: 0   }, end: { x: 0,   y: 1   } },
  toBottomRight: { start: { x: 0,   y: 0   }, end: { x: 1,   y: 1   } },
};

// ─── Helpers (module-private) ─────────────────────────────────────────────────

/** Résout un SpacingToken → px. Retourne undefined si absent. */
function sp(token: SpacingToken | null | undefined): number | undefined {
  return token != null ? spacing[token] : undefined;
}

/**
 * Résout une valeur de positionnement.
 * Accepte un SpacingToken, un nombre ou un pourcentage ("50%").
 */
function resolvePosition(
  value: ViewStyle["top"] | SpacingToken | undefined
): ViewStyle["top"] | undefined {
  if (value == null) return undefined;
  if (typeof value === "string" && value in spacing)
    return spacing[value as unknown as SpacingToken];
  return value as ViewStyle["top"];
}

// ─── Composant ────────────────────────────────────────────────────────────────

/**
 * @example
 * // Layout simple
 * <Box px={4} py={2} bg={theme.card} borderRadius="md">…</Box>
 *
 * // Gradient
 * <Box gradient="primary" gradientDirection="toRight" p={6}>…</Box>
 *
 * // Responsive spacing
 * <Box px={{ xs: 4, md: 8 }}>…</Box>
 */
const Box: React.FC<BoxProps> = ({
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
  style, children, theme,
  ...rest
}) => {
  const { theme: currentTheme } = useTheme(theme);

  // Résolution responsive (chaque hook = 1 appel, règle des hooks respectée)
  const resP  = useResponsiveValue(p);
  const resPT = useResponsiveValue(pt);
  const resPR = useResponsiveValue(pr);
  const resPB = useResponsiveValue(pb);
  const resPL = useResponsiveValue(pl);
  const resPX = useResponsiveValue(px);
  const resPY = useResponsiveValue(py);
  const resM  = useResponsiveValue(m);
  const resMT = useResponsiveValue(mt);
  const resMR = useResponsiveValue(mr);
  const resMB = useResponsiveValue(mb);
  const resML = useResponsiveValue(ml);
  const resMX = useResponsiveValue(mx);
  const resMY = useResponsiveValue(my);

  const { boxStyle, gradientConfig } = useMemo(() => {
    // ── Gradient ──────────────────────────────────────────────────────────────
    let gradientColors: string[] | null = null;
    if (gradient) {
      gradientColors = Array.isArray(gradient)
        ? gradient
        : (currentTheme.gradients[gradient] ?? [bg ?? "transparent", bg ?? "transparent"]);
    }

    // ── Style calculé ─────────────────────────────────────────────────────────
    const computed: ViewStyle = {
      // Padding
      padding:           sp(resP),
      paddingTop:        sp(resPT),
      paddingRight:      sp(resPR),
      paddingBottom:     sp(resPB),
      paddingLeft:       sp(resPL),
      paddingHorizontal: sp(resPX),
      paddingVertical:   sp(resPY),

      // Margin
      margin:            sp(resM),
      marginTop:         sp(resMT),
      marginRight:       sp(resMR),
      marginBottom:      sp(resMB),
      marginLeft:        sp(resML),
      marginHorizontal:  sp(resMX),
      marginVertical:    sp(resMY),

      // Fond — omis quand gradient actif (LinearGradient gère ça)
      backgroundColor: gradientColors ? undefined : bg,

      // Bordure
      borderRadius:            borderRadius            ? radii[borderRadius]            : undefined,
      borderTopLeftRadius:     borderTopLeftRadius     ? radii[borderTopLeftRadius]     : undefined,
      borderTopRightRadius:    borderTopRightRadius    ? radii[borderTopRightRadius]    : undefined,
      borderBottomLeftRadius:  borderBottomLeftRadius  ? radii[borderBottomLeftRadius]  : undefined,
      borderBottomRightRadius: borderBottomRightRadius ? radii[borderBottomRightRadius] : undefined,

      // Flex
      flex, flexGrow, flexShrink, flexBasis, flexDirection,
      alignItems, alignSelf, justifyContent, flexWrap,
      gap:       gap       != null ? spacing[gap]       : undefined,
      rowGap:    rowGap    != null ? spacing[rowGap]    : undefined,
      columnGap: columnGap != null ? spacing[columnGap] : undefined,

      // Dimensions
      width, height, minWidth, minHeight, maxWidth, maxHeight,

      // Divers
      overflow, opacity, position, zIndex,
      top:    resolvePosition(top),
      right:  resolvePosition(right),
      bottom: resolvePosition(bottom),
      left:   resolvePosition(left),

      // Ombre
      ...(shadow ? shadows[shadow] : {}),
    };

    const flatStyle = [computed, ...(Array.isArray(style) ? style : style ? [style] : [])];

    return {
      boxStyle: flatStyle,
      gradientConfig: gradientColors
        ? { colors: gradientColors, ...GRADIENT_VECTORS[gradientDirection] }
        : null,
    };
  }, [
    resP, resPT, resPR, resPB, resPL, resPX, resPY,
    resM, resMT, resMR, resMB, resML, resMX, resMY,
    bg, gradient, gradientDirection, currentTheme,
    borderRadius, borderTopLeftRadius, borderTopRightRadius,
    borderBottomLeftRadius, borderBottomRightRadius,
    shadow, flex, flexGrow, flexShrink, flexBasis, flexDirection,
    alignItems, alignSelf, justifyContent, gap, rowGap, columnGap, flexWrap,
    width, height, minWidth, minHeight, maxWidth, maxHeight,
    overflow, opacity, position, top, right, bottom, left, zIndex, style,
  ]);

  if (gradientConfig && LinearGradient) {
    return (
      <LinearGradient
        colors={gradientConfig.colors as [string, string, ...string[]]}
        start={gradientConfig.start}
        end={gradientConfig.end}
        style={boxStyle as ViewStyle[]}
        {...rest}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={boxStyle as ViewStyle[]} {...rest}>
      {children}
    </View>
  );
};

export default Box;