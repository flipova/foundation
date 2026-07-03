/**
 * Select — Dropdown select input (simplified for RN).
 */
import React, { useState } from "react";
import { Pressable, Text, Modal, FlatList, View } from "react-native";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta, SelectSizeMap } from "../../registry";
import Box from "../primitives/Box";
import Stack from "../primitives/Stack";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("Select")!;

export interface SelectProps extends ExtractComponentProps<"Select"> {
  value?: string;
  options?: { label: string; value: string }[];
  onChange?: (v: string) => void;
  children?: React.ReactNode;
}

const Select: React.FC<SelectProps> = (rawProps) => {
  const { theme } = useTheme();
  const { value, options, onChange, variant, size, label, placeholder, error, disabled, borderRadius, background } = applyDefaults(rawProps, META, theme) as Required<SelectProps>;
  const [open, setOpen] = useState(false);
  const sizeConfig = SelectSizeMap[size as keyof typeof SelectSizeMap] || SelectSizeMap.md;
  const bg = variant === "outlined" ? "transparent" : (background || theme.input);
  const bc = error ? theme.error : theme.border;
  const selected = (options || []).find((o: any) => o.value === value);

  return (
    <Stack spacing={1}>
      {label ? <Text style={{ fontSize: sizeConfig.labelSize, fontWeight: "500", color: theme.foreground }}>{label}</Text> : null}
      <Pressable onPress={() => !disabled && setOpen(true)} disabled={disabled} style={{ opacity: disabled ? 0.5 : 1 }}>
        <Box height={sizeConfig.height} bg={bg} borderRadius={borderRadius as any} px={sizeConfig.px as any} justifyContent="center"
          style={variant === "outlined" ? { borderWidth: 1, borderColor: bc } : {}}>
          <Text style={{ fontSize: sizeConfig.fontSize, color: selected ? theme.foreground : theme.mutedForeground }}>{selected?.label || placeholder || "Select..."}</Text>
        </Box>
      </Pressable>
      {error ? <Text style={{ fontSize: 12, color: theme.error }}>{error}</Text> : null}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" }} onPress={() => setOpen(false)}>
          <View style={{ width: 280, maxHeight: 300, backgroundColor: theme.card, borderRadius: 12, overflow: "hidden" }}>
            <FlatList data={options || []} keyExtractor={(i: any) => i.value} renderItem={({ item }: any) => (
              <Pressable onPress={() => { onChange?.(item.value); setOpen(false); }} style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: theme.border }}>
                <Text style={{ fontSize: 15, color: item.value === value ? theme.primary : theme.foreground, fontWeight: item.value === value ? "600" : "400" }}>{item.label}</Text>
              </Pressable>
            )} />
          </View>
        </Pressable>
      </Modal>
    </Stack>
  );
};

export default Select;
