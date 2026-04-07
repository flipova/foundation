/**
 * Gradient — Linear gradient background container.
 */
import React from "react";
import { View } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Box from "../primitives/Box";

const META = getComponentMeta("Gradient")!;

export interface GradientCompProps {
  children?: React.ReactNode; startColor?: string; endColor?: string;
  direction?: "vertical" | "horizontal" | "diagonal"; borderRadius?: string;
  height?: number; padding?: number;
}

const GradientComp: React.FC<GradientCompProps> = (rawProps) => {
  const { theme } = useTheme();
  const { children, startColor, endColor, borderRadius, height, padding } = applyDefaults(rawProps, META, theme) as Required<GradientCompProps>;

  // Fallback: use a simple background since LinearGradient may not be available in web preview
  return (
    <Box height={height || undefined} borderRadius={borderRadius as any} p={padding as any} overflow="hidden"
      style={{ background: `linear-gradient(180deg, ${startColor || '#3b82f6'}, ${endColor || '#8b5cf6'})` } as any}>
      {children}
    </Box>
  );
};

export default GradientComp;
