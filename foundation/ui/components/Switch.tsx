/**
 * Switch — Toggle switch with label.
 */
import React from "react";
import { Switch as RNSwitch, Text } from "react-native";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Inline from "../primitives/Inline";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("Switch")!;

export interface SwitchProps extends ExtractComponentProps<"Switch"> {
  value?: boolean;
  onChange?: (v: boolean) => void;
  children?: React.ReactNode;
}

const SwitchComponent: React.FC<SwitchProps> = (rawProps) => {
  const { theme } = useTheme();
  const { value, onChange, size, disabled, label, activeColor, trackColor } = applyDefaults(rawProps, META, theme) as Required<SwitchProps>;
  const sizeConfig = (META.sizeMap?.[size] ?? META.sizeMap?.["md"]) as any;
  const scale = sizeConfig.scale;

  return (
    <Inline spacing={2} align="center">
      {label ? <Text style={{ fontSize: sizeConfig.labelSize, color: theme.foreground, flex: 1 }}>{label}</Text> : null}
      <RNSwitch value={value} onValueChange={v => { if (!disabled) onChange?.(v); }} disabled={disabled}
        trackColor={{ false: trackColor || theme.muted, true: activeColor || theme.primary }}
        thumbColor="#fff" style={{ transform: [{ scale }] }} />
    </Inline>
  );
};

export default SwitchComponent;
