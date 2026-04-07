/**
 * TransformEditor — Visual data transformation pipeline node.
 * Supports all operations on array, string, number, object, boolean, date.
 * Result is stored in a state variable.
 */
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import SmartInput from '../shared/SmartInput';
import { C, TRANSFORM_OPS, CONDITION_OPS } from './constants';
import type { TransformDataType } from './constants';
import type { ItemField } from './useLogicContext';

interface TransformStep {
  op: string;
  arg?: string;
  arg2?: string;
  field?: string;
}

interface TransformPayload {
  source: string;
  dataType: TransformDataType;
  steps: TransformStep[];
  storeAs: string;
}

interface Props {
  payload: TransformPayload;
  onChange: (p: TransformPayload) => void;
  itemFields?: ItemField[];
}

const DATA_TYPES: { type: TransformDataType; icon: React.ComponentProps<typeof Feather>['name']; color: string }[] = [
  { type: 'array',   icon: 'list',       color: '#06b6d4' },
  { type: 'string',  icon: 'type',       color: '#22c55e' },
  { type: 'number',  icon: 'hash',       color: '#3b82f6' },
  { type: 'object',  icon: 'box',        color: '#8b5cf6' },
  { type: 'boolean', icon: 'toggle-left',color: '#f59e0b' },
  { type: 'date',    icon: 'calendar',   color: '#ec4899' },
];

