/**
 * Checkbox — Toggle checkbox with label.
 */
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Inline from "../primitives/Inline";

const META = getComponentMeta("Checkbox")!;

export interface CheckboxProps {
  checked?: boolean; onChange?: (v: boolean) => void; variant?: "square" | "rounded";
  size?: "sm" | "md"; disabled?: boolean; label?: string; activeColor?: string;
  children?: React.ReactNode;
}

const Checkbox: React.FC<CheckboxProps> = (rawProps) => {
  const { theme } = useTheme();
  const { checked, onChange, variant, size, disabled, label, activeColor } = applyDefaults(rawProps, META, theme) as Required<CheckboxProps>;
  const s = size === "sm" ? 18 : 22;
  const br = variant === "rounded" ? s / 2 : 4;
  const bg = checked ? (activeColor || theme.primary) : "transparent";
  const bc = checked ? bg : theme.border;

  return (
    <Pressable onPress={() => !disabled && onChange?.(!checked)} disabled={disabled} style={{ opacity: disabled ? 0.5 : 1 }}>
      <Inline spacing={2} align="center">
        <View style={{ width: s, height: s, borderRadius: br, borderWidth: 2, borderColor: bc, backgroundColor: bg, alignItems: "center", justifyContent: "center" }}>
          {checked && <Text style={{ color: "#fff", fontSize: s - 8, fontWeight: "700" }}>✓</Text>}
        </View>
        {label ? <Text style={{ fontSize: size === "sm" ? 13 : 15, color: theme.foreground }}>{label}</Text> : null}
      </Inline>
    </Pressable>
  );
};

export default Checkbox;
