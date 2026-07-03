/**
 * Center — Primitive niveau 1
 *
 * Centre ses enfants sur un ou les deux axes.
 * Par défaut (sans props), centre sur les deux axes.
 *
 * Construit sur Box ; ne touche jamais ViewStyle directement.
 *
 * @example
 * // Centrage total (cas le plus fréquent)
 * <Center flex={1}>
 *   <Spinner />
 * </Center>
 *
 * // Centrage horizontal seulement
 * <Center horizontal>
 *   <Text>Titre de section</Text>
 * </Center>
 *
 * // Centrage vertical seulement dans une hauteur fixe
 * <Center vertical height={80}>
 *   <Text>Label</Text>
 * </Center>
 */

import React, { useMemo } from "react";
import Box, { BoxProps } from "./Box";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CenterProps extends Omit<BoxProps, "alignItems" | "justifyContent"> {
  /** Centre horizontalement (axe transversal). */
  horizontal?: boolean;
  /** Centre verticalement (axe principal). */
  vertical?: boolean;
}

// ─── Composant ────────────────────────────────────────────────────────────────

const Center: React.FC<CenterProps> = ({
  children,
  horizontal = false,
  vertical = false,
  flex = 1,
  ...rest
}) => {
  // Quand aucun axe n'est précisé → centre sur les deux
  const both = !horizontal && !vertical;

  const layoutProps = useMemo(
    () => ({
      alignItems:     (horizontal || both) ? ("center" as const) : undefined,
      justifyContent: (vertical   || both) ? ("center" as const) : undefined,
    }),
    [horizontal, vertical, both]
  );

  return (
    <Box flex={flex} {...layoutProps} {...rest}>
      {children}
    </Box>
  );
};

export default Center;