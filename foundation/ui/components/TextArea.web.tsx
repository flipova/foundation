/**
 * TextArea — Web Component
 *
 * Zone de texte multi-lignes. Miroir web du composant RN TextArea.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken, radii, spacing } from "../../tokens";
import { applyDefaults, getComponentMeta } from "../../registry";
import { TextAreaSizeMap } from "../../registry";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("TextArea")!;

export interface TextAreaProps extends Omit<Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">, "color" | "size">, ExtractComponentProps<"TextArea"> {

}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>((rawProps, ref) => {
  const { theme } = useTheme();
  const {
    label, error, variant, size, borderRadius, background, numberOfLines,
    disabled, placeholder, style, ...rest
  } = applyDefaults(rawProps, META, theme) as Required<TextAreaProps> & typeof rawProps;

  const sizeConfig = TextAreaSizeMap[size as keyof typeof TextAreaSizeMap] ?? TextAreaSizeMap.md;
  const radius = borderRadius ? radii[borderRadius] : radii.md;

  const textareaStyle: CSSProperties = {
    padding: typeof sizeConfig.px === "number" ? (sizeConfig.px < 10 ? spacing[sizeConfig.px as keyof typeof spacing] : sizeConfig.px) : 12,
    fontSize: sizeConfig.fontSize,
    color: theme.foreground,
    borderRadius: radius,
    border: variant === "filled" ? "none" : `1px solid ${error ? theme.destructive : theme.border}`,
    backgroundColor: background ?? (variant === "filled" ? theme.input : "transparent"),
    outline: "none",
    width: "100%",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: sizeConfig.height,
    cursor: disabled ? "not-allowed" : "text",
    opacity: disabled ? 0.6 : 1,
    transition: "border-color 0.15s ease",
    boxSizing: "border-box",
    ...style,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
      {label && (
        <label style={{
          fontSize: sizeConfig.labelSize,
          fontWeight: 500,
          color: theme.foreground,
          fontFamily: "inherit",
        }}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        rows={numberOfLines ?? 4}
        disabled={disabled}
        placeholder={placeholder}
        style={textareaStyle}
      />
      {error && (
        <span style={{ fontSize: 12, color: theme.destructive, marginTop: 2 }}>
          {error}
        </span>
      )}
    </div>
  );
});

TextArea.displayName = "TextArea";

export default TextArea;
