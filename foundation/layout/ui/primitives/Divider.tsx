/**
 * Divider — Primitive niveau 1
 *
 * Séparateur visuel horizontal ou vertical.
 * Construit sur Box.
 *
 * @example
 * <Stack spacing={4}>
 *   <Text>Section A</Text>
 *   <Divider />
 *   <Text>Section B</Text>
 * </Stack>
 *
 * // Vertical (dans un Inline)
 * <Inline spacing={4} align="stretch">
 *   <Text>Gauche</Text>
 *   <Divider orientation="vertical" />
 *   <Text>Droite</Text>
 * </Inline>
 */

import React from "react";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import Box from "./Box";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  color?: string;
  thickness?: number;
}

// ─── Composant ────────────────────────────────────────────────────────────────

const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  color,
  thickness = 1,
}) => {
  const { theme } = useTheme();
  const resolvedColor = color ?? theme.border;

  if (orientation === "vertical") {
    return (
      <Box
        width={thickness}
        alignSelf="stretch"
        bg={resolvedColor}
      />
    );
  }

  return (
    <Box
      height={thickness}
      width="100%"
      bg={resolvedColor}
    />
  );
};

export default Divider;