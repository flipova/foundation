/**
 * Avatar — User avatar with image, initials, or icon fallback.
 */
import React from "react";
import { Image, Text } from "react-native";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import type { ExtractComponentProps } from "../../registry";
import Box from "../primitives/Box";
import Center from "../primitives/Center";

const META = getComponentMeta("Avatar")!;

export interface AvatarProps extends ExtractComponentProps<"Avatar"> {
  children?: React.ReactNode;
}

const Avatar: React.FC<AvatarProps> = (rawProps) => {
  const { theme } = useTheme();
  const { source, initials, variant, size, background } = applyDefaults(rawProps, META, theme) as Required<AvatarProps>;
  const dim = (META.sizeMap?.[size] ?? META.sizeMap?.["md"]) as number;
  const br = variant === "circle" ? dim / 2 : 8;
  const bg = background || theme.muted;
  const fs = dim * 0.4;

  return (
    <Box width={dim} height={dim} bg={bg} style={{ borderRadius: br, overflow: "hidden" }}>
      {source ? (
        <Image source={{ uri: source }} style={{ width: dim, height: dim }} />
      ) : (
        <Center flex={1}>
          <Text style={{ fontSize: fs, fontWeight: "600", color: theme.mutedForeground }}>{initials || "?"}</Text>
        </Center>
      )}
    </Box>
  );
};

export default Avatar;
