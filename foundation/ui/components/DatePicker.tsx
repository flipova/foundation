/**
 * DatePicker — Date/time picker input (simplified for RN).
 */
import React from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import type { ExtractComponentProps } from "../../registry";
import Box from "../primitives/Box";
import Stack from "../primitives/Stack";

const META = getComponentMeta("DatePicker")!;

export interface DatePickerProps extends ExtractComponentProps<"DatePicker"> {
  value?: string;
  onChange?: (v: string) => void;
  children?: React.ReactNode;
}

const DatePicker: React.FC<DatePickerProps> = (rawProps) => {
  const { theme } = useTheme();
  const { value, mode, size, label, placeholder, error, disabled, borderRadius } = applyDefaults(rawProps, META, theme) as Required<DatePickerProps>;
  const sizeConfig = (META.sizeMap?.[size] ?? META.sizeMap?.["md"]) as any;
  const icon = mode === "time" ? "🕐" : "📅";

  return (
    <Stack spacing={1}>
      {label ? <Text style={{ fontSize: 13, fontWeight: "500", color: theme.foreground }}>{label}</Text> : null}
      <Pressable disabled={disabled} style={{ opacity: disabled ? 0.5 : 1 }}>
        <Box height={sizeConfig.height} bg={theme.input} borderRadius={borderRadius as any} px={3} justifyContent="center"
          style={{ borderWidth: 1, borderColor: error ? theme.error : theme.border }}>
          <Text style={{ fontSize: sizeConfig.fontSize, color: value ? theme.foreground : theme.mutedForeground }}>
            {icon} {value || placeholder || "Select date"}
          </Text>
        </Box>
      </Pressable>
      {error ? <Text style={{ fontSize: 12, color: theme.error }}>{error}</Text> : null}
    </Stack>
  );
};

export default DatePicker;
