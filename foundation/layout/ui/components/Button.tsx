/**
 * Button
 *
 * Pressable button with variant, size, loading, and icon support.
 * All defaults and variants come from the component registry.
 */

import React, { useMemo } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { RadiusToken, radii, spacing as spacingTokens } from "../../../tokens";
import { applyDefaults, getComponentMeta } from "../../registry";
import Box from "../primitives/Box";
import Inline from "../primitives/Inline";

const META = getComponentMeta("Button")!;

const SIZE_MAP = {
  sm: { height: 32, px: 3, fontSize: 13 },
  md: { height: 40, px: 4, fontSize: 15 },
  lg: { height: 48, px: 5, fontSize: 17 },
} as const;

export interface ButtonProps {
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
}

const Button: React.FC<ButtonProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    label, icon, variant, size, disabled, loading,
    fullWidth, borderRadius, iconPosition, onPress, children,
  } = applyDefaults(rawProps, META, theme) as Required<ButtonProps>;

  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;

  const colors = useMemo(() => {
    switch (variant) {
      case "secondary":
        return { bg: theme.secondary, text: theme.secondaryForeground };
      case "outline":
        return { bg: "transparent", text: theme.primary, border: theme.border };
      case "ghost":
        return { bg: "transparent", text: theme.foreground };
      case "destructive":
        return { bg: theme.destructive, text: theme.destructiveForeground };
      default:
        return { bg: theme.primary, text: theme.primaryForeground };
    }
  }, [variant, theme]);

  const content = children ?? (
    <Inline spacing={2} align="center" justify="center">
      {icon && iconPosition === "left" && icon}
      {loading ? (
        <ActivityIndicator size="small" color={colors.text} />
      ) : label ? (
        <Text style={{ color: colors.text, fontSize: sizeConfig.fontSize, fontWeight: "600" }}>
          {label}
        </Text>
      ) : null}
      {icon && iconPosition === "right" && icon}
    </Inline>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={({ pressed }) => ({
        opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        width: fullWidth ? "100%" : undefined,
      })}
    >
      <Box
        height={sizeConfig.height}
        px={sizeConfig.px}
        bg={colors.bg}
        borderRadius={borderRadius}
        justifyContent="center"
        alignItems="center"
        style={colors.border ? { borderWidth: 1, borderColor: colors.border } : {}}
      >
        {content}
      </Box>
    </Pressable>
  );
};

export default Button;
