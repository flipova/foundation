/**
 * Video — Video player placeholder (uses expo-av at runtime).
 */
import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Box from "../primitives/Box";
import Center from "../primitives/Center";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("Video")!;

export interface VideoCompProps extends ExtractComponentProps<"Video"> {
  children?: React.ReactNode;
}

const VideoComp: React.FC<VideoCompProps> = (rawProps) => {
  const { theme } = useTheme();
  const { source, height, borderRadius } = applyDefaults(rawProps, META, theme) as Required<VideoCompProps>;
  return (
    <Box height={height} bg="#000" borderRadius={borderRadius as any} overflow="hidden">
      <Center flex={1}>
        <Text style={{ fontSize: 32 }}>▶️</Text>
        <Text style={{ color: "#fff", fontSize: 11, marginTop: 4, opacity: 0.7 }}>{source || "No source"}</Text>
      </Center>
    </Box>
  );
};

export default VideoComp;

