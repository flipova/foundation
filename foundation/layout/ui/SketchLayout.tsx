/**
 * SketchLayout
 *
 * Placeholder for a drawing canvas layout.
 * Currently displays a placeholder message; intended for future implementation.
 */

import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../theme/providers/ThemeProvider";
import Box from "./primitives/Box";
import Center from "./primitives/Center";
import Stack from "./primitives/Stack";

const SketchLayout: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Box flex={1} bg={theme.background}>
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
