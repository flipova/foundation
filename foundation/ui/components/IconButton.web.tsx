/**
 * IconButton — Web Component
 *
 * Bouton icône uniquement. Miroir web du composant RN IconButton.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken } from "../../tokens";
import { applyDefaults, getComponentMeta } from "../../registry";
import { IconButtonSizeMap } from "../../registry";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("IconButton")!;

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color" | "size">, ExtractComponentProps<"IconButton"> {
  icon: React.ReactNode;
  onPress?: () => void;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>((rawProps, ref) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<IconButtonProps>;
  const {
    icon, variant, size, borderRadius, color, disabled, onPress, onClick, style, ...rest
  } = props as any;

  const px = IconButtonSizeMap[size as keyof typeof IconButtonSizeMap] ?? IconButtonSizeMap.md;
  const radius = radii[borderRadius as RadiusToken] || radii.full;

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
