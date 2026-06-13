/**
 * ProgressBar — Web Component
 *
 * Indicateur de progression horizontal. Miroir web du composant RN ProgressBar.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken } from "../../tokens";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number; // 0–1
  size?: "sm" | "md";
  color?: string;
  trackColor?: string;
  borderRadius?: RadiusToken;
  showLabel?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress = 0.5,
  size = "md",
  color,
  trackColor,
  borderRadius = "full",
  showLabel = false,
  style,
  ...rest
}) => {
  const { theme } = useTheme();
  const h = size === "sm" ? 4 : 8;
  const radius = radii[borderRadius];
  const pct = Math.min(1, Math.max(0, progress)) * 100;

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
      <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} style={trackStyle} {...rest}>
        <div style={fillStyle} />
      </div>
    </div>
  );
};

export default ProgressBar;
