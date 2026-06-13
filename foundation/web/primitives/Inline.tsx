/**
 * Inline — Web Primitive (axe horizontal)
 *
 * Aligne ses enfants en ligne avec un espacement uniforme.
 * Miroir web du composant RN Inline.
 */

import React from "react";
import { SpacingToken } from "../../tokens/spacing";
import Box, { BoxProps } from "./Box";

export interface InlineProps extends Omit<BoxProps, "gap" | "flexDirection" | "display"> {
  /** Espacement entre enfants. Défaut : 0. */
  spacing?: SpacingToken;
  /** Alignement vertical (`alignItems`). Défaut : "center". */
  align?: BoxProps["alignItems"];
  /** Alignement horizontal (`justifyContent`). Défaut : "flex-start". */
  justify?: BoxProps["justifyContent"];
  /** Retour à la ligne si overflow. */
  wrap?: boolean;
  /** Inverse l'ordre (`row-reverse`). */
  reverse?: boolean;
}

const Inline = React.forwardRef<HTMLDivElement, InlineProps>(({
  spacing: spacingToken = 0,
  align = "center",
  justify = "flex-start",
  wrap = false,
  reverse = false,
  children,
  style,
  ...rest
}, ref) => {
  return (
    <Box
      ref={ref}
      flexDirection={reverse ? "row-reverse" : "row"}
      alignItems={align}
      justifyContent={justify}
      gap={spacingToken}
      flexWrap={wrap ? "wrap" : "nowrap"}
      style={{ display: "flex", ...style }}
      {...rest}
    >
      {children}
    </Box>
  );
});

Inline.displayName = "Inline";

export default Inline;
