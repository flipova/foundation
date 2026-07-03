/**
 * IconButton — Pressable icon-only button.
 */
import React from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import { IconButtonSizeMap } from "../../registry";
import Box from "../primitives/Box";
import Center from "../primitives/Center";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("IconButton")!;

export interface IconButtonProps extends ExtractComponentProps<"IconButton"> {
  children?: React.ReactNode; icon?: React.ReactNode;
  onPress?: () => void;
}

const IconButton: React.FC<IconButtonProps> = (rawProps) => {
  const { theme } = useTheme();
  const { children, icon, variant, size, disabled, borderRadius, color, onPress } = applyDefaults(rawProps, META, theme) as Required<IconButtonProps>;
  const dim = IconButtonSizeMap[size] || IconButtonSizeMap.md;
  const bg = variant === "filled" ? theme.muted : "transparent";
  const bc = variant === "outline" ? theme.border : undefined;

  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => ({ opacity: disabled ? 0.5 : pressed ? 0.7 : 1 })}>
      <Box width={dim} height={dim} bg={bg} borderRadius={borderRadius as any}
        style={bc ? { borderWidth: 1, borderColor: bc } : {}}>
        <Center flex={1}>
          {icon || children || <Text style={{ fontSize: dim * 0.4, color: color || theme.foreground }}>●</Text>}
        </Center>
      </Box>
    </Pressable>
  );
};

export default IconButton;
