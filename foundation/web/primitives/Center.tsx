/**
 * Center — Web Primitive
 *
 * Centre ses enfants (horizontalement et/ou verticalement).
 * Miroir web du composant RN Center.
 */

import React from "react";
import Box, { BoxProps } from "./Box";

export interface CenterProps extends Omit<BoxProps, "display" | "alignItems" | "justifyContent"> {
  /** Centre uniquement horizontalement. */
  horizontal?: boolean;
  /** Centre uniquement verticalement (nécessite une hauteur définie). */
  vertical?: boolean;
}

const Center = React.forwardRef<HTMLDivElement, CenterProps>(({
  horizontal = true,
  vertical = true,
  children,
  style,
  ...rest
}, ref) => {
  return (
    <Box
      ref={ref}
      alignItems={vertical ? "center" : "stretch"}
      justifyContent={horizontal ? "center" : "flex-start"}
      style={{ display: "flex", ...style }}
      {...rest}
    >
      {children}
    </Box>
  );
});

Center.displayName = "Center";

export default Center;
