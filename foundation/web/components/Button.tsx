/**
 * Button — Web Component
 *
 * Bouton cliquable avec variant, size, loading, et icône.
 * Même API que le composant RN Button, rendu avec <button>.
 */

import React, { CSSProperties, useMemo } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken, radii, spacing } from "../../tokens";
import { applyDefaults, getComponentMeta } from "../../layout/registry";

const META = getComponentMeta("Button")!;

const SIZE_MAP = {
  sm: { height: 32, px: 12, fontSize: 13, gap: 6 },
  md: { height: 40, px: 16, fontSize: 15, gap: 8 },
  lg: { height: 48, px: 20, fontSize: 17, gap: 10 },
} as const;

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children?: React.ReactNode;
  label?: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  borderRadius?: RadiusToken;
  iconPosition?: "left" | "right";
  onPress?: () => void;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((rawProps, ref) => {
  const { theme } = useTheme();
  const {
    label, icon, variant, size, disabled, loading,
    fullWidth, borderRadius, iconPosition, onPress, onClick, children,
    style, ...rest
  } = applyDefaults(rawProps, META, theme) as Required<ButtonProps> & typeof rawProps;

  const sizeConfig = SIZE_MAP[size as keyof typeof SIZE_MAP] ?? SIZE_MAP.md;
  const radius = borderRadius ? radii[borderRadius] : radii.md;

  const colors = useMemo(() => {
    switch (variant) {
      case "secondary":
        return { bg: theme.secondary, text: theme.secondaryForeground, border: "none" };
      case "outline":
        return { bg: "transparent", text: theme.primary, border: `1px solid ${theme.border}` };
      case "ghost":
        return { bg: "transparent", text: theme.foreground, border: "none" };
      case "destructive":
        return { bg: theme.destructive, text: theme.destructiveForeground, border: "none" };
      default:
        return { bg: theme.primary, text: theme.primaryForeground, border: "none" };
    }
  }, [variant, theme]);

  const buttonStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: sizeConfig.gap,
    height: sizeConfig.height,
    paddingLeft: sizeConfig.px,
    paddingRight: sizeConfig.px,
    fontSize: sizeConfig.fontSize,
    fontWeight: 600,
    fontFamily: "inherit",
    backgroundColor: colors.bg,
    color: colors.text,
    border: colors.border,
    borderRadius: radius,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? "100%" : undefined,
    transition: "opacity 0.15s ease, background-color 0.15s ease",
    textDecoration: "none",
    whiteSpace: "nowrap",
    userSelect: "none",
    outline: "none",
    ...style,
  };

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
    onPress?.();
  };

  const content = children ?? (
    <>
      {icon && iconPosition === "left" && icon}
      {loading ? (
        <span style={{
          display: "inline-block",
          width: 14,
          height: 14,
          border: `2px solid ${colors.text}`,
          borderTopColor: "transparent",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }} />
      ) : (
        <span>{label}</span>
      )}
      {icon && iconPosition === "right" && icon}
    </>
  );

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <button
        ref={ref}
        {...rest}
        type="button"
        disabled={disabled || loading}
        onClick={handleClick}
        style={buttonStyle}
      >
        {content}
      </button>
    </>
  );
});

Button.displayName = "Button";

export default Button;
