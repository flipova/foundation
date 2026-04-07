/**
 * PasswordStrengthBlock — Password input with strength meter and requirements checklist.
 */
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("PasswordStrengthBlock")!;

export interface PasswordStrengthBlockProps {
  value?: string; label?: string; placeholder?: string; showRequirements?: boolean;
  background?: string; borderRadius?: string; onChange?: (value: string) => void;
}

function getStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const levels = [
    { score: 0, label: "Too weak", color: "#ef4444" },
    { score: 1, label: "Weak",     color: "#f97316" },
    { score: 2, label: "Fair",     color: "#f59e0b" },
    { score: 3, label: "Good",     color: "#84cc16" },
    { score: 4, label: "Strong",   color: "#22c55e" },
  ];
  return levels[score] ?? levels[0];
}

const REQUIREMENTS = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter",       test: (p: string) => /[A-Z]/.test(p) },
  { label: "Number",                 test: (p: string) => /[0-9]/.test(p) },
  { label: "Special character",      test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const PasswordStrengthBlock: React.FC<PasswordStrengthBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<PasswordStrengthBlockProps>;
  const { value: extVal, label, placeholder, showRequirements, background, onChange } = props;
  const [internal, setInternal] = useState("");
  const [visible, setVisible] = useState(false);
  const pwd = extVal ?? internal;
  const { score, label: strengthLabel, color } = getStrength(pwd);

  const handleChange = (v: string) => { setInternal(v); onChange?.(v); };

  return (
    <View style={s.root}>
      {label ? <Text style={[s.label, { color: theme.foreground }]}>{label}</Text> : null}
      <View style={[s.inputRow, { backgroundColor: background || theme.input, borderColor: theme.border }]}>
        <TextInput value={pwd} onChangeText={handleChange} secureTextEntry={!visible}
          placeholder={placeholder} placeholderTextColor={theme.mutedForeground}
          style={[s.input, { color: theme.foreground }]} />
        <Pressable onPress={() => setVisible(v => !v)} style={s.eye}>
          <Feather name={visible ? "eye-off" : "eye"} size={16} color={theme.mutedForeground} />
        </Pressable>
      </View>
      {pwd.length > 0 && (
        <>
          <View style={s.bars}>
            {[0,1,2,3].map(i => (
              <View key={i} style={[s.bar, { backgroundColor: i < score ? color : theme.muted }]} />
            ))}
          </View>
          <Text style={[s.strengthLabel, { color }]}>{strengthLabel}</Text>
        </>
      )}
      {showRequirements && (
        <View style={s.requirements}>
          {REQUIREMENTS.map((req, i) => {
            const ok = req.test(pwd);
            return (
              <View key={i} style={s.req}>
                <Feather name={ok ? "check-circle" : "circle"} size={12} color={ok ? "#22c55e" : theme.mutedForeground} />
                <Text style={[s.reqText, { color: ok ? theme.foreground : theme.mutedForeground }]}>{req.label}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default PasswordStrengthBlock;

const s = StyleSheet.create({
  root: { gap: 8 },
  label: { fontSize: 12, fontWeight: "500" },
  inputRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 10, paddingHorizontal: 12 },
  input: { flex: 1, height: 44, fontSize: 14 },
  eye: { padding: 4 },
  bars: { flexDirection: "row", gap: 4 },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 11, fontWeight: "600" },
  requirements: { gap: 4 },
  req: { flexDirection: "row", alignItems: "center", gap: 6 },
  reqText: { fontSize: 11 },
});
