/**
 * Text — Web Component
 *
 * Texte avec contrôle typographique. Miroir web du composant RN Text.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("Text")!;

export interface TextProps extends Omit<React.HTMLAttributes<HTMLElement>, "color" | "size">, ExtractComponentProps<"Text"> {
  children?: React.ReactNode;
  as?: any;
}

const Text: React.FC<TextProps> = (rawProps) => {
  const { theme } = useTheme();
  const merged = applyDefaults(rawProps, META, theme) as Required<TextProps> & typeof rawProps;
  const {
    text,
    fontSize,
    fontWeight,
    color,
    textAlign,
    numberOfLines,
    as: Tag = "p",
    children,
    style,
    ...rest
  } = merged;

  const textStyle: CSSProperties = {
    fontSize,
    fontWeight,
    color: color ?? theme.foreground,
    textAlign,
    fontFamily: "inherit",
    margin: 0,
    padding: 0,
    ...(numberOfLines != null
      ? {
          display: "-webkit-box",
          WebkitLineClamp: numberOfLines,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }
      : {}),
    ...style,
  };

  return (
    <Tag style={textStyle} {...rest}>
      {children ?? text}
    </Tag>
  );
};

export default Text;
