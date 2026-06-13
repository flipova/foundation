/**
 * Text — Web Component
 *
 * Texte avec contrôle typographique. Miroir web du composant RN Text.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";

type Tag = "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "label" | "div";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  text?: string;
  fontSize?: number;
  fontWeight?: "300" | "400" | "500" | "600" | "700" | "800";
  color?: string;
  textAlign?: "left" | "center" | "right";
  numberOfLines?: number;
  /** HTML tag to render as. Défaut : "p". */
  as?: Tag;
  children?: React.ReactNode;
}

const Text: React.FC<TextProps> = ({
  text,
  fontSize = 14,
  fontWeight = "400",
  color,
  textAlign = "left",
  numberOfLines,
  as: Tag = "p",
  children,
  style,
  ...rest
}) => {
  const { theme } = useTheme();

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
