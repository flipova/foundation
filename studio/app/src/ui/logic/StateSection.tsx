/**
 * StateSection — Page state variable manager.
 * Shows all declared state vars + query aliases.
 * Allows adding/removing page-level state.
 */
import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PageState } from '../../store/StudioProvider';
import { C, STATE_TYPES, METHOD_COLORS } from './constants';

interface Props {
  pageState: PageState[];
  queries: any[];
  onAdd: (ps: PageState) => void;
  onRemove: (name: string) => void;
}

const StateSection: React.FC<Props> = ({ pageState, queries, onAdd, onRemove }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<PageState['type']>('string');
  const [defaultVal, setDefaultVal] = useState('');

  const add = () => {
    const n = name.trim().replace(/[^a-zA-Z0-9_]/g, '');
    if (!n) return;
    const def = defaultVal.trim();
    let parsed: any = def || null;
    if (type === 'number') parsed = Number(def) || 0;
    if (type === 'boolean') parsed = def === 'true';
    if (type === 'array') { try { parsed = JSON.parse(def); } catch { parsed = []; } }
    if (type === 'object') { try { parsed = JSON.parse(def); } catch { parsed = {}; } }
    onAdd({ name: n, type, default: parsed, scope: 'page' });
    setName('');
    setDefaultVal('');
  };

  // Query aliases — auto-managed state vars from queries
  const queryAliases = queries.filter((q: any) => q.alias);

  return (
    <View style={s.root}>
      {/* Declared state vars */}
      {pageState.length > 0 && (
        <View style={s.group}>
          <Text style={s.groupLabel}>Declared</Text>
          {pageState.map(ps => (
            <View key={ps.name} style={s.stateRow}>
              <View style={s.stateInfo}>
                <Text style={s.stateName} numberOfLines={1} ellipsizeMode="tail">{ps.name}</Text>
                <Text style={s.stateType}>{ps.type}</Text>
                <Text style={s.stateExpr} numberOfLines={1} ellipsizeMode="tail">$state.{ps.name}</Text>
              </View>
              <Pressable onPress={() => onRemove(ps.name)} hitSlop={8}>
                <Feather name="x" size={11} color={C.error} />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {/* Query aliases — read-only, managed via Data Queries */}
      {queryAliases.length > 0 && (
        <View style={s.group}>
          <Text style={s.groupLabel}>From queries (auto)</Text>
          {queryAliases.map((q: any) => (
            <View key={q.id} style={[s.stateRow, s.aliasRow]}>
              <View style={[s.methodDot, { backgroundColor: METHOD_COLORS[q.method] || C.primary }]} />
              <View style={s.stateInfo}>
                <Text style={s.stateName}>{q.alias}</Text>
                <Text style={s.stateType}>{q.autoFetch ? 'auto' : 'manual'}</Text>
                <Text style={s.stateExpr}>$state.{q.alias}</Text>
              </View>
              <Text style={s.aliasSource}>{q.name}</Text>
            </View>
          ))}
          <Text style={s.aliasHint}>Manage aliases in Data Queries modal</Text>
        </View>
      )}

      {pageState.length === 0 && queryAliases.length === 0 && (
        <Text style={s.empty}>No state variables yet</Text>
      )}

      {/* Add new state var */}
      <View style={s.addBox}>
        <Text style={s.addTitle}>Add State Variable</Text>
        <TextInput
          style={s.nameInput}
          value={name}
          onChangeText={setName}
          placeholder="variableName"
          placeholderTextColor={C.muted}
          autoCapitalize="none"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.typeRow}>
          {STATE_TYPES.map(t => (
            <Pressable key={t} style={[s.typeBtn, type === t && s.typeBtnOn]} onPress={() => setType(t)}>
              <Text style={[s.typeBtnText, type === t && s.typeBtnTextOn]}>{t}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <TextInput
          style={s.nameInput}
          value={defaultVal}
          onChangeText={setDefaultVal}
          placeholder={`Default value (optional)`}
          placeholderTextColor={C.muted}
        />
        <Pressable style={[s.addBtn, !name.trim() && s.addBtnDisabled]} onPress={add} disabled={!name.trim()}>
          <Feather name="plus" size={12} color={name.trim() ? '#fff' : C.muted} />
          <Text style={[s.addBtnText, !name.trim() && { color: C.muted }]}>Add $state.{name || 'name'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default StateSection;

const s = StyleSheet.create({
  root: { gap: 8 },
  group: { gap: 3 },
  groupLabel: { color: C.muted, fontSize: 9, fontWeight: '600', textTransform: 'uppercase' as any, letterSpacing: 0.5, marginBottom: 2 },
  stateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 6, backgroundColor: C.s2, borderRadius: 6, borderWidth: 1, borderColor: C.border },
  aliasRow: { borderColor: 'rgba(6,182,212,0.2)', backgroundColor: 'rgba(6,182,212,0.04)' },
  stateInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  stateName: { color: C.text, fontSize: 11, fontWeight: '600' },
  stateType: { color: C.muted, fontSize: 9, backgroundColor: C.bg, paddingHorizontal: 4, paddingVertical: 1, borderRadius: 3 },
  stateExpr: { color: '#22c55e', fontSize: 9, fontFamily: 'monospace' as any },
  aliasSource: { color: C.muted, fontSize: 9 },
  aliasHint: { color: C.muted, fontSize: 9, fontStyle: 'italic', marginTop: 2 },
  methodDot: { width: 7, height: 7, borderRadius: 4, flexShrink: 0 },
  empty: { color: C.muted, fontSize: 10, fontStyle: 'italic', textAlign: 'center', paddingVertical: 8 },
  addBox: { backgroundColor: 'rgba(59,130,246,0.04)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(59,130,246,0.15)', padding: 10, gap: 6 },
  addTitle: { color: C.text, fontSize: 10, fontWeight: '600' },
  nameInput: { height: 28, backgroundColor: C.bg, borderRadius: 6, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 11, paddingHorizontal: 8 },
  typeRow: { gap: 3 },
  typeBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  typeBtnOn: { backgroundColor: C.primary, borderColor: C.primary },
  typeBtnText: { color: C.muted, fontSize: 9, fontWeight: '500' },
  typeBtnTextOn: { color: '#fff' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 7, borderRadius: 6, backgroundColor: C.primary },
  addBtnDisabled: { backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  addBtnText: { color: '#fff', fontSize: 11, fontWeight: '600' },
});
