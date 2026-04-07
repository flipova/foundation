/**
 * Separator — Visual separator with optional label.
 */
import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";

const META = getComponentMeta("Separator")!;

export interface SeparatorCompProps {
  label?: string; color?: string; thickness?: number; spacing?: number;
  children?: React.ReactNode;
}

const SeparatorComp: React.FC<SeparatorCompProps> = (rawProps) => {
  const { theme } = useTheme();
  const { label, color, thickness, spacing } = applyDefaults(rawProps, META, theme) as Required<SeparatorCompProps>;
  const c = color || theme.border;
  const my = Number(spacing) * 4 || 16;

  if (label) {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", marginVertical: my }}>
        <View style={{ flex: 1, height: thickness, backgroundColor: c }} />
        <Text style={{ marginHorizontal: 12, fontSize: 12, color: theme.mutedForeground }}>{label}</Text>
        <View style={{ flex: 1, height: thickness, backgroundColor: c }} />
      </View>
    );
  }

  return <View style={{ height: thickness, backgroundColor: c, marginVertical: my }} />;
};

export default SeparatorComp;
