/**
 * Scroll — Web Primitive
 *
 * Conteneur avec scroll activé. Miroir web du composant RN Scroll.
 */

import React, { CSSProperties } from "react";
import Box, { BoxProps } from "./Box";

export interface ScrollProps extends BoxProps {
  /** Direction du scroll. Défaut : "vertical". */
  direction?: "vertical" | "horizontal" | "both";
  /** Masque la scrollbar. Défaut : false. */
  hideScrollbar?: boolean;
}

const scrollbarHideStyle: CSSProperties = {
  scrollbarWidth: "none" as CSSProperties["scrollbarWidth"],
  msOverflowStyle: "none",
};

const Scroll = React.forwardRef<HTMLDivElement, ScrollProps>(({
  direction = "vertical",
  hideScrollbar = false,
  children,
  style,
  ...rest
}, ref) => {
  const overflowX: CSSProperties["overflowX"] =
    direction === "horizontal" || direction === "both" ? "auto" : "hidden";
  const overflowY: CSSProperties["overflowY"] =
    direction === "vertical" || direction === "both" ? "auto" : "hidden";

  return (
    <Box
      ref={ref}
      style={{
        overflowX,
        overflowY,
        WebkitOverflowScrolling: "touch",
        ...(hideScrollbar ? scrollbarHideStyle : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
});

Scroll.displayName = "Scroll";

export default Scroll;
