/**
 * Separator — Web Component
 *
 * Séparateur visuel avec label optionnel. Miroir web du composant RN SeparatorComp.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { spacing, SpacingToken } from "../../tokens";
import { applyDefaults, getComponentMeta } from "../../registry";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("Separator")!;

export interface SeparatorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color" | "size">, ExtractComponentProps<"Separator"> {

}

const Separator: React.FC<SeparatorProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    label,
    color,
    thickness,
    orientation,
    spacing: spacingToken,
    style,
    ...rest
  } = applyDefaults(rawProps, META, theme) as Required<SeparatorProps>;
  
  const lineColor = color ?? theme.border;
  const margin = spacingToken != null ? spacing[spacingToken as SpacingToken] : 0;

  if (orientation === "vertical") {
    return (
      <div
        {...rest}
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
      {...rest}
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
    />
  );
};

export default Separator;
