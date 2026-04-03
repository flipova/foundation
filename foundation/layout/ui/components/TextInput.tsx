/**
 * TextInput
 *
 * Single-line text input with label, error state, and variant support.
 * All defaults come from the component registry.
 */

import React, { useState } from "react";
import { TextInput as RNTextInput, Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { RadiusToken, radii, spacing as spacingTokens } from "../../../tokens";
import { applyDefaults, getComponentMeta } from "../../registry";
import Box from "../primitives/Box";
import Stack from "../primitives/Stack";

const META = getComponentMeta("TextInput")!;

const SIZE_MAP = {
  sm: { height: 32, fontSize: 13, labelSize: 11 },
  md: { height: 40, fontSize: 15, labelSize: 13 },
  lg: { height: 48, fontSize: 17, labelSize: 14 },
} as const;

export interface TextInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  variant?: "outlined" | "filled" | "underline";
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  secureEntry?: boolean;
  borderRadius?: RadiusToken;
  background?: string;
  borderColor?: string;
  icon?: React.ReactNode;
}

const TextInputComponent: React.FC<TextInputProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    value, onChangeText, variant, size, placeholder, label, error,
    disabled, secureEntry, borderRadius, background, borderColor, icon,
  } = applyDefaults(rawProps, META, theme) as Required<TextInputProps>;

  const [focused, setFocused] = useState(false);
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;

  const resolvedBg = variant === "outlined" ? "transparent" : (background || theme.input);
  const resolvedBorder = error ? theme.error : focused ? theme.ring : (borderColor || theme.border);
  const showBorder = variant === "outlined" || variant === "underline";

  return (
    <Stack spacing={1}>
      {label ? (
        <Text style={{ fontSize: sizeConfig.labelSize, fontWeight: "500", color: theme.foreground }}>
          {label}
        </Text>
      ) : null}

      <Box
        height={sizeConfig.height}
        bg={resolvedBg}
        borderRadius={variant === "underline" ? "none" : borderRadius}
        px={3}
        justifyContent="center"
        style={
          variant === "underline"
            ? { borderBottomWidth: 1, borderBottomColor: resolvedBorder }
            : showBorder
            ? { borderWidth: 1, borderColor: resolvedBorder }
            : undefined
        }
      >
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.mutedForeground}
          secureTextEntry={secureEntry}
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            fontSize: sizeConfig.fontSize,
            color: disabled ? theme.mutedForeground : theme.foreground,
          }}
        />
      </Box>

      {error ? (
        <Text style={{ fontSize: 12, color: theme.error }}>{error}</Text>
      ) : null}
    </Stack>
  );
};

export default TextInputComponent;
