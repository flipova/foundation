/**
 * IconButton — Web Component
 *
 * Bouton icône uniquement. Miroir web du composant RN IconButton.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken } from "../../tokens";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: "filled" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  borderRadius?: RadiusToken;
  color?: string;
  onPress?: () => void;
}

const SIZE_PX: Record<string, number> = { sm: 32, md: 40, lg: 48 };

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon,
  variant = "ghost",
  size = "md",
  borderRadius = "full",
  color,
  disabled,
  onPress,
  onClick,
  style,
  ...rest
}, ref) => {
  const { theme } = useTheme();
  const px = SIZE_PX[size] ?? SIZE_PX.md;
  const radius = radii[borderRadius];

  const bg = variant === "filled"
    ? theme.muted
    : "transparent";

  const border = variant === "outline" ? `1px solid ${theme.border}` : "none";

  const btnStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: px,
    height: px,
    borderRadius: radius,
    backgroundColor: bg,
    border,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    color: color ?? theme.foreground,
    transition: "background-color 0.15s ease, opacity 0.15s ease",
    flexShrink: 0,
    padding: 0,
    ...style,
  };

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (disabled) return;
    onClick?.(e);
    onPress?.();
  };

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={handleClick}
      style={btnStyle}
      aria-label="icon button"
      {...rest}
    >
      {icon}
    </button>
  );
});

IconButton.displayName = "IconButton";

export default IconButton;
