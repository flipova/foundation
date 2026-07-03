/**
 * TextInput
 *
 * Single-line text input with label, error state, and variant support.
 * All defaults come from the component registry.
 */

import React, { useState } from "react";
import { TextInput as RNTextInput, Text } from "react-native";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken, radii, spacing as spacingTokens } from "../../tokens";
import { applyDefaults, getComponentMeta } from "../../registry";
import { TextInputSizeMap } from "../../registry";
import Box from "../primitives/Box";
import Stack from "../primitives/Stack";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("TextInput")!;

export interface TextInputProps extends ExtractComponentProps<"TextInput"> {
  value?: string;
  onChangeText?: (text: string) => void;
  icon?: React.ReactNode;
}

const TextInputComponent: React.FC<TextInputProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    value, onChangeText, variant, size, placeholder, label, error,
    disabled, secureEntry, borderRadius, background, borderColor, icon,
  } = applyDefaults(rawProps, META, theme) as Required<TextInputProps>;

  const [focused, setFocused] = useState(false);
  const sizeConfig = TextInputSizeMap[size] || TextInputSizeMap.md;

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
        flexDirection="row"
        alignItems="center"
        bg={resolvedBg}
        borderRadius={variant === "underline" ? "none" : borderRadius as any}
        px={variant === "underline" ? 0 : sizeConfig.px as any}
        style={[
          { height: sizeConfig.height, overflow: "hidden" },
          showBorder ? {
            borderWidth: 1,
            borderColor: resolvedBorder,
            ...(variant === "underline" ? { borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 } : {})
          } : {}
        ]}
      >
        {icon && <Box pr={2}>{icon}</Box>}
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.mutedForeground}
          secureTextEntry={secureEntry}
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ flex: 1, color: theme.foreground, fontSize: sizeConfig.fontSize, opacity: disabled ? 0.6 : 1 }}
        />
      </Box>
      {error ? (
        <Text style={{ fontSize: 11, color: theme.error, marginTop: 4 }}>
          {error}
        </Text>
      ) : null}
    </Stack>
  );
};

export default TextInputComponent;
