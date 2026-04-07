/**
 * Text — Text display component with typography control.
 */
import React from "react";
import { Text as RNText } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";

const META = getComponentMeta("Text")!;

export interface TextCompProps {
  text?: string; fontSize?: number; fontWeight?: string; color?: string;
  textAlign?: "left" | "center" | "right"; numberOfLines?: number;
  children?: React.ReactNode;
}

const TextComp: React.FC<TextCompProps> = (rawProps) => {
  const { theme } = useTheme();
  const { text, fontSize, fontWeight, color, textAlign, numberOfLines, children } = applyDefaults(rawProps, META, theme) as Required<TextCompProps>;

  return (
    <RNText style={{ fontSize: Number(fontSize) || 14, fontWeight: (fontWeight || "400") as any, color: color || theme.foreground, textAlign: textAlign || "left" }}
      numberOfLines={numberOfLines || undefined}>
      {children || text || "Text"}
    </RNText>
  );
};

export default TextComp;
