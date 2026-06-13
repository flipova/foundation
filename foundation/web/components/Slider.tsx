/**
 * Slider — Web Component
 *
 * Slider de plage (range input). Miroir web du composant RN Slider.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  size?: "sm" | "md";
  showValue?: boolean;
  activeColor?: string;
  value?: number;
  onValueChange?: (value: number) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(({
  label,
  min = 0,
  max = 100,
  step = 1,
  size = "md",
  showValue = true,
  activeColor,
  disabled,
  value,
  onChange,
  onValueChange,
  style,
  ...rest
}, ref) => {
  const { theme } = useTheme();
  const color = activeColor ?? theme.primary;
  const h = size === "sm" ? 4 : 6;

  const sliderStyle: CSSProperties = {
    width: "100%",
    height: h,
    accentColor: color,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      {(label || showValue) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {label && (
            <span style={{ fontSize: 13, fontWeight: 500, color: theme.foreground, fontFamily: "inherit" }}>
              {label}
            </span>
          )}
          {showValue && value != null && (
            <span style={{ fontSize: 12, color: theme.mutedForeground, fontFamily: "inherit" }}>
              {value}
            </span>
          )}
        </div>
      )}
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        style={sliderStyle}
        onChange={(e) => {
          onChange?.(e);
          onValueChange?.(Number(e.target.value));
        }}
        {...rest}
      />
    </div>
  );
});

Slider.displayName = "Slider";

export default Slider;
