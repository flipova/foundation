/**
 * Switch — Toggle switch with label.
 */
import React from "react";
import { Switch as RNSwitch, Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Inline from "../primitives/Inline";

const META = getComponentMeta("Switch")!;

export interface SwitchProps {
  value?: boolean; onChange?: (v: boolean) => void; size?: "sm" | "md";
  disabled?: boolean; label?: string; activeColor?: string; trackColor?: string;
  children?: React.ReactNode;
}

const SwitchComponent: React.FC<SwitchProps> = (rawProps) => {
  const { theme } = useTheme();
  const { value, onChange, size, disabled, label, activeColor, trackColor } = applyDefaults(rawProps, META, theme) as Required<SwitchProps>;
  const scale = size === "sm" ? 0.8 : 1;

  return (
    <Inline spacing={2} align="center">
      {label ? <Text style={{ fontSize: size === "sm" ? 13 : 15, color: theme.foreground, flex: 1 }}>{label}</Text> : null}
      <RNSwitch value={value} onValueChange={v => { if (!disabled) onChange?.(v); }} disabled={disabled}
        trackColor={{ false: trackColor || theme.muted, true: activeColor || theme.primary }}
        thumbColor="#fff" style={{ transform: [{ scale }] }} />
    </Inline>
  );
};

export default SwitchComponent;
