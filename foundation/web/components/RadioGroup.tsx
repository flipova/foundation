/**
 * RadioGroup — Web Component
 *
 * Groupe de boutons radio pour sélection unique.
 */

import React, { CSSProperties, useId } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { spacing, SpacingToken } from "../../tokens";

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options?: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  direction?: "row" | "column";
  size?: "sm" | "md";
  spacing?: SpacingToken;
  disabled?: boolean;
  activeColor?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options = [],
  value,
  onChange,
  label,
  direction = "column",
  size = "md",
  spacing: spacingToken = 2,
  disabled,
  activeColor,
  style,
  ...rest
}) => {
  const { theme } = useTheme();
  const name = useId();
  const gap = spacing[spacingToken];
  const color = activeColor ?? theme.primary;
  const fontSize = size === "sm" ? 13 : 14;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style as CSSProperties }} {...rest}>
      {label && (
        <span style={{ fontSize, fontWeight: 500, color: theme.foreground, fontFamily: "inherit" }}>
          {label}
        </span>
      )}
      <div style={{ display: "flex", flexDirection: direction, gap, flexWrap: "wrap" }}>
        {options.map((opt) => (
          <label
            key={opt.value}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              cursor: disabled ? "not-allowed" : "pointer",
              userSelect: "none",
              opacity: disabled ? 0.6 : 1,
            }}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              disabled={disabled}
              onChange={() => onChange?.(opt.value)}
              style={{ accentColor: color, cursor: disabled ? "not-allowed" : "pointer" }}
            />
            <span style={{ fontSize, color: theme.foreground, fontFamily: "inherit" }}>
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
