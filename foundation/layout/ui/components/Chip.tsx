/**
 * Chip — Selectable chip/tag with optional close action.
 */
import React from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Box from "../primitives/Box";
import Inline from "../primitives/Inline";

const META = getComponentMeta("Chip")!;

export interface ChipProps {
  children?: React.ReactNode; label?: string; variant?: "filled" | "outline";
  size?: "sm" | "md"; selected?: boolean; closable?: boolean; disabled?: boolean;
  borderRadius?: string; onPress?: () => void; onClose?: () => void;
}

const Chip: React.FC<ChipProps> = (rawProps) => {
  const { theme } = useTheme();
  const { children, label, variant, size, selected, closable, disabled, borderRadius, onPress, onClose } = applyDefaults(rawProps, META, theme) as Required<ChipProps>;
  const h = size === "sm" ? 28 : 34;
  const fs = size === "sm" ? 12 : 14;
  const bg = selected ? theme.primary : variant === "outline" ? "transparent" : theme.muted;
  const textColor = selected ? theme.primaryForeground : theme.foreground;
  const bc = variant === "outline" ? theme.border : undefined;

  return (
    <Pressable onPress={onPress} disabled={disabled} style={{ opacity: disabled ? 0.5 : 1 }}>
      <Box height={h} bg={bg} borderRadius={borderRadius as any} px={3}
        style={{ justifyContent: "center", ...(bc ? { borderWidth: 1, borderColor: bc } : {}) }}>
        <Inline spacing={1} align="center">
          {children || <Text style={{ fontSize: fs, fontWeight: "500", color: textColor }}>{label || ""}</Text>}
          {closable && <Pressable onPress={onClose}><Text style={{ fontSize: fs, color: textColor, marginLeft: 4 }}>×</Text></Pressable>}
        </Inline>
      </Box>
    </Pressable>
  );
};

export default Chip;
