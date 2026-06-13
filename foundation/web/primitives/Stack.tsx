/**
 * Stack — Web Primitive (axe vertical)
 *
 * Empile ses enfants en colonne avec un espacement uniforme.
 * Miroir web du composant RN Stack.
 */

import React from "react";
import { SpacingToken } from "../../tokens/spacing";
import Box, { BoxProps } from "./Box";

export interface StackProps extends Omit<BoxProps, "gap" | "flexDirection" | "display"> {
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
  /** Étire la stack pour remplir la hauteur dispo (`flex:1`). */
  fillHeight?: boolean;
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(({
  spacing: spacingToken = 0,
  align = "stretch",
  justify = "flex-start",
  reverse = false,
  distribute = false,
  fillHeight = false,
  children,
  style,
  ...rest
}, ref) => {
  return (
    <Box
      ref={ref}
      flexDirection={reverse ? "column-reverse" : "column"}
      alignItems={align}
      justifyContent={distribute ? "space-between" : justify}
      gap={spacingToken}
      flex={fillHeight ? 1 : undefined}
      minHeight={fillHeight ? 0 : undefined}
      style={{ display: "flex", ...style }}
      {...rest}
    >
      {children}
    </Box>
  );
});

Stack.displayName = "Stack";

export default Stack;
