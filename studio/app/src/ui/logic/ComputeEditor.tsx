/**
 * ComputeEditor — Expression-based computation node.
 * Write a JS-like expression, store result in state.
 * Supports all operators, ternary, string interpolation, math, etc.
 */
import React from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import SmartInput from '../shared/SmartInput';
import { C } from './constants';
import type { ItemField } from './useLogicContext';

interface ComputePayload {
  expression: string;
  storeAs: string;
  description?: string;
}

interface Props {
  payload: ComputePayload;
  onChange: (p: ComputePayload) => void;
  itemFields?: ItemField[];
}

const SNIPPETS = [
  { label: 'Ternary',    code: '$state.x > 0 ? "positive" : "negative"' },
  { label: 'Concat',     code: '$state.firstName + " " + $state.lastName' },
  { label: 'Math',       code: 'Math.round($state.price * 1.2)' },
  { label: 'Array len',  code: '$state.items.length' },
  { label: 'Date',       code: 'new Date().toLocaleDateString()' },
  { label: 'JSON',       code: 'JSON.stringify($state.obj)' },
  { label: 'Parse int',  code: 'parseInt($state.str, 10)' },
  { label: 'Clamp',      code: 'Math.min(Math.max($state.val, 0), 100)' },
  { label: 'Not empty',  code: '$state.list.length > 0' },
  { label: 'Includes',   code: '$state.tags.includes("featured")' },
];

const ComputeEditor: React.FC<Props> = ({ payload, onChange, itemFields }) => {
  const p: ComputePayload = { expression: payload.expression || '', storeAs: payload.storeAs || '', description: payload.description };
  const upd = (partial: Partial<ComputePayload>) => onChange({ ...p, ...partial });

  return (
    <View style={s.root}>
      {/* Description (optional) */}
      <TextInput style={s.descInput} value={p.description || ''} onChangeText={v => upd({ description: v })}
        placeholder="What does this compute? (optional)" placeholderTextColor={C.muted} />

      {/* Expression */}
      <View style={s.section}>
        <Text style={s.label}>EXPRESSION</Text>
        <TextInput
          style={s.exprInput}
          value={p.expression}
          onChangeText={v => upd({ expression: v })}
          multiline
          numberOfLines={3}
          placeholder={'$state.price * $state.qty\n// Use any JS expression'}
          placeholderTextColor={C.muted}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Quick snippets */}
      <View style={s.section}>
        <Text style={s.label}>SNIPPETS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.snippets}>
          {SNIPPETS.map(sn => (
            <Pressable key={sn.label} style={s.snippet} onPress={() => upd({ expression: sn.code })}>
              <Text style={s.snippetTxt}>{sn.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Output */}
      <View style={s.section}>
        <Text style={s.label}>STORE RESULT IN</Text>
        <View style={s.outputRow}>
          <Text style={s.outputPrefix}>$state.</Text>
          <TextInput style={s.outputInput} value={p.storeAs} onChangeText={v => upd({ storeAs: v })}
            placeholder="result" placeholderTextColor={C.muted} autoCapitalize="none" />
        </View>
        {p.storeAs ? <Text style={s.outputHint}>Available as $state.{p.storeAs}</Text> : null}
      </View>
    </View>
  );
};

export default ComputeEditor;

const s = StyleSheet.create({
  root: { gap: 8 },
  section: { gap: 4 },
  label: { color: C.muted, fontSize: 8, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' as any },
  descInput: { height: 28, backgroundColor: C.bg, borderRadius: 5, borderWidth: 1, borderColor: C.border, color: C.muted, fontSize: 10, paddingHorizontal: 8, fontStyle: 'italic' },
  exprInput: { backgroundColor: C.bg, borderRadius: 6, borderWidth: 1, borderColor: C.border, color: '#22c55e', fontSize: 11, fontFamily: 'monospace' as any, padding: 8, minHeight: 60, textAlignVertical: 'top' },
  snippets: { gap: 4 },
  snippet: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  snippetTxt: { color: C.muted, fontSize: 9, fontWeight: '500' },
  outputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg, borderRadius: 6, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  outputPrefix: { color: C.muted, fontSize: 11, paddingHorizontal: 8, paddingVertical: 6 },
  outputInput: { flex: 1, color: C.text, fontSize: 11, fontWeight: '600', paddingVertical: 6, paddingRight: 8 },
  outputHint: { color: '#22c55e', fontSize: 8, fontFamily: 'monospace' as any },
});
