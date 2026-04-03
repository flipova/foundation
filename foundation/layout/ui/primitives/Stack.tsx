/**
 * Stack — Primitive niveau 1 (axe vertical)
 *
 * Empile ses enfants en colonne avec un espacement uniforme.
 * Construit sur Box ; ne touche jamais ViewStyle directement.
 *
 * Règle : si tu as besoin d'un axe horizontal → utilise Inline.
 * Si tu mélanges les deux dans un écran → compose Stack + Inline.
 *
 * @example
 * <Stack spacing={4}>
 *   <Text>Titre</Text>
 *   <Text>Corps</Text>
 * </Stack>
 *
 * // Avec distribution
 * <Stack distribute fillHeight>
 *   <Header />
 *   <Content />
 *   <Footer />
 * </Stack>
 */

import React, { useMemo } from "react";
import { ViewStyle } from "react-native";
import { SpacingToken } from "../../../tokens/spacing";
import Box, { BoxProps } from "./Box";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StackProps extends Omit<BoxProps, "gap" | "flexDirection"> {
  /** Espacement entre enfants (token spacing). Défaut : 0. */
  spacing?: SpacingToken;
  /** Alignement sur l'axe transversal (`alignItems`). Défaut : "stretch". */
  align?: BoxProps["alignItems"];
  /** Alignement sur l'axe principal (`justifyContent`). Ignoré si `distribute`. */
  justify?: BoxProps["justifyContent"];
  /** Inverse l'ordre (`column-reverse`). */
  reverse?: boolean;
  /** Distribue les enfants équitablement (`space-between`). */
  distribute?: boolean;
  /** Étire la stack pour remplir la hauteur dispo (`flex:1` + `minHeight:0`). */
  fillHeight?: boolean;
}

// ─── Composant ────────────────────────────────────────────────────────────────

const Stack: React.FC<StackProps> = ({
  spacing: spacingToken = 0,
  align = "stretch",
  justify = "flex-start",
  reverse = false,
  distribute = false,
  fillHeight = false,
  children,
  style,
  ...rest
}) => {
  const layoutProps = useMemo(
    () => ({
      flexDirection: (reverse ? "column-reverse" : "column") as ViewStyle["flexDirection"],
      alignItems: align,
      justifyContent: distribute ? "space-between" : justify,
      gap: spacingToken,
      flex: fillHeight ? 1 : undefined,
      // minHeight:0 évite l'overflow des enfants flex dans un conteneur à hauteur fixe
      minHeight: fillHeight ? (0 as ViewStyle["minHeight"]) : undefined,
    }),
    [reverse, align, distribute, justify, spacingToken, fillHeight]
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

export default Stack;