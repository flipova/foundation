/**
 * Spinner — Loading indicator.
 */
import React from "react";
import { ActivityIndicator } from "react-native";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("Spinner")!;

export interface SpinnerProps extends ExtractComponentProps<"Spinner"> {
  children?: React.ReactNode; 
}

const Spinner: React.FC<SpinnerProps> = (rawProps) => {
  const { theme } = useTheme();
  const { size, color } = applyDefaults(rawProps, META, theme) as Required<SpinnerProps>;
  const rnSize = size === "lg" ? "large" : "small";
  return <ActivityIndicator size={rnSize} color={color || theme.primary} />;
};

export default Spinner;

