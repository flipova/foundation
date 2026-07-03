/**
 * Icon — Vector icon from Feather icon set.
 */
import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";

const META = getComponentMeta("Icon")!;

import type { ExtractComponentProps } from "../../registry";

export interface IconCompProps extends ExtractComponentProps<"Icon"> {
  children?: React.ReactNode;
}

const IconComp: React.FC<IconCompProps> = (rawProps) => {
  const { theme } = useTheme();
  const { name, size, color } = applyDefaults(rawProps, META, theme) as Required<IconCompProps>;

  // In the studio preview we render a text placeholder. Real app uses Feather icons.
  return <Text style={{ fontSize: size, color: color || theme.foreground }}>⬡</Text>;
};

export default IconComp;

