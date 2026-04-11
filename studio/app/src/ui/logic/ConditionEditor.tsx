/**
 * ConditionEditor — Full if / else-if / else block with nested action arrays.
 * Each branch can contain multiple actions (setState, navigate, toast, etc.)
 */
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import SmartInput from '../shared/SmartInput';
import { C, CONDITION_OPS, ACTION_META } from './constants';
import type { ActionDef } from '../../store/StudioProvider';
import type { ItemField } from './useLogicContext';

interface Condition {
  left: string;
  op: string;
  right?: string;
}

interface Branch {
  condition?: Condition; // undefined = else branch
  actions: ActionDef[];
}

interface ConditionPayload {
  branches: Branch[];
}

interface Props {
  payload: ConditionPayload;
  onChange: (p: ConditionPayload) => void;
  itemFields?: ItemField[];
}

// ─── Inline mini action row ───────────────────────────────────────────────────
const MiniAction: React.FC<{
  action: ActionDef;
  onChange: (a: ActionDef) => void;
  onRemove: () => void;
}> = ({ action, onChange, onRemove }) => {
  const meta = ACTION_META[action.type as keyof typeof ACTION_META] as { icon: React.ComponentProps<typeof Feather>['name']; color: string; label: string } | undefined;
  const upd = (payload: Record<string, any>) => onChange({ ...action, payload: { ...action.payload, ...payload } });

  return (
    <View style={s.miniAction}>
      <View style={[s.miniActionIcon, { backgroundColor: (meta?.color || C.muted) + '20' }]}>
        <Feather name={(meta?.icon as React.ComponentProps<typeof Feather>['name']) || 'zap'} size={10} color={meta?.color || C.muted} />
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        {/* Type selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.miniTypeRow}>
          {(['setState','navigate','toast','callApi','delay'] as string[]).map(t => {
            const m = ACTION_META[t as keyof typeof ACTION_META] as { color: string; label: string } | undefined;
            const on = action.type === t;
            return (
              <Pressable key={t} style={[s.miniTypeBtn, on && { backgroundColor: m?.color, borderColor: m?.color }]}
                onPress={() => onChange({ type: t as any, payload: {} })}>
                <Text style={[s.miniTypeTxt, on && { color: '#fff' }]}>{m?.label || t}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        {/* Inline fields */}
        {action.type === 'setState' && (
          <View style={s.miniFields}>
            <TextInput style={s.miniInput} value={String(action.payload.key || '')}
              onChangeText={v => upd({ key: v })} placeholder="state key" placeholderTextColor={C.muted} />
            <Text style={s.miniSep}>=</Text>
            <TextInput style={[s.miniInput, { flex: 2 }]} value={String(action.payload.value ?? '')}
              onChangeText={v => upd({ value: v })} placeholder="value" placeholderTextColor={C.muted} />
          </View>
        )}
        {action.type === 'navigate' && (
          <TextInput style={s.miniInput} value={String(action.payload.screen || '')}
            onChangeText={v => upd({ screen: v })} placeholder="screen" placeholderTextColor={C.muted} />
        )}
        {action.type === 'toast' && (
          <TextInput style={s.miniInput} value={String(action.payload.message || '')}
            onChangeText={v => upd({ message: v })} placeholder="message" placeholderTextColor={C.muted} />
        )}
        {(action.type as string) === 'delay' && (
          <TextInput style={s.miniInput} value={String(action.payload.ms || 500)}
            onChangeText={v => upd({ ms: Number(v) || 500 })} placeholder="ms" keyboardType="numeric" placeholderTextColor={C.muted} />
        )}
      </View>
      <Pressable onPress={onRemove} hitSlop={8}><Feather name="x" size={10} color={C.muted} /></Pressable>
    </View>
  );
};

