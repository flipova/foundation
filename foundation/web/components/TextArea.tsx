/**
 * TextArea — Web Component
 *
 * Zone de texte multi-lignes. Miroir web du composant RN TextArea.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken, radii } from "../../tokens";
import { applyDefaults, getComponentMeta } from "../../layout/registry";

const META = getComponentMeta("TextArea")!;

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: string;
  error?: string;
  variant?: "outlined" | "filled";
  size?: "sm" | "md" | "lg";
  borderRadius?: RadiusToken;
  background?: string;
  numberOfLines?: number;
}

const SIZE_MAP = {
  sm: { fontSize: 13, px: 10, labelSize: 12 },
  md: { fontSize: 15, px: 12, labelSize: 13 },
  lg: { fontSize: 17, px: 14, labelSize: 14 },
} as const;

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>((rawProps, ref) => {
  const { theme } = useTheme();
  const {
    label, error, variant, size, borderRadius, background, numberOfLines,
    disabled, placeholder, style, ...rest
  } = applyDefaults(rawProps, META, theme) as Required<TextAreaProps> & typeof rawProps;

  const sizeConfig = SIZE_MAP[size as keyof typeof SIZE_MAP] ?? SIZE_MAP.md;
  const radius = borderRadius ? radii[borderRadius] : radii.md;

  const textareaStyle: CSSProperties = {
    padding: sizeConfig.px,
    fontSize: sizeConfig.fontSize,
    color: theme.foreground,
    borderRadius: radius,
    border: variant === "filled" ? "none" : `1px solid ${error ? theme.destructive : theme.border}`,
    backgroundColor: background ?? (variant === "filled" ? theme.input : "transparent"),
    outline: "none",
    width: "100%",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: (numberOfLines ?? 4) * 24,
    cursor: disabled ? "not-allowed" : "text",
    opacity: disabled ? 0.6 : 1,
    boxSizing: "border-box",
    transition: "border-color 0.15s ease",
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
        placeholder={placeholder as string | undefined}
        disabled={disabled as boolean | undefined}
        rows={numberOfLines ?? 4}
        style={textareaStyle}
      />
      {error && (
        <span style={{ fontSize: 12, color: theme.destructive, fontFamily: "inherit" }}>
          {error}
        </span>
      )}
    </div>
  );
});

TextArea.displayName = "TextArea";

export default TextArea;
