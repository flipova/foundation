/**
 * FormPrimitives — Reusable form building blocks for modals.
 */
import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { C } from './colors';

// ---------------------------------------------------------------------------
// Field — labeled text input
// ---------------------------------------------------------------------------
interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  height?: number;
  mono?: boolean;
  hint?: string;
}

export const Field: React.FC<FieldProps> = ({ label, value, onChange, placeholder, multiline, height, mono, hint }) => (
  <View style={f.field}>
    <Text style={f.label}>{label}</Text>
    <TextInput
      style={[f.input, multiline && { height: height || 64, textAlignVertical: 'top', paddingTop: 8 }, mono && { fontFamily: 'monospace' as any }]}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={C.muted}
      multiline={multiline}
    />
    {hint && <Text style={f.hint}>{hint}</Text>}
  </View>
);

// ---------------------------------------------------------------------------
// FieldRow — two fields side by side
// ---------------------------------------------------------------------------
export const FieldRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={f.row}>{children}</View>
);

// ---------------------------------------------------------------------------
// Seg — segmented control
// ---------------------------------------------------------------------------
interface SegOption { value: string; label: string; icon?: React.ComponentProps<typeof Feather>['name'] }
interface SegProps { options: SegOption[]; value: string; onChange: (v: string) => void; color?: string }

export const Seg: React.FC<SegProps> = ({ options, value, onChange, color = C.primary }) => (
  <View style={f.segRow}>
    {options.map(o => {
      const on = value === o.value;
      return (
        <Pressable key={o.value} style={[f.segBtn, on && { backgroundColor: color, borderColor: color }]} onPress={() => onChange(o.value)}>
          {o.icon && <Feather name={o.icon} size={11} color={on ? '#fff' : C.muted} />}
          <Text style={[f.segText, on && f.segTextOn]}>{o.label}</Text>
        </Pressable>
      );
    })}
  </View>
);

// ---------------------------------------------------------------------------
// Check — checkbox with label
// ---------------------------------------------------------------------------
interface CheckProps { label: string; value: boolean; onChange: (v: boolean) => void }

export const Check: React.FC<CheckProps> = ({ label, value, onChange }) => (
  <Pressable style={f.checkRow} onPress={() => onChange(!value)}>
    <View style={[f.checkbox, value && f.checkboxOn]}>
      {value && <Feather name="check" size={10} color="#fff" />}
    </View>
    <Text style={f.checkLabel}>{label}</Text>
  </Pressable>
);

// ---------------------------------------------------------------------------
// SectionTitle — group heading inside modal content
// ---------------------------------------------------------------------------
export const SectionTitle: React.FC<{ children: React.ReactNode; mt?: number }> = ({ children, mt = 0 }) => (
  <Text style={[f.sectionTitle, mt > 0 && { marginTop: mt }]}>{children}</Text>
);

const f = StyleSheet.create({
  field: { marginBottom: 10 },
  label: { color: C.muted, fontSize: 11, marginBottom: 3 },
  input: { height: 32, backgroundColor: C.s2, borderRadius: 6, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 12, paddingHorizontal: 10 },
  hint: { color: C.muted, fontSize: 9, marginTop: 3, fontStyle: 'italic' },
  row: { flexDirection: 'row', gap: 8 },
  segRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginBottom: 6 },
  segBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 6, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  segText: { color: C.muted, fontSize: 10, fontWeight: '600' },
  segTextOn: { color: '#fff' },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: C.border, backgroundColor: C.s2, alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: C.primary, borderColor: C.primary },
  checkLabel: { color: C.text, fontSize: 12, fontWeight: '500' },
  sectionTitle: { color: C.text, fontSize: 13, fontWeight: '600', marginBottom: 12 },
});
