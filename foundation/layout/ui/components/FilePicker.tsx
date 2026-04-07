/**
 * FilePicker — File/image upload input.
 */
import React from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Box from "../primitives/Box";
import Center from "../primitives/Center";

const META = getComponentMeta("FilePicker")!;

export interface FilePickerProps {
  variant?: "button" | "dropzone"; size?: "sm" | "md" | "lg"; accept?: string;
  multiple?: boolean; label?: string; disabled?: boolean; borderRadius?: string;
  onPick?: () => void; children?: React.ReactNode;
}

const FilePicker: React.FC<FilePickerProps> = (rawProps) => {
  const { theme } = useTheme();
  const { variant, size, label, disabled, borderRadius, onPick } = applyDefaults(rawProps, META, theme) as Required<FilePickerProps>;
  const h = variant === "dropzone" ? ({ sm: 80, md: 120, lg: 160 }[size] || 120) : ({ sm: 32, md: 40, lg: 48 }[size] || 40);

  if (variant === "dropzone") {
    return (
      <Pressable onPress={onPick} disabled={disabled} style={{ opacity: disabled ? 0.5 : 1 }}>
        <Box height={h} bg={theme.muted} borderRadius={borderRadius as any}
          style={{ borderWidth: 2, borderStyle: "dashed", borderColor: theme.border }}>
          <Center flex={1}>
            <Text style={{ fontSize: 24, marginBottom: 4 }}>📁</Text>
            <Text style={{ fontSize: 13, color: theme.mutedForeground }}>{label || "Upload file"}</Text>
          </Center>
        </Box>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPick} disabled={disabled} style={{ opacity: disabled ? 0.5 : 1 }}>
      <Box height={h} bg={theme.muted} borderRadius={borderRadius as any} px={3} justifyContent="center" alignItems="center"
        style={{ borderWidth: 1, borderColor: theme.border, flexDirection: "row", gap: 8 }}>
        <Text style={{ fontSize: 14 }}>📎</Text>
        <Text style={{ fontSize: 14, color: theme.foreground, fontWeight: "500" }}>{label || "Upload file"}</Text>
      </Box>
    </Pressable>
  );
};

export default FilePicker;
