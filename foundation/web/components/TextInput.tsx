/**
 * TextInput — Web Component
 *
 * Champ de saisie texte avec label, erreur, et icône.
 * Miroir web du composant RN TextInput.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken, radii } from "../../tokens";
import { applyDefaults, getComponentMeta } from "../../layout/registry";

const META = getComponentMeta("TextInput")!;

const SIZE_MAP = {
  sm: { height: 32, fontSize: 13, px: 10, labelSize: 12 },
  md: { height: 40, fontSize: 15, px: 12, labelSize: 13 },
  lg: { height: 48, fontSize: 17, px: 14, labelSize: 14 },
} as const;

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  variant?: "outlined" | "filled" | "underline";
  size?: "sm" | "md" | "lg";
  borderRadius?: RadiusToken;
  background?: string;
  borderColor?: string;
  secureEntry?: boolean;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>((rawProps, ref) => {
  const { theme } = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const merged = applyDefaults(rawProps, META, theme) as any;
  const {
    label, error, variant, size, borderRadius, background, borderColor,
    secureEntry, disabled, placeholder, style, ...rest
  } = merged as TextInputProps & { [key: string]: unknown };

  const sizeConfig = SIZE_MAP[size as keyof typeof SIZE_MAP] ?? SIZE_MAP.md;
  const radius = borderRadius ? radii[borderRadius] : radii.md;

  const getBorderStyle = (): CSSProperties => {
    const bc = borderColor ?? theme.border;
    switch (variant) {
      case "filled":
        return { border: "none", backgroundColor: background ?? theme.input };
      case "underline":
        return {
          border: "none",
          borderBottom: `1px solid ${bc}`,
          borderRadius: 0,
          backgroundColor: "transparent",
        };
      default:
        return {
          border: `1px solid ${error ? theme.destructive : bc}`,
          backgroundColor: background ?? "transparent",
        };
    }
  };

  const inputStyle: CSSProperties = {
    height: sizeConfig.height,
    paddingLeft: sizeConfig.px,
    paddingRight: sizeConfig.px,
    fontSize: sizeConfig.fontSize,
    color: theme.foreground,
    borderRadius: variant === "underline" ? 0 : radius,
    outline: "none",
    width: "100%",
    fontFamily: "inherit",
    cursor: disabled ? "not-allowed" : "text",
    opacity: disabled ? 0.6 : 1,
    transition: "border-color 0.15s ease",
    boxSizing: "border-box",
    ...getBorderStyle(),
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
      <input
        ref={ref}
        {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        type={secureEntry ? "password" : "text"}
        placeholder={placeholder as string | undefined}
        disabled={disabled as boolean | undefined}
        style={inputStyle}
      />
      {error && (
        <span style={{
          fontSize: 12,
          color: theme.destructive,
          fontFamily: "inherit",
        }}>
          {error}
        </span>
      )}
    </div>
  );
});

TextInput.displayName = "TextInput";

export default TextInput;
