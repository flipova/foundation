/**
 * Image — Image component with source, resize mode, and placeholder.
 */
import React from "react";
import { Image as RNImage, Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Box from "../primitives/Box";
import Center from "../primitives/Center";

const META = getComponentMeta("Image")!;

export interface ImageCompProps {
  source?: string; alt?: string; resizeMode?: "cover" | "contain" | "stretch" | "center";
  width?: number; height?: number; borderRadius?: string; background?: string;
  children?: React.ReactNode;
}

const ImageComp: React.FC<ImageCompProps> = (rawProps) => {
  const { theme } = useTheme();
  const { source, alt, resizeMode, width, height, borderRadius, background } = applyDefaults(rawProps, META, theme) as Required<ImageCompProps>;

  if (!source) {
    return (
      <Box width={width || undefined} height={height} bg={background || theme.muted} borderRadius={borderRadius as any}>
        <Center flex={1}><Text style={{ fontSize: 24, opacity: 0.3 }}>🖼️</Text></Center>
      </Box>
    );
  }

  return (
    <Box width={width || undefined} height={height} bg={background || theme.muted} borderRadius={borderRadius as any} overflow="hidden">
      <RNImage source={{ uri: source }} style={{ width: "100%", height: "100%", resizeMode }} accessibilityLabel={alt} />
    </Box>
  );
};

export default ImageComp;
