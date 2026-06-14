/**
 * FormPrimitives — Reusable form building blocks for modals.
 */
import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors as C, font, radius } from '../../ds';

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
// Picker — Native web select for long lists (pages, services)
// ---------------------------------------------------------------------------
interface PickerProps { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string }

export const Picker: React.FC<PickerProps> = ({ value, onChange, options, placeholder }) => (
  // @ts-ignore: using native select for react-native-web
  <select 
    value={value} 
    onChange={(e: any) => onChange(e.target.value)}
    style={{
      width: '100%', backgroundColor: C.s2, color: C.text, border: `1px solid ${C.border}`,
      borderRadius: (radius?.sm || 3), padding: '0 8px', fontSize: 11, fontFamily: (font?.family || 'Lexend'),
      outline: 'none', height: 30, marginBottom: 8, cursor: 'pointer'
    }}
  >
    <option value="" disabled>{placeholder || 'Select an option...'}</option>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

// ---------------------------------------------------------------------------
// PickerField — select with label
// ---------------------------------------------------------------------------
interface PickerFieldProps { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string; hint?: string }

export const PickerField: React.FC<PickerFieldProps> = ({ label, value, onChange, options, placeholder, hint }) => (
  <View style={f.field}>
    <Text style={f.label}>{label}</Text>
    {/* @ts-ignore */}
    <select 
      value={value} 
      onChange={(e: any) => onChange(e.target.value)}
      style={{
        width: '100%', backgroundColor: C.s2, color: C.text, border: `1px solid ${C.border}`,
        borderRadius: (radius?.sm || 3), padding: '0 8px', fontSize: 11, fontFamily: (font?.family || 'Lexend'),
        outline: 'none', height: 30, cursor: 'pointer'
      }}
    >
      <option value="" disabled>{placeholder || 'Select an option...'}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    {hint && <Text style={f.hint}>{hint}</Text>}
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
  field: { marginBottom: 8 },
  label: { color: C.muted, fontSize: 10, fontFamily: (font?.family || 'Lexend'), marginBottom: 3 },
  input: { height: 30, backgroundColor: C.s2, borderRadius: (radius?.sm || 3), borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 11, fontFamily: (font?.family || 'Lexend'), paddingHorizontal: 8 },
  hint: { color: C.muted, fontSize: 9, fontFamily: (font?.family || 'Lexend'), marginTop: 3, fontStyle: 'italic' },
  row: { flexDirection: 'row', gap: 8 },
  segRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginBottom: 6 },
  segBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: (radius?.xs || 2), backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  segText: { color: C.muted, fontSize: 10, fontFamily: (font?.family || 'Lexend'), fontWeight: '500' },
  segTextOn: { color: '#fff', fontFamily: (font?.family || 'Lexend') },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  checkbox: { width: 16, height: 16, borderRadius: (radius?.xs || 2), borderWidth: 1, borderColor: C.border, backgroundColor: C.s2, alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: C.primary, borderColor: C.primary },
  checkLabel: { color: C.text, fontSize: 11, fontFamily: (font?.family || 'Lexend'), fontWeight: '400' },
  sectionTitle: { color: C.text, fontSize: 12, fontFamily: (font?.family || 'Lexend'), fontWeight: '500', marginBottom: 10 },
});
