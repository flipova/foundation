/**
 * MapView — Interactive map placeholder (uses react-native-maps at runtime).
 */
import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Box from "../primitives/Box";
import Center from "../primitives/Center";

const META = getComponentMeta("MapView")!;

export interface MapViewCompProps {
  latitude?: number; longitude?: number; zoom?: number;
  width?: number; height?: number; borderRadius?: string; showsUserLocation?: boolean;
  children?: React.ReactNode;
}

const MapViewComp: React.FC<MapViewCompProps> = (rawProps) => {
  const { theme } = useTheme();
  const { latitude, longitude, height, borderRadius } = applyDefaults(rawProps, META, theme) as Required<MapViewCompProps>;
  return (
    <Box height={height} bg="#e8eaed" borderRadius={borderRadius as any} overflow="hidden">
      <Center flex={1}>
        <Text style={{ fontSize: 32 }}>🗺️</Text>
        <Text style={{ color: "#666", fontSize: 10, marginTop: 4 }}>{latitude?.toFixed(2)}, {longitude?.toFixed(2)}</Text>
      </Center>
    </Box>
  );
};

export default MapViewComp;
