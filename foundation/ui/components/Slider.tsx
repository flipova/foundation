/**
 * Slider — Range slider input (simplified for RN web).
 */
import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import { SliderSizeMap } from "../../registry";
import Stack from "../primitives/Stack";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("Slider")!;

export interface SliderProps extends ExtractComponentProps<"Slider"> {
  value?: number;
  onChange?: (v: number) => void;
  children?: React.ReactNode;
}

const Slider: React.FC<SliderProps> = (rawProps) => {
  const { theme } = useTheme();
  const { value, onChange, size, min, max, step, label, showValue, disabled, activeColor } = applyDefaults(rawProps, META, theme) as Required<SliderProps>;
  const pct = Math.max(0, Math.min(100, ((Number(value) || 0) - min) / (max - min) * 100));
  const sizeConfig = SliderSizeMap[size as keyof typeof SliderSizeMap] || SliderSizeMap.md;
  const h = sizeConfig.trackHeight;
  const ts = sizeConfig.thumbSize;
  const color = activeColor || theme.primary;

  return (
    <Stack spacing={1}>
      {(label || showValue) && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {label ? <Text style={{ fontSize: sizeConfig.labelSize, fontWeight: "500", color: theme.foreground }}>{label}</Text> : <View />}
          {showValue && <Text style={{ fontSize: sizeConfig.valueSize, fontWeight: "600", color }}>{Number(value) || 0}</Text>}
        </View>
      )}
      <View style={{ height: ts, justifyContent: "center", opacity: disabled ? 0.5 : 1 }}>
        <View style={{ height: h, backgroundColor: theme.muted, borderRadius: h / 2, overflow: "hidden" }}>
          <View style={{ height: h, width: `${pct}%`, backgroundColor: color, borderRadius: h / 2 }} />
        </View>
        <View style={{ position: "absolute", left: `${pct}%`, marginLeft: -ts / 2, width: ts, height: ts, borderRadius: ts / 2, backgroundColor: color, borderWidth: 2, borderColor: "#fff" }} />
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
