/**
 * TextInput — Web Component
 *
 * Champ de saisie texte avec label, erreur, et icône.
 * Miroir web du composant RN TextInput.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken, radii, spacing } from "../../tokens";
import { applyDefaults, getComponentMeta } from "../../registry";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("TextInput")!;


export interface TextInputProps extends Omit<Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">, "color" | "size">, ExtractComponentProps<"TextInput"> {

}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>((rawProps, ref) => {
  const { theme } = useTheme();
  const merged = applyDefaults(rawProps, META, theme) as any;
  const {
    label, error, variant, size, borderRadius, background, borderColor,
    secureEntry, disabled, placeholder, style, ...rest
  } = merged;

  const sizeConfig = (META.sizeMap?.[size] ?? META.sizeMap?.["md"]) as any;
  const radius = borderRadius ? radii[borderRadius as RadiusToken] : radii.md;

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
    paddingLeft: spacing[sizeConfig.px as keyof typeof spacing],
    paddingRight: spacing[sizeConfig.px as keyof typeof spacing],
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
