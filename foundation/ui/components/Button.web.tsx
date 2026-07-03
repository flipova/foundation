/**
 * Button — Web Component
 *
 * Bouton cliquable avec variant, size, loading, et icône.
 * Même API que le composant RN Button, rendu avec <button>.
 */

import React, { CSSProperties, useMemo } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken, radii, spacing } from "../../tokens";
import { applyDefaults, getComponentMeta } from "../../registry";
import type { IconPosition } from "../../registry";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("Button")!;

export interface ButtonProps extends Omit<Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">, "color" | "size">, ExtractComponentProps<"Button"> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  onPress?: () => void;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((rawProps, ref) => {
  const { theme } = useTheme();
  const {
    label, icon, variant, size, disabled, loading,
    fullWidth, borderRadius, iconPosition, onPress, onClick, children,
    style, ...rest
  } = applyDefaults(rawProps, META, theme) as Required<ButtonProps> & typeof rawProps;

  const sizeConfig = (META.sizeMap?.[size] ?? META.sizeMap?.["md"]) as any;
  const radius = borderRadius ? radii[borderRadius as keyof typeof radii] : radii.md;

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
    gap: spacing[2],
    height: sizeConfig.height,
    paddingLeft: spacing[sizeConfig.px as keyof typeof spacing],
    paddingRight: spacing[sizeConfig.px as keyof typeof spacing],
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
        style={buttonStyle}
        onClick={handleClick}
        disabled={disabled || loading}
      >
        {content}
      </button>
    </>
  );
});

Button.displayName = "Button";

export default Button;
