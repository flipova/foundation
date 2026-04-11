/**
 * TextArea — Multi-line text input with label and error support.
 */
import React, { useState } from "react";
import { TextInput as RNTextInput, Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Box from "../primitives/Box";
import Stack from "../primitives/Stack";

const META = getComponentMeta("TextArea")!;

export interface TextAreaProps {
  value?: string; onChangeText?: (t: string) => void; variant?: "outlined" | "filled";
  size?: "sm" | "md" | "lg"; placeholder?: string; label?: string; error?: string;
  disabled?: boolean; numberOfLines?: number; borderRadius?: string; background?: string;
  children?: React.ReactNode;
}

const TextArea: React.FC<TextAreaProps> = (rawProps) => {
  const { theme } = useTheme();
  const { value, onChangeText, variant, size, placeholder, label, error, disabled, numberOfLines, borderRadius, background } = applyDefaults(rawProps, META, theme) as Required<TextAreaProps>;
  const [focused, setFocused] = useState(false);
  const h = { sm: 80, md: 120, lg: 180 }[size] || 120;
  const fs = { sm: 13, md: 15, lg: 17 }[size] || 15;
  const bg = variant === "outlined" ? "transparent" : (background || theme.input);
  const bc = error ? theme.error : focused ? theme.ring : theme.border;

  return (
    <Stack spacing={1}>
      {label ? <Text style={{ fontSize: 13, fontWeight: "500", color: theme.foreground }}>{label}</Text> : null}
      <Box height={h} bg={bg} borderRadius={borderRadius as any} px={3} py={2} style={variant === "outlined" ? { borderWidth: 1, borderColor: bc } : {}}>
        <RNTextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={theme.mutedForeground}
          multiline numberOfLines={numberOfLines} editable={!disabled} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex: 1, fontSize: fs, color: disabled ? theme.mutedForeground : theme.foreground, textAlignVertical: "top" }} />
      </Box>
      {error ? <Text style={{ fontSize: 12, color: theme.error }}>{error}</Text> : null}
    </Stack>
  );
};

export default TextArea;
