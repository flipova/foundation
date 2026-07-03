/**
 * TextArea — Multi-line text input with label and error support.
 */
import React, { useState } from "react";
import { TextInput as RNTextInput, Text } from "react-native";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta, TextAreaSizeMap } from "../../registry";
import type { ExtractComponentProps } from "../../registry";
import Box from "../primitives/Box";
import Stack from "../primitives/Stack";

const META = getComponentMeta("TextArea")!;

export interface TextAreaProps extends ExtractComponentProps<"TextArea"> {
  value?: string;
  onChangeText?: (t: string) => void;
  children?: React.ReactNode;
}

const TextArea: React.FC<TextAreaProps> = (rawProps) => {
  const { theme } = useTheme();
  const { value, onChangeText, variant, size, placeholder, label, error, disabled, numberOfLines, borderRadius, background } = applyDefaults(rawProps, META, theme) as Required<TextAreaProps>;
  const [focused, setFocused] = useState(false);
  const sizeConfig = TextAreaSizeMap[size as keyof typeof TextAreaSizeMap] || TextAreaSizeMap.md;
  const bg = variant === "outlined" ? "transparent" : (background || theme.input);
  const bc = error ? theme.error : focused ? theme.ring : theme.border;

  return (
    <Stack spacing={1}>
      {label ? <Text style={{ fontSize: sizeConfig.labelSize, fontWeight: "500", color: theme.foreground }}>{label}</Text> : null}
      <Box height={sizeConfig.height} bg={bg} borderRadius={borderRadius as any} px={sizeConfig.px as any} py={sizeConfig.py as any} style={variant === "outlined" ? { borderWidth: 1, borderColor: bc } : {}}>
        <RNTextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={theme.mutedForeground}
          multiline numberOfLines={numberOfLines} editable={!disabled} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex: 1, fontSize: sizeConfig.fontSize, color: disabled ? theme.mutedForeground : theme.foreground, textAlignVertical: "top" }} />
      </Box>
      {error ? <Text style={{ fontSize: 12, color: theme.error }}>{error}</Text> : null}
    </Stack>
  );
};

export default TextArea;
