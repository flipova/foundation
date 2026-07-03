/**
 * Checkbox — Web Component
 *
 * Case à cocher avec label. Miroir web du composant RN Checkbox.
 */

import React, { CSSProperties, useId } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii } from "../../tokens";
import { applyDefaults, getComponentMeta } from "../../registry";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("Checkbox")!;

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">, ExtractComponentProps<"Checkbox"> {
  onValueChange?: (checked: boolean) => void;
}

const SIZE_PX: Record<string, number> = { sm: 16, md: 20 };

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>((rawProps, ref) => {
  const { theme } = useTheme();
  const {
    label,
    variant,
    size,
    activeColor,
    disabled,
    checked,
    onChange,
    onValueChange,
    style,
    ...rest
  } = applyDefaults(rawProps, META, theme) as any;
  const id = useId();
  const px = SIZE_PX[size] ?? SIZE_PX.md;
  const radius = variant === "rounded" ? "50%" : radii.sm;
  const color = activeColor ?? theme.primary;

  const wrapStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    userSelect: "none",
    opacity: disabled ? 0.6 : 1,
    ...(style as CSSProperties),
  };

  const inputStyle: CSSProperties = {
    width: px,
    height: px,
    borderRadius: radius,
    accentColor: color,
    cursor: disabled ? "not-allowed" : "pointer",
    flexShrink: 0,
  };

  return (
    <label htmlFor={id} style={wrapStyle}>
      <input
        ref={ref}
        {...rest}
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        style={inputStyle}
        onChange={(e) => {
          onChange?.(e);
          onValueChange?.(e.target.checked);
        }}
      />
      {label && (
        <span style={{ fontSize: size === "sm" ? 13 : 14, color: theme.foreground, fontFamily: "inherit" }}>
          {label}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;
