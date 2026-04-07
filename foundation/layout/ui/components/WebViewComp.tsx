/**
 * WebView — Embedded web browser placeholder.
 */
import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Box from "../primitives/Box";
import Center from "../primitives/Center";

const META = getComponentMeta("WebView")!;

export interface WebViewCompProps {
  url?: string; width?: number; height?: number; scrollEnabled?: boolean; borderRadius?: string;
  children?: React.ReactNode;
}

const WebViewComp: React.FC<WebViewCompProps> = (rawProps) => {
  const { theme } = useTheme();
  const { url, height, borderRadius } = applyDefaults(rawProps, META, theme) as Required<WebViewCompProps>;
  return (
    <Box height={height} bg={theme.muted} borderRadius={borderRadius as any} overflow="hidden">
      <Center flex={1}>
        <Text style={{ fontSize: 24 }}>🌐</Text>
        <Text style={{ color: theme.mutedForeground, fontSize: 10, marginTop: 4 }}>{url || "https://..."}</Text>
      </Center>
    </Box>
  );
};

export default WebViewComp;
