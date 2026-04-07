/**
 * DatePicker — Date/time picker input (simplified for RN).
 */
import React, { useState } from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Box from "../primitives/Box";
import Stack from "../primitives/Stack";

const META = getComponentMeta("DatePicker")!;

export interface DatePickerProps {
  value?: string; onChange?: (v: string) => void; mode?: "date" | "time" | "datetime";
  size?: "sm" | "md" | "lg"; label?: string; placeholder?: string; error?: string;
  disabled?: boolean; borderRadius?: string; children?: React.ReactNode;
}

const DatePicker: React.FC<DatePickerProps> = (rawProps) => {
  const { theme } = useTheme();
  const { value, mode, size, label, placeholder, error, disabled, borderRadius } = applyDefaults(rawProps, META, theme) as Required<DatePickerProps>;
  const h = { sm: 32, md: 40, lg: 48 }[size] || 40;
  const fs = { sm: 13, md: 15, lg: 17 }[size] || 15;
  const icon = mode === "time" ? "🕐" : "📅";

  return (
    <Stack spacing={1}>
      {label ? <Text style={{ fontSize: 13, fontWeight: "500", color: theme.foreground }}>{label}</Text> : null}
      <Pressable disabled={disabled} style={{ opacity: disabled ? 0.5 : 1 }}>
        <Box height={h} bg={theme.input} borderRadius={borderRadius as any} px={3} justifyContent="center"
          style={{ borderWidth: 1, borderColor: error ? theme.error : theme.border }}>
          <Text style={{ fontSize: fs, color: value ? theme.foreground : theme.mutedForeground }}>
            {icon} {value || placeholder || "Select date"}
          </Text>
        </Box>
      </Pressable>
      {error ? <Text style={{ fontSize: 12, color: theme.error }}>{error}</Text> : null}
    </Stack>
  );
};

export default DatePicker;
