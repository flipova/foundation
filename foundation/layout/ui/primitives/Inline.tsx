/**
 * Inline — Primitive niveau 1 (axe horizontal)
 *
 * Aligne ses enfants côte à côte avec espacement uniforme.
 * Construit sur Box ; ne touche jamais ViewStyle directement.
 *
 * Règle : si tu as besoin d'un axe vertical → utilise Stack.
 *
 * @example
 * // Bouton avec icône + label
 * <Inline spacing={2} align="center">
 *   <Icon name="star" />
 *   <Text>Favoris</Text>
 * </Inline>
 *
 * // Tags avec retour à la ligne
 * <Inline spacing={2} wrap>
 *   {tags.map(t => <Tag key={t} label={t} />)}
 * </Inline>
 *
 * // Barre de navigation : items aux extrémités
 * <Inline justify="space-between" fillWidth>
 *   <Logo />
 *   <Menu />
 * </Inline>
 */

import React, { useMemo } from "react";
import { ViewStyle } from "react-native";
import { SpacingToken } from "../../../tokens/spacing";
import Box, { BoxProps } from "./Box";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InlineProps extends Omit<BoxProps, "gap" | "flexDirection" | "flexWrap"> {
  /** Espacement entre enfants (token spacing). Défaut : 0. */
  spacing?: SpacingToken;
  /** Alignement transversal (`alignItems`). Défaut : "center". */
  align?: BoxProps["alignItems"];
  /** Alignement principal (`justifyContent`). Défaut : "flex-start". */
  justify?: BoxProps["justifyContent"];
  /** Autorise le retour à la ligne. */
  wrap?: boolean;
  /** Inverse l'ordre (`row-reverse`). */
  reverse?: boolean;
  /** Raccourci pour `width: "100%"`. */
  fillWidth?: boolean;
}

// ─── Composant ────────────────────────────────────────────────────────────────

const Inline: React.FC<InlineProps> = ({
  spacing: spacingToken = 0,
  align = "center",
  justify = "flex-start",
  wrap = false,
  reverse = false,
  fillWidth = false,
  children,
  style,
  ...rest
}) => {
  const layoutProps = useMemo(
    () => ({
      flexDirection: (reverse ? "row-reverse" : "row") as ViewStyle["flexDirection"],
      flexWrap: (wrap ? "wrap" : "nowrap") as ViewStyle["flexWrap"],
      alignItems: align,
      justifyContent: justify,
      gap: spacingToken,
      width: fillWidth ? ("100%" as const) : undefined,
    }),
    [reverse, wrap, align, justify, spacingToken, fillWidth]
  );

  const resolvedStyle = useMemo(
    () => (Array.isArray(style) ? style : style ? [style] : []),
    [style]
  );

  return (
    <Box {...layoutProps} style={resolvedStyle as ViewStyle[]} {...rest}>
      {children}
    </Box>
  );
};

export default Inline;