/**
 * Slider — Range slider input (simplified for RN web).
 */
import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Stack from "../primitives/Stack";

const META = getComponentMeta("Slider")!;

export interface SliderProps {
  value?: number; onChange?: (v: number) => void; size?: "sm" | "md";
  min?: number; max?: number; step?: number; label?: string;
  showValue?: boolean; disabled?: boolean; activeColor?: string;
  children?: React.ReactNode;
}

const Slider: React.FC<SliderProps> = (rawProps) => {
  const { theme } = useTheme();
  const { value, onChange, size, min, max, step, label, showValue, disabled, activeColor } = applyDefaults(rawProps, META, theme) as Required<SliderProps>;
  const pct = Math.max(0, Math.min(100, ((Number(value) || 0) - min) / (max - min) * 100));
  const h = size === "sm" ? 4 : 6;
  const color = activeColor || theme.primary;

  return (
    <Stack spacing={1}>
      {(label || showValue) && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {label ? <Text style={{ fontSize: 13, fontWeight: "500", color: theme.foreground }}>{label}</Text> : <View />}
          {showValue && <Text style={{ fontSize: 12, fontWeight: "600", color }}>{Number(value) || 0}</Text>}
        </View>
      )}
      <View style={{ height: h + 16, justifyContent: "center", opacity: disabled ? 0.5 : 1 }}>
        <View style={{ height: h, backgroundColor: theme.muted, borderRadius: h / 2, overflow: "hidden" }}>
          <View style={{ height: h, width: `${pct}%`, backgroundColor: color, borderRadius: h / 2 }} />
        </View>
        <View style={{ position: "absolute", left: `${pct}%`, marginLeft: -8, width: 16, height: 16, borderRadius: 8, backgroundColor: color, borderWidth: 2, borderColor: "#fff" }} />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Pressable onPress={() => { if (!disabled) onChange?.(Math.max(min, (Number(value) || 0) - step)); }} style={{ padding: 4 }}>
          <Text style={{ fontSize: 12, color: theme.mutedForeground }}>−</Text>
        </Pressable>
        <Pressable onPress={() => { if (!disabled) onChange?.(Math.min(max, (Number(value) || 0) + step)); }} style={{ padding: 4 }}>
          <Text style={{ fontSize: 12, color: theme.mutedForeground }}>+</Text>
        </Pressable>
      </View>
    </Stack>
  );
};

export default Slider;
