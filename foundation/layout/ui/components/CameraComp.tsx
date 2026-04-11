/**
 * Camera — Camera viewfinder placeholder (uses expo-camera at runtime).
 */
import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Box from "../primitives/Box";
import Center from "../primitives/Center";

const META = getComponentMeta("Camera")!;

export interface CameraCompProps {
  facing?: string; flash?: string; enableTorch?: boolean;
  width?: number; height?: number; borderRadius?: string; children?: React.ReactNode;
}

const CameraComp: React.FC<CameraCompProps> = (rawProps) => {
  const { theme } = useTheme();
  const { facing, height, borderRadius } = applyDefaults(rawProps, META, theme) as Required<CameraCompProps>;
  return (
    <Box height={height} bg="#1a1a2e" borderRadius={borderRadius as any} overflow="hidden">
      <Center flex={1}>
        <Text style={{ fontSize: 32 }}>📷</Text>
        <Text style={{ color: "#fff", fontSize: 11, marginTop: 4, opacity: 0.7 }}>{facing} camera</Text>
      </Center>
    </Box>
  );
};

export default CameraComp;
