/**
 * ProgressBar — Horizontal progress indicator.
 */
import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";

const META = getComponentMeta("ProgressBar")!;

export interface ProgressBarProps {
  progress?: number; size?: "sm" | "md"; color?: string; trackColor?: string;
  borderRadius?: string; showLabel?: boolean; children?: React.ReactNode;
}

const ProgressBar: React.FC<ProgressBarProps> = (rawProps) => {
  const { theme } = useTheme();
  const { progress, size, color, trackColor, borderRadius, showLabel } = applyDefaults(rawProps, META, theme) as Required<ProgressBarProps>;
  const h = size === "sm" ? 4 : 8;
  const pct = Math.max(0, Math.min(100, (Number(progress) || 0) * 100));

  return (
    <View>
      <View style={{ height: h, backgroundColor: trackColor || theme.muted, borderRadius: 999, overflow: "hidden" }}>
        <View style={{ height: h, width: `${pct}%`, backgroundColor: color || theme.primary, borderRadius: 999 }} />
      </View>
      {showLabel && <Text style={{ fontSize: 11, color: theme.mutedForeground, marginTop: 2, textAlign: "right" }}>{Math.round(pct)}%</Text>}
    </View>
  );
};

export default ProgressBar;
