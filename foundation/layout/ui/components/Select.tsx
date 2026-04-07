/**
 * Select — Dropdown select input (simplified for RN).
 */
import React, { useState } from "react";
import { Pressable, Text, Modal, FlatList, View } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Box from "../primitives/Box";
import Stack from "../primitives/Stack";

const META = getComponentMeta("Select")!;

export interface SelectProps {
  value?: string; options?: { label: string; value: string }[]; onChange?: (v: string) => void;
  variant?: "outlined" | "filled"; size?: "sm" | "md" | "lg"; label?: string;
  placeholder?: string; error?: string; disabled?: boolean; borderRadius?: string; background?: string;
  children?: React.ReactNode;
}

const Select: React.FC<SelectProps> = (rawProps) => {
  const { theme } = useTheme();
  const { value, options, onChange, variant, size, label, placeholder, error, disabled, borderRadius, background } = applyDefaults(rawProps, META, theme) as Required<SelectProps>;
  const [open, setOpen] = useState(false);
  const h = { sm: 32, md: 40, lg: 48 }[size] || 40;
  const fs = { sm: 13, md: 15, lg: 17 }[size] || 15;
  const bg = variant === "outlined" ? "transparent" : (background || theme.input);
  const bc = error ? theme.error : theme.border;
  const selected = (options || []).find((o: any) => o.value === value);

  return (
    <Stack spacing={1}>
      {label ? <Text style={{ fontSize: 13, fontWeight: "500", color: theme.foreground }}>{label}</Text> : null}
      <Pressable onPress={() => !disabled && setOpen(true)} disabled={disabled} style={{ opacity: disabled ? 0.5 : 1 }}>
        <Box height={h} bg={bg} borderRadius={borderRadius as any} px={3} justifyContent="center"
          style={variant === "outlined" ? { borderWidth: 1, borderColor: bc } : {}}>
          <Text style={{ fontSize: fs, color: selected ? theme.foreground : theme.mutedForeground }}>{selected?.label || placeholder || "Select..."}</Text>
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
