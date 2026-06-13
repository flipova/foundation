/**
 * Select — Web Component
 *
 * Dropdown de sélection. Miroir web du composant RN Select.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken } from "../../tokens";
import { applyDefaults, getComponentMeta } from "../../layout/registry";

const META = getComponentMeta("Select")!;

const SIZE_MAP = {
  sm: { height: 32, fontSize: 13, px: 10 },
  md: { height: 40, fontSize: 15, px: 12 },
  lg: { height: 48, fontSize: 17, px: 14 },
} as const;

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  variant?: "outlined" | "filled";
  size?: "sm" | "md" | "lg";
  borderRadius?: RadiusToken;
  background?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>((rawProps, ref) => {
  const { theme } = useTheme();
  const {
    label, error, variant, size, borderRadius, background, placeholder, options,
    disabled, style, children, ...rest
  } = applyDefaults(rawProps, META, theme) as Required<SelectProps> & typeof rawProps;

  const sizeConfig = SIZE_MAP[size as keyof typeof SIZE_MAP] ?? SIZE_MAP.md;
  const radius = borderRadius ? radii[borderRadius] : radii.md;

  const selectStyle: CSSProperties = {
    height: sizeConfig.height,
    paddingLeft: sizeConfig.px,
    paddingRight: 32,
    fontSize: sizeConfig.fontSize,
    color: theme.foreground,
    borderRadius: radius,
    border: variant === "filled" ? "none" : `1px solid ${error ? theme.destructive : theme.border}`,
    backgroundColor: background ?? (variant === "filled" ? theme.input : "transparent"),
    outline: "none",
    width: "100%",
    fontFamily: "inherit",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='${encodeURIComponent(theme.mutedForeground)}' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    boxSizing: "border-box",
    ...style,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: theme.foreground, fontFamily: "inherit" }}>
          {label}
        </label>
      )}
      <select ref={ref} disabled={disabled} style={selectStyle} {...rest}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
        {children}
      </select>
      {error && (
        <span style={{ fontSize: 12, color: theme.destructive, fontFamily: "inherit" }}>{error}</span>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;
