/**
 * Avatar — User avatar with image, initials, or icon fallback.
 */
import React from "react";
import { Image, Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Box from "../primitives/Box";
import Center from "../primitives/Center";

const META = getComponentMeta("Avatar")!;

const SIZE_MAP = { xs: 24, sm: 32, md: 40, lg: 56, xl: 72 } as const;

export interface AvatarProps {
  source?: string; initials?: string; variant?: "circle" | "square";
  size?: "xs" | "sm" | "md" | "lg" | "xl"; background?: string;
  children?: React.ReactNode;
}

const Avatar: React.FC<AvatarProps> = (rawProps) => {
  const { theme } = useTheme();
  const { source, initials, variant, size, background } = applyDefaults(rawProps, META, theme) as Required<AvatarProps>;
  const dim = SIZE_MAP[size] || SIZE_MAP.md;
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
