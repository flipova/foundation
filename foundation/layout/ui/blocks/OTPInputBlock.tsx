/**
 * OTPInputBlock — One-time password input with N digit boxes and auto-focus.
 */
import React, { useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("OTPInputBlock")!;

export interface OTPInputBlockProps {
  length?: number; label?: string; error?: string; disabled?: boolean;
  size?: "sm" | "md" | "lg"; accentColor?: string; background?: string;
  onChange?: (value: string) => void; onComplete?: (value: string) => void;
}

const SIZE_MAP = { sm: 36, md: 48, lg: 58 };

const OTPInputBlock: React.FC<OTPInputBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<OTPInputBlockProps>;
  const { length, label, error, disabled, size, accentColor, background, onChange, onComplete } = props;
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const refs = useRef<(TextInput | null)[]>([]);
  const accent = accentColor || theme.primary;
  const boxSize = SIZE_MAP[size] ?? 48;

  const handleChange = (text: string, i: number) => {
    const val = text.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    const joined = next.join("");
    onChange?.(joined);
    if (val && i < length - 1) refs.current[i + 1]?.focus();
    if (joined.length === length) onComplete?.(joined);
  };

  const handleKeyPress = (e: any, i: number) => {
    if (e.nativeEvent.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  return (
    <View style={s.root}>
      {label ? <Text style={[s.label, { color: theme.foreground }]}>{label}</Text> : null}
      <View style={s.boxes}>
        {digits.map((d, i) => (
          <TextInput
            key={i}
            ref={r => { refs.current[i] = r; }}
            value={d}
            onChangeText={t => handleChange(t, i)}
            onKeyPress={e => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            editable={!disabled}
            style={[s.box, {
              width: boxSize, height: boxSize, fontSize: boxSize * 0.45,
              backgroundColor: background || theme.input,
              borderColor: d ? accent : theme.border,
              color: theme.foreground,
              borderRadius: boxSize * 0.2,
            }]}
          />
        ))}
      </View>
      {error ? <Text style={[s.error, { color: theme.destructive }]}>{error}</Text> : null}
    </View>
  );
};

export default OTPInputBlock;

const s = StyleSheet.create({
  root: { gap: 8 },
  label: { fontSize: 12, fontWeight: "500" },
  boxes: { flexDirection: "row", gap: 8 },
  box: { borderWidth: 1.5, textAlign: "center", fontWeight: "700" },
  error: { fontSize: 11 },
});