// ─── Single branch editor ─────────────────────────────────────────────────────
const BranchEditor: React.FC<{
  branch: Branch;
  index: number;
  isElse: boolean;
  onChange: (b: Branch) => void;
  onRemove: () => void;
  itemFields?: ItemField[];
}> = ({ branch, index, isElse, onChange, onRemove, itemFields }) => {
  const upd = (partial: Partial<Branch>) => onChange({ ...branch, ...partial });
  const updCond = (partial: Partial<Condition>) =>
    upd({ condition: { left: '', op: '==', ...branch.condition, ...partial } });

  const addAction = () => upd({ actions: [...branch.actions, { type: 'setState', payload: { key: '', value: '' } }] });
  const updateAction = (i: number, a: ActionDef) => {
    const next = [...branch.actions]; next[i] = a; upd({ actions: next });
  };
  const removeAction = (i: number) => upd({ actions: branch.actions.filter((_, j) => j !== i) });

  const branchColor = isElse ? C.muted : index === 0 ? '#3b82f6' : '#f97316';
  const branchLabel = isElse ? 'ELSE' : index === 0 ? 'IF' : 'ELSE IF';

  return (
    <View style={[s.branch, { borderLeftColor: branchColor }]}>
      {/* Branch header */}
      <View style={s.branchHeader}>
        <View style={[s.branchBadge, { backgroundColor: branchColor + '20' }]}>
          <Text style={[s.branchBadgeTxt, { color: branchColor }]}>{branchLabel}</Text>
        </View>
        {!isElse && (
          <Pressable onPress={onRemove} hitSlop={8} style={s.branchRemove}>
            <Feather name="x" size={10} color={C.muted} />
          </Pressable>
        )}
      </View>

      {/* Condition (not for else) */}
      {!isElse && (
        <View style={s.condRow}>
          <View style={{ flex: 1 }}>
            <SmartInput label="" value={branch.condition?.left || ''} onChange={v => updCond({ left: v })}
              propType="string" isExpression itemFields={itemFields} placeholder="$state.x" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.opRow}>
            {CONDITION_OPS.map(o => {
              const on = (branch.condition?.op || '==') === o.op;
              return (
                <Pressable key={o.op} style={[s.opBtn, on && { backgroundColor: branchColor, borderColor: branchColor }]}
                  onPress={() => updCond({ op: o.op })}>
                  <Text style={[s.opBtnTxt, on && { color: '#fff' }]}>{o.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          {!['isEmpty','isNotEmpty','isNull','isNotNull','isTrue','isFalse','isNumber','isString','isArray','isObject'].includes(branch.condition?.op || '') && (
            <View style={{ flex: 1 }}>
              <SmartInput label="" value={branch.condition?.right || ''} onChange={v => updCond({ right: v })}
                propType="string" isExpression itemFields={itemFields} placeholder="value" />
            </View>
          )}
        </View>
      )}

      {/* Actions */}
      <View style={s.actionsWrap}>
        <Text style={s.actionsLabel}>THEN</Text>
        {branch.actions.map((a, i) => (
          <MiniAction key={i} action={a} onChange={u => updateAction(i, u)} onRemove={() => removeAction(i)} />
        ))}
        <Pressable style={s.addActionBtn} onPress={addAction}>
          <Feather name="plus" size={10} color={branchColor} />
          <Text style={[s.addActionTxt, { color: branchColor }]}>Add action</Text>
        </Pressable>
      </View>
    </View>
  );
};

// ─── ConditionEditor ──────────────────────────────────────────────────────────
const ConditionEditor: React.FC<Props> = ({ payload, onChange, itemFields }) => {
  const branches: Branch[] = payload.branches?.length
    ? payload.branches
    : [{ condition: { left: '', op: '==' }, actions: [] }];

  const upd = (bs: Branch[]) => onChange({ branches: bs });
  const updateBranch = (i: number, b: Branch) => { const next = [...branches]; next[i] = b; upd(next); };
  const removeBranch = (i: number) => upd(branches.filter((_, j) => j !== i));

  const hasElse = branches[branches.length - 1]?.condition === undefined;

  const addElseIf = () => {
    const next = [...branches];
    const insertAt = hasElse ? next.length - 1 : next.length;
    next.splice(insertAt, 0, { condition: { left: '', op: '==' }, actions: [] });
    upd(next);
  };

  const addElse = () => {
    if (!hasElse) upd([...branches, { actions: [] }]);
  };

  return (
    <View style={s.root}>
      {branches.map((b, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <View style={s.connector}>
              <View style={s.connectorLine} />
            </View>
          )}
          <BranchEditor
            branch={b}
            index={i}
            isElse={b.condition === undefined}
            onChange={u => updateBranch(i, u)}
            onRemove={() => removeBranch(i)}
            itemFields={itemFields}
          />
        </React.Fragment>
      ))}

      {/* Add branch buttons */}
      <View style={s.addBranchRow}>
        <Pressable style={s.addBranchBtn} onPress={addElseIf}>
          <Feather name="plus" size={10} color={C.muted} />
          <Text style={s.addBranchTxt}>+ ELSE IF</Text>
        </Pressable>
        {!hasElse && (
          <Pressable style={s.addBranchBtn} onPress={addElse}>
            <Feather name="corner-down-right" size={10} color={C.muted} />
            <Text style={s.addBranchTxt}>+ ELSE</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default ConditionEditor;

const s = StyleSheet.create({
  root: { gap: 0 },

  // Branch
  branch: { borderLeftWidth: 3, borderRadius: 8, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, overflow: 'hidden', marginBottom: 2 },
  branchHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: C.border },
  branchBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4 },
  branchBadgeTxt: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8 },
  branchRemove: { marginLeft: 'auto' as any, padding: 2 },

  // Condition row
  condRow: { padding: 8, gap: 5 },
  opRow: { gap: 3 },
  opBtn: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  opBtnTxt: { color: C.muted, fontSize: 8, fontWeight: '600' },

  // Actions
  actionsWrap: { paddingHorizontal: 8, paddingBottom: 8, gap: 4 },
  actionsLabel: { color: C.muted, fontSize: 8, fontWeight: '700', letterSpacing: 0.8, marginTop: 4 },
  addActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4 },
  addActionTxt: { fontSize: 9, fontWeight: '600' },

  // Mini action
  miniAction: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, backgroundColor: C.s2, borderRadius: 6, borderWidth: 1, borderColor: C.border, padding: 6 },
  miniActionIcon: { width: 20, height: 20, borderRadius: 5, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  miniTypeRow: { gap: 3 },
  miniTypeBtn: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  miniTypeTxt: { color: C.muted, fontSize: 8, fontWeight: '500' },
  miniFields: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  miniInput: { flex: 1, height: 24, backgroundColor: C.bg, borderRadius: 4, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 10, paddingHorizontal: 6, overflow: 'hidden' },
  miniSep: { color: C.muted, fontSize: 10 },

  // Connector
  connector: { alignItems: 'center', height: 10 },
  connectorLine: { width: 1.5, height: 10, backgroundColor: C.border },

  // Add branch
  addBranchRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  addBranchBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 6, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  addBranchTxt: { color: C.muted, fontSize: 9, fontWeight: '600' },
});
