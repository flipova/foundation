/**
 * Separator — Web Component
 *
 * Séparateur visuel avec label optionnel. Miroir web du composant RN SeparatorComp.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { spacing, SpacingToken } from "../../tokens";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  color?: string;
  thickness?: number;
  orientation?: "horizontal" | "vertical";
  spacing?: SpacingToken;
}

const Separator: React.FC<SeparatorProps> = ({
  label,
  color,
  thickness = 1,
  orientation = "horizontal",
  spacing: spacingToken,
  style,
  ...rest
}) => {
  const { theme } = useTheme();
  const lineColor = color ?? theme.border;
  const margin = spacingToken != null ? spacing[spacingToken] : 0;

  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        style={{
          width: thickness,
          alignSelf: "stretch",
          backgroundColor: lineColor,
          marginLeft: margin,
          marginRight: margin,
          flexShrink: 0,
          ...style,
        }}
        {...rest}
      />
    );
  }

  if (label) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginTop: margin,
          marginBottom: margin,
          ...style,
        }}
        {...rest}
      >
        <div style={{ flex: 1, height: thickness, backgroundColor: lineColor }} />
        <span style={{ fontSize: 13, color: theme.mutedForeground, fontFamily: "inherit", whiteSpace: "nowrap" }}>
          {label}
        </span>
        <div style={{ flex: 1, height: thickness, backgroundColor: lineColor }} />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      style={{
        height: thickness,
        backgroundColor: lineColor,
        width: "100%",
        marginTop: margin,
        marginBottom: margin,
        flexShrink: 0,
        ...style,
      }}
      {...rest}
    />
  );
};

export default Separator;
