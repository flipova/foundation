/**
 * Divider — Web Primitive
 *
 * Séparateur horizontal ou vertical. Miroir web du composant RN Divider.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { spacing, SpacingToken } from "../../tokens";

export interface DividerProps {
  /** Orientation. Défaut : "horizontal". */
  orientation?: "horizontal" | "vertical";
  /** Couleur. Défaut : theme.border. */
  color?: string;
  /** Épaisseur en px. Défaut : 1. */
  thickness?: number;
  /** Espacement autour (token). */
  spacing?: SpacingToken;
  className?: string;
  style?: CSSProperties;
}

const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  color,
  thickness = 1,
  spacing: spacingToken,
  className,
  style,
}) => {
  const { theme } = useTheme();
  const resolvedColor = color ?? theme.border;
  const margin = spacingToken != null ? spacing[spacingToken] : undefined;

  const baseStyle: CSSProperties = orientation === "horizontal"
    ? {
        width: "100%",
        height: thickness,
        backgroundColor: resolvedColor,
        flexShrink: 0,
        marginTop: margin,
        marginBottom: margin,
      }
    : {
        width: thickness,
        height: "100%",
        backgroundColor: resolvedColor,
        flexShrink: 0,
        marginLeft: margin,
        marginRight: margin,
      };

  return <div role="separator" aria-orientation={orientation} className={className} style={{ ...baseStyle, ...style }} />;
};

export default Divider;
