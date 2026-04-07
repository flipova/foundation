/**
 * RadioGroup — Group of radio buttons for single selection.
 */
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Stack from "../primitives/Stack";
import Inline from "../primitives/Inline";

const META = getComponentMeta("RadioGroup")!;

export interface RadioGroupProps {
  value?: string; options?: { label: string; value: string }[]; onChange?: (v: string) => void;
  size?: "sm" | "md"; label?: string; direction?: "column" | "row"; spacing?: number;
  disabled?: boolean; activeColor?: string; children?: React.ReactNode;
}

const RadioGroup: React.FC<RadioGroupProps> = (rawProps) => {
  const { theme } = useTheme();
  const { value, options, onChange, size, label, direction, disabled, activeColor } = applyDefaults(rawProps, META, theme) as Required<RadioGroupProps>;
  const dim = size === "sm" ? 18 : 22;
  const fs = size === "sm" ? 13 : 15;
  const color = activeColor || theme.primary;
  const Wrapper = direction === "row" ? Inline : Stack;

  return (
    <Stack spacing={2}>
      {label ? <Text style={{ fontSize: 13, fontWeight: "500", color: theme.foreground }}>{label}</Text> : null}
      <Wrapper spacing={2}>
        {(options || []).map((opt: any) => {
          const selected = opt.value === value;
          return (
            <Pressable key={opt.value} onPress={() => !disabled && onChange?.(opt.value)} disabled={disabled} style={{ opacity: disabled ? 0.5 : 1 }}>
              <Inline spacing={2} align="center">
                <View style={{ width: dim, height: dim, borderRadius: dim / 2, borderWidth: 2, borderColor: selected ? color : theme.border, alignItems: "center", justifyContent: "center" }}>
                  {selected && <View style={{ width: dim - 8, height: dim - 8, borderRadius: (dim - 8) / 2, backgroundColor: color }} />}
                </View>
                <Text style={{ fontSize: fs, color: theme.foreground }}>{opt.label}</Text>
              </Inline>
            </Pressable>
          );
        })}
      </Wrapper>
    </Stack>
  );
};

export default RadioGroup;
