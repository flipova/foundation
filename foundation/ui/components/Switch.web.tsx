/**
 * Switch — Web Component
 *
 * Interrupteur on/off. Miroir web du composant RN Switch.
 */

import React, { CSSProperties, useId } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta, SwitchSizeMap } from "../../registry";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("Switch")!;

export interface SwitchProps extends Omit<Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">, "color" | "size">, ExtractComponentProps<"Switch"> {
  onValueChange?: (value: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>((rawProps, ref) => {
  const { theme } = useTheme();
  const id = useId();
  const merged = applyDefaults(rawProps, META, theme) as any;
  const {
    label,
    size,
    activeColor,
    trackColor,
    disabled,
    checked,
    onChange,
    onValueChange,
    style,
    ...rest
  } = merged;

  const sizeConfig = SwitchSizeMap[size as keyof typeof SwitchSizeMap] || SwitchSizeMap.md;
  const w = sizeConfig.width;
  const h = sizeConfig.height;
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

  return (
    <label htmlFor={id} style={wrapStyle}>
      <input
        ref={ref}
        {...rest}
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
        onChange={(e) => {
          onChange?.(e);
          onValueChange?.(e.target.checked);
        }}
      />
      {/* Custom visual toggle */}
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: w,
          height: h,
          borderRadius: h,
          backgroundColor: checked ? color : (trackColor ?? theme.muted),
          position: "relative",
          transition: "background-color 0.2s ease",
          flexShrink: 0,
        }}
      >
        <span style={{
          position: "absolute",
          top: 2,
          left: checked ? w - h + 2 : 2,
          width: h - 4,
          height: h - 4,
          borderRadius: "50%",
          backgroundColor: "#fff",
          transition: "left 0.2s ease",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }} />
      </span>
      {label && (
        <span style={{ fontSize: sizeConfig.labelSize, color: theme.foreground, fontFamily: "inherit" }}>
          {label}
        </span>
      )}
    </label>
  );
});

Switch.displayName = "Switch";

export default Switch;
