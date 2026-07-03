/**
 * ProgressBar — Web Component
 *
 * Indicateur de progression horizontal. Miroir web du composant RN ProgressBar.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken } from "../../tokens";
import { applyDefaults, getComponentMeta } from "../../registry";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("ProgressBar")!;

export interface ProgressBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color" | "size">, ExtractComponentProps<"ProgressBar"> {

}

const ProgressBar: React.FC<ProgressBarProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    progress,
    size,
    color,
    trackColor,
    borderRadius,
    showLabel,
    style,
    ...rest
  } = applyDefaults(rawProps, META, theme) as Required<ProgressBarProps>;
  
  const h = size === "sm" ? 4 : 8;
  const radius = radii[borderRadius as RadiusToken] || radii.full;
  const pct = Math.min(1, Math.max(0, (progress || 0.5))) * 100;

  const trackStyle: CSSProperties = {
    width: "100%",
    height: h,
    borderRadius: radius,
    backgroundColor: trackColor ?? theme.muted,
    overflow: "hidden",
    ...style,
  };

  const fillStyle: CSSProperties = {
    height: "100%",
    width: `${pct}%`,
    borderRadius: radius,
    backgroundColor: color ?? theme.primary,
    transition: "width 0.3s ease",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
      {showLabel && (
        <span style={{ fontSize: 12, color: theme.mutedForeground, fontFamily: "inherit", textAlign: "right" }}>
          {Math.round(pct)}%
        </span>
      )}
      <div {...rest} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} style={trackStyle}>
        <div style={fillStyle} />
      </div>
    </div>
  );
};

export default ProgressBar;
