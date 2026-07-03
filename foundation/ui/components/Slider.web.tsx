/**
 * Slider — Web Component
 *
 * Slider de plage (range input). Miroir web du composant RN Slider.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta, SliderSizeMap } from "../../registry";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("Slider")!;

export interface SliderProps extends Omit<Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">, "color" | "size" | "max" | "min" | "step">, ExtractComponentProps<"Slider"> {
  value?: number;
  onValueChange?: (value: number) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>((rawProps, ref) => {
  const { theme } = useTheme();
  const {
    label,
    min,
    max,
    step,
    size,
    showValue,
    activeColor,
    disabled,
    value,
    onChange,
    onValueChange,
    style,
    ...rest
  } = applyDefaults(rawProps, META, theme) as Required<SliderProps>;

  const color = activeColor ?? theme.primary;
  const sizeConfig = SliderSizeMap[size as keyof typeof SliderSizeMap] || SliderSizeMap.md;
  const h = sizeConfig.trackHeight;

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
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          {label ? <span style={{ fontSize: sizeConfig.labelSize, fontWeight: 500, color: theme.foreground }}>{label}</span> : <span />}
          {showValue && <span style={{ fontSize: sizeConfig.valueSize, fontWeight: 600, color }}>{value}</span>}
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