// ─── Single step editor ───────────────────────────────────────────────────────
const StepEditor: React.FC<{
  step: TransformStep;
  dataType: TransformDataType;
  onChange: (s: TransformStep) => void;
  onRemove: () => void;
  index: number;
  itemFields?: ItemField[];
}> = ({ step, dataType, onChange, onRemove, index, itemFields }) => {
  const ops = TRANSFORM_OPS[dataType] as readonly { op: string; label: string; hint: string }[];
  const opMeta = ops.find(o => o.op === step.op);
  const needsArg = !['uppercase','lowercase','capitalize','trim','reverse','flatten','unique','count','first','last','keys','values','entries','toArray','stringify','clone','not','abs','floor','ceil','now','toTimestamp'].includes(step.op);
  const needsArg2 = ['clamp','replace','diff','slice','padStart','padEnd'].includes(step.op);
  const needsField = ['sort','sum','min','max','avg','groupBy','pluck','get','set','delete','hasKey','updateAt'].includes(step.op);

  return (
    <View style={s.step}>
      <View style={s.stepHeader}>
        <View style={s.stepNum}><Text style={s.stepNumTxt}>{index + 1}</Text></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.opScroll}>
          {ops.map(o => (
            <Pressable key={o.op} style={[s.opBtn, step.op === o.op && s.opBtnOn]}
              onPress={() => onChange({ ...step, op: o.op })}>
              <Text style={[s.opBtnTxt, step.op === o.op && s.opBtnTxtOn]}>{o.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <Pressable onPress={onRemove} hitSlop={8} style={s.stepRemove}>
          <Feather name="x" size={10} color={C.muted} />
        </Pressable>
      </View>
      {opMeta && <Text style={s.stepHint}>{opMeta.hint}</Text>}
      <View style={s.stepArgs}>
        {needsField && (
          <View style={s.argRow}>
            <Text style={s.argLabel}>Field</Text>
            <TextInput style={s.argInput} value={step.field || ''} onChangeText={v => onChange({ ...step, field: v })}
              placeholder="fieldName" placeholderTextColor={C.muted} />
          </View>
        )}
        {needsArg && (
          <View style={s.argRow}>
            <Text style={s.argLabel}>{step.op === 'filter' || step.op === 'find' || step.op === 'findIndex' ? 'Condition' : step.op === 'map' ? 'Expression' : step.op === 'template' ? 'Template' : step.op === 'regex' || step.op === 'match' ? 'Pattern' : 'Value'}</Text>
            <SmartInput label="" value={step.arg || ''} onChange={v => onChange({ ...step, arg: v })}
              propType="string" isExpression itemFields={itemFields}
              placeholder={step.op === 'filter' ? 'item.active == true' : step.op === 'map' ? 'item.name' : step.op === 'template' ? 'Hello {name}' : '$state.x'} />
          </View>
        )}
        {needsArg2 && (
          <View style={s.argRow}>
            <Text style={s.argLabel}>{step.op === 'clamp' ? 'Max' : step.op === 'replace' ? 'With' : step.op === 'diff' ? 'End date' : 'End'}</Text>
            <SmartInput label="" value={step.arg2 || ''} onChange={v => onChange({ ...step, arg2: v })}
              propType="string" isExpression itemFields={itemFields} placeholder="value" />
          </View>
        )}
      </View>
    </View>
  );
};

// ─── TransformEditor ─────────────────────────────────────────────────────────
const TransformEditor: React.FC<Props> = ({ payload, onChange, itemFields }) => {
  const p: TransformPayload = {
    source: payload.source || '',
    dataType: payload.dataType || 'array',
    steps: payload.steps || [],
    storeAs: payload.storeAs || '',
  };

  const upd = (partial: Partial<TransformPayload>) => onChange({ ...p, ...partial });
  const addStep = () => {
    const ops = TRANSFORM_OPS[p.dataType] as readonly { op: string }[];
    upd({ steps: [...p.steps, { op: ops[0]?.op || 'filter' }] });
  };
  const updateStep = (i: number, s: TransformStep) => {
    const next = [...p.steps]; next[i] = s; upd({ steps: next });
  };
  const removeStep = (i: number) => upd({ steps: p.steps.filter((_, j) => j !== i) });

  const dtMeta = DATA_TYPES.find(d => d.type === p.dataType);

  return (
    <View style={s.root}>
      {/* Source */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>INPUT</Text>
        <SmartInput label="" value={p.source} onChange={v => upd({ source: v })}
          propType="string" isExpression itemFields={itemFields} placeholder="$state.users, $state.text, $state.count..." />
      </View>

      {/* Data type */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>TYPE</Text>
        <View style={s.typeRow}>
          {DATA_TYPES.map(d => (
            <Pressable key={d.type} style={[s.typeBtn, p.dataType === d.type && { backgroundColor: d.color + '25', borderColor: d.color }]}
              onPress={() => upd({ dataType: d.type, steps: [] })}>
              <Feather name={d.icon} size={11} color={p.dataType === d.type ? d.color : C.muted} />
              <Text style={[s.typeBtnTxt, p.dataType === d.type && { color: d.color }]}>{d.type}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Pipeline steps */}
      <View style={s.section}>
        <View style={s.pipelineHeader}>
          <Text style={s.sectionLabel}>OPERATIONS</Text>
          <Pressable style={s.addStepBtn} onPress={addStep}>
            <Feather name="plus" size={10} color={dtMeta?.color || C.primary} />
            <Text style={[s.addStepTxt, { color: dtMeta?.color || C.primary }]}>Add step</Text>
          </Pressable>
        </View>
        {p.steps.length === 0 && (
          <Text style={s.emptyHint}>No operations yet — add a step to transform the data</Text>
        )}
        {p.steps.map((step, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <View style={s.stepConnector}>
                <View style={[s.stepConnectorLine, { backgroundColor: dtMeta?.color || C.border }]} />
                <Feather name="arrow-down" size={8} color={dtMeta?.color || C.muted} />
              </View>
            )}
            <StepEditor step={step} dataType={p.dataType} index={i}
              onChange={s => updateStep(i, s)} onRemove={() => removeStep(i)} itemFields={itemFields} />
          </React.Fragment>
        ))}
      </View>

      {/* Output */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>STORE RESULT IN</Text>
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

export default TransformEditor;

const s = StyleSheet.create({
  root: { gap: 10 },
  section: { gap: 5 },
  sectionLabel: { color: C.muted, fontSize: 8, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' as any },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  typeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 6, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  typeBtnTxt: { color: C.muted, fontSize: 9, fontWeight: '600' },
  pipelineHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addStepBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  addStepTxt: { fontSize: 9, fontWeight: '600' },
  emptyHint: { color: C.muted, fontSize: 9, fontStyle: 'italic', textAlign: 'center', paddingVertical: 8 },
  stepConnector: { alignItems: 'center', gap: 1, paddingVertical: 2 },
  stepConnectorLine: { width: 1.5, height: 6 },
  step: { backgroundColor: C.bg, borderRadius: 8, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: C.border },
  stepNum: { width: 18, height: 18, borderRadius: 9, backgroundColor: C.s2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepNumTxt: { color: C.muted, fontSize: 8, fontWeight: '700' },
  opScroll: { gap: 3 },
  opBtn: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 4, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  opBtnOn: { backgroundColor: C.primary, borderColor: C.primary },
  opBtnTxt: { color: C.muted, fontSize: 9, fontWeight: '500' },
  opBtnTxtOn: { color: '#fff' },
  stepRemove: { padding: 2 },
  stepHint: { color: C.muted, fontSize: 8, fontStyle: 'italic', paddingHorizontal: 8, paddingTop: 4 },
  stepArgs: { padding: 8, gap: 6 },
  argRow: { gap: 3 },
  argLabel: { color: C.muted, fontSize: 8, fontWeight: '600', textTransform: 'uppercase' as any, letterSpacing: 0.5 },
  argInput: { height: 28, backgroundColor: C.s2, borderRadius: 5, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 11, paddingHorizontal: 8 },
  outputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg, borderRadius: 6, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  outputPrefix: { color: C.muted, fontSize: 11, paddingHorizontal: 8, paddingVertical: 6 },
  outputInput: { flex: 1, color: C.text, fontSize: 11, fontWeight: '600', paddingVertical: 6, paddingRight: 8 },
  outputHint: { color: '#22c55e', fontSize: 8, fontFamily: 'monospace' as any },
});
