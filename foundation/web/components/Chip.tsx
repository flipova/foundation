/**
 * Chip — Web Component
 *
 * Chip / tag sélectionnable avec action de fermeture optionnelle.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken } from "../../tokens";

export interface ChipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "onSelect"> {
  label?: string;
  variant?: "filled" | "outline";
  size?: "sm" | "md";
  selected?: boolean;
  closable?: boolean;
  disabled?: boolean;
  borderRadius?: RadiusToken;
  onClose?: () => void;
  onSelect?: (selected: boolean) => void;
}

const Chip: React.FC<ChipProps> = ({
  label,
  variant = "filled",
  size = "md",
  selected = false,
  closable = false,
  disabled = false,
  borderRadius = "full",
  onClose,
  onSelect,
  onClick,
  style,
  children,
  ...rest
}) => {
  const { theme } = useTheme();
  const radius = radii[borderRadius];
  const px = size === "sm" ? 8 : 12;
  const py = size === "sm" ? 3 : 5;
  const fontSize = size === "sm" ? 12 : 13;

  const bg = selected
    ? theme.primary
    : variant === "filled"
    ? theme.muted
    : "transparent";

  const textColor = selected ? theme.primaryForeground : theme.foreground;
  const border = variant === "outline" ? `1px solid ${theme.border}` : "none";

  const chipStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    paddingLeft: px,
    paddingRight: closable ? px / 2 : px,
    paddingTop: py,
    paddingBottom: py,
    fontSize,
    fontWeight: 500,
    fontFamily: "inherit",
    borderRadius: radius,
    backgroundColor: bg,
    color: textColor,
    border,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    userSelect: "none",
    transition: "background-color 0.15s ease, color 0.15s ease",
    whiteSpace: "nowrap",
    ...style,
  };

  return (
    <span
      style={chipStyle}
      onClick={(e) => {
        if (disabled) return;
        onClick?.(e);
        onSelect?.(!selected);
      }}
      {...rest}
    >
      {children ?? label}
      {closable && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); if (!disabled) onClose?.(); }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 2,
            color: "inherit",
            display: "inline-flex",
            alignItems: "center",
            opacity: 0.7,
          }}
          aria-label="remove"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M9 3L6 6M6 6L3 9M6 6L9 9M6 6L3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </span>
  );
};

export default Chip;
