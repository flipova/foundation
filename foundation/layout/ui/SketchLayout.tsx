/**
 * SketchLayout
 *
 * Placeholder for a drawing canvas layout.
 * Currently displays a placeholder message; intended for future implementation.
 */

import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getLayoutMeta } from "../registry";
import Box from "./primitives/Box";
import Center from "./primitives/Center";
import Stack from "./primitives/Stack";

const META = getLayoutMeta("SketchLayout")!;

interface SketchLayoutProps {
  background?: string;
}

const SketchLayout: React.FC<SketchLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const { background } = applyDefaults(rawProps, META, theme) as Required<SketchLayoutProps>;

  return (
    <Box flex={1} bg={background}>
      <Center flex={1} p={5}>
        <Stack spacing={2} align="center">
          <Text style={{ fontSize: 18, fontWeight: "600", color: theme.foreground, textAlign: "center" }}>
            Drawing Canvas Placeholder
          </Text>
          <Text style={{ fontSize: 14, color: theme.mutedForeground, textAlign: "center" }}>
            Skia-based drawing component has been removed
          </Text>
          <Text style={{ fontSize: 14, color: theme.mutedForeground, textAlign: "center" }}>
            TODO: Implement alternative solution
          </Text>
        </Stack>
      </Center>
    </Box>
  );
};

export default SketchLayout;
