/**
 * CounterBlock — Animated number counter with increment/decrement controls.
 */
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("CounterBlock")!;

export interface CounterBlockProps {
  value?: number; min?: number; max?: number; step?: number; label?: string;
  size?: "sm" | "md" | "lg"; accentColor?: string; background?: string;
  disabled?: boolean; onChange?: (value: number) => void;
}

const SIZE_MAP = { sm: { btn: 28, font: 14 }, md: { btn: 36, font: 18 }, lg: { btn: 44, font: 22 } };

const CounterBlock: React.FC<CounterBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<CounterBlockProps>;
  const { value: extVal, min, max, step, label, size, accentColor, background, disabled, onChange } = props;
  const [internal, setInternal] = useState(extVal ?? 0);
  const val = extVal ?? internal;
  const accent = accentColor || theme.primary;
  const { btn, font } = SIZE_MAP[size] ?? SIZE_MAP.md;

  const change = (delta: number) => {
    const next = Math.min(max, Math.max(min, val + delta));
    setInternal(next);
    onChange?.(next);
  };

  return (
    <View style={s.root}>
      {label ? <Text style={[s.label, { color: theme.foreground }]}>{label}</Text> : null}
      <View style={[s.row, { backgroundColor: background || theme.card, borderRadius: btn / 2 + 4, borderColor: theme.border, borderWidth: 1 }]}>
        <Pressable onPress={() => change(-step)} disabled={disabled || val <= min}
          style={({ pressed }) => [s.btn, { width: btn, height: btn, opacity: (disabled || val <= min) ? 0.3 : pressed ? 0.7 : 1 }]}>
          <Feather name="minus" size={font * 0.8} color={accent} />
        </Pressable>
        <Text style={[s.value, { color: theme.foreground, fontSize: font, minWidth: font * 2.5 }]}>{val}</Text>
        <Pressable onPress={() => change(step)} disabled={disabled || val >= max}
          style={({ pressed }) => [s.btn, { width: btn, height: btn, opacity: (disabled || val >= max) ? 0.3 : pressed ? 0.7 : 1 }]}>
          <Feather name="plus" size={font * 0.8} color={accent} />
        </Pressable>
      </View>
    </View>
  );
};

export default CounterBlock;

const s = StyleSheet.create({
  root: { gap: 6, alignItems: "flex-start" },
  label: { fontSize: 12, fontWeight: "500" },
  row: { flexDirection: "row", alignItems: "center" },
  btn: { alignItems: "center", justifyContent: "center" },
  value: { textAlign: "center", fontWeight: "700" },
});
