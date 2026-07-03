/**
 * Button
 *
 * Pressable button with variant, size, loading, and icon support.
 * All defaults and variants come from the component registry.
 */

import React, { useMemo } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken, radii, spacing as spacingTokens } from "../../tokens";
import { applyDefaults, getComponentMeta } from "../../registry";
import { ButtonSizeMap } from "../../registry";
import type { IconPosition } from "../../registry";
import Box from "../primitives/Box";
import Inline from "../primitives/Inline";

const META = getComponentMeta("Button")!;



import type { ExtractComponentProps } from "../../registry";

export interface ButtonProps extends ExtractComponentProps<"Button"> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  onPress?: () => void;
}

const Button: React.FC<ButtonProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    label, icon, variant, size, disabled, loading,
    fullWidth, borderRadius, iconPosition, onPress, children,
  } = applyDefaults(rawProps, META, theme) as Required<ButtonProps>;

  const sizeConfig = ButtonSizeMap[size as keyof typeof ButtonSizeMap] || ButtonSizeMap.md;

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

