/**
 * ActionEditor — Configuration UI for a single action.
 * callApi: full body key-value editor with SmartInput linkage + onSuccess/onError.
 */
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStudio, ActionDef } from '../../store/StudioProvider';
import SmartInput from '../shared/SmartInput';
import Tooltip from '../shared/Tooltip';
import { C, METHOD_COLORS, ACTION_META, ACTION_TYPES, ACTION_GROUPS } from './constants';
import { LOGIC_TEXTS } from './logicTexts';
import TransformEditor from './TransformEditor';
import ComputeEditor from './ComputeEditor';
import ParallelEditor from './ParallelEditor';
import type { ActionType } from './constants';
import type { ItemField } from './useLogicContext';

interface Props {
  action: ActionDef;
  onChange: (updated: ActionDef) => void;
  onRemove: () => void;
  itemFields?: ItemField[];
}

const ActionEditor: React.FC<Props> = ({ action, onChange, onRemove, itemFields }) => {
  const { project } = useStudio();
  const queries: any[] = project?.queries || [];
  const pages: any[] = project?.pages || [];
  const [typeOpen, setTypeOpen] = useState(false);

  const upd = (payload: Record<string, any>) =>
    onChange({ ...action, payload: { ...action.payload, ...payload } });

  const meta = ACTION_META[action.type as ActionType] || ACTION_META.custom;

  return (
    <View style={s.card}>
      {/* Header: icon + type label + change button + remove */}
      <View style={s.head}>
        <View style={[s.iconBox, { backgroundColor: meta.color + '22' }]}>
          <Feather name={meta.icon} size={11} color={meta.color} />
        </View>
        <Text style={[s.typeLabel, { color: meta.color }]}>{meta.label}</Text>
        <Pressable style={s.changeBtn} onPress={() => setTypeOpen(o => !o)}>
          <Text style={s.changeBtnText}>change</Text>
          <Feather name={typeOpen ? 'chevron-up' : 'chevron-down'} size={9} color={C.muted} />
        </Pressable>
        <Pressable onPress={onRemove} hitSlop={8} style={s.removeBtn}>
          <Feather name="trash-2" size={10} color={C.muted} />
        </Pressable>
      </View>

      {/* Type picker modal */}
      {typeOpen && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setTypeOpen(false)}>
          <Pressable style={s.modalOverlay} onPress={() => setTypeOpen(false)}>
            <View style={s.typeModal}>
              <Text style={s.typeModalTitle}>Change action type</Text>
              {ACTION_GROUPS.map(group => {
                const groupActions = (ACTION_TYPES as readonly string[]).filter(t => (ACTION_META as any)[t]?.group === group.id);
                if (!groupActions.length) return null;
                return (
                  <View key={group.id} style={s.typeGroup}>
                    <Text style={[s.typeGroupLabel, { color: group.color }]}>{group.label}</Text>
                    <View style={s.typeGroupBtns}>
                      {groupActions.map(t => {
                        const m = (ACTION_META as any)[t] as { icon: React.ComponentProps<typeof Feather>['name']; color: string; label: string };
                        const on = action.type === t;
                        return (
                          <Pressable key={t}
                            style={[s.typeBtn, on && { backgroundColor: m.color, borderColor: m.color }]}
                            onPress={() => { onChange({ type: t as any, payload: {} }); setTypeOpen(false); }}>
                            <Feather name={m.icon} size={10} color={on ? '#fff' : C.muted} />
                            <Text style={[s.typeBtnTxt, on && { color: '#fff' }]}>{m.label}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Fields */}
      <View style={s.fields}>
        <ActionFields action={action} upd={upd} queries={queries} pages={pages} itemFields={itemFields} />
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Per-action field renderers
// ---------------------------------------------------------------------------
// Transform / Compute inline wrappers
// ---------------------------------------------------------------------------

const TransformFields: React.FC<{ action: ActionDef; upd: (p: Record<string, any>) => void; itemFields?: ItemField[] }> = ({ action, upd, itemFields }) => (
  <TransformEditor
    payload={action.payload as any}
    onChange={p => upd(p as any)}
    itemFields={itemFields}
  />
);

const ComputeFields: React.FC<{ action: ActionDef; upd: (p: Record<string, any>) => void; itemFields?: ItemField[] }> = ({ action, upd, itemFields }) => (
  <ComputeEditor
    payload={action.payload as any}
    onChange={p => upd(p as any)}
    itemFields={itemFields}
  />
);

// ---------------------------------------------------------------------------
// Parallel — delegated to ParallelEditor
// ---------------------------------------------------------------------------

const ParallelFields: React.FC<{ action: ActionDef; upd: (p: Record<string, any>) => void; itemFields?: ItemField[] }> = ({ action, upd, itemFields }) => (
  <ParallelEditor
    payload={action.payload as any}
    onChange={p => upd(p as any)}
    itemFields={itemFields}
  />
);

// ---------------------------------------------------------------------------

const ActionFields: React.FC<{
  action: ActionDef;
  upd: (p: Record<string, any>) => void;
  queries: any[];
  pages: any[];
  itemFields?: ItemField[];
}> = ({ action, upd, queries, pages, itemFields }) => {
  const a = action;

  switch (a.type as string) {
    case 'navigate':
      return (
        <View style={s.group}>
          <Text style={s.label}>Screen</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
            {pages.map((p: any) => {
              const slug = p.route || p.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
              const on = a.payload.screen === slug;
              return (
                <Pressable key={p.id} style={[s.chip, on && s.chipOn]} onPress={() => upd({ screen: slug })}>
                  <Text style={[s.chipTxt, on && s.chipTxtOn]}>{p.name}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <SmartInput label="Custom path" value={a.payload.screen || ''} onChange={v => upd({ screen: v })} propType="string" itemFields={itemFields} />
          <View style={s.chips}>
            {(['push', 'replace', 'back', 'reset'] as const).map(m => (
              <Pressable key={m} style={[s.chip, (a.payload.mode || 'push') === m && s.chipOn]} onPress={() => upd({ mode: m })}>
                <Text style={[s.chipTxt, (a.payload.mode || 'push') === m && s.chipTxtOn]}>{m}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      );

    case 'setState':
      return (
        <View style={s.group}>
          <SmartInput label="State key" value={String(a.payload.key || '')} onChange={v => upd({ key: v })} propType="string" isExpression placeholder="myVar" />
          {/* Type picker */}
          <View style={s.stateTypeRow}>
            <Text style={s.label}>Type</Text>
            <View style={s.chips}>
              {(['string','number','boolean','object','array'] as const).map(t => {
                const on = (a.payload.valueType || 'string') === t;
                const typeColors: Record<string, string> = { string: '#22c55e', number: '#3b82f6', boolean: '#f59e0b', object: '#8b5cf6', array: '#06b6d4' };
                return (
                  <Pressable key={t} style={[s.chip, on && { backgroundColor: typeColors[t], borderColor: typeColors[t] }]}
                    onPress={() => {
                      const defaults: Record<string, any> = { string: '', number: 0, boolean: false, object: {}, array: [] };
                      upd({ valueType: t, value: a.payload.value ?? defaults[t] });
                    }}>
                    <Text style={[s.chipTxt, on && s.chipTxtOn]}>{t}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          {/* Value input — adapts to type */}
          {(a.payload.valueType || 'string') === 'boolean' ? (
            <View style={s.chips}>
              {(['true','false'] as const).map(v => {
                const on = String(a.payload.value) === v;
                return (
                  <Pressable key={v} style={[s.chip, on && { backgroundColor: '#f59e0b', borderColor: '#f59e0b' }]}
                    onPress={() => upd({ value: v === 'true' })}>
                    <Text style={[s.chipTxt, on && s.chipTxtOn]}>{v}</Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <SmartInput label="Value" value={a.payload.value ?? ''} onChange={v => upd({ value: v })} propType="string" isExpression itemFields={itemFields} placeholder="$state.x, literal, $response..." />
          )}
        </View>
      );

    case 'setGlobalState':
      return (
        <View style={s.group}>
          <SmartInput label="Global key" value={String(a.payload.key || '')} onChange={v => upd({ key: v })} propType="string" placeholder="myGlobalVar" />
          <SmartInput label="Value" value={a.payload.value ?? ''} onChange={v => upd({ value: v })} propType="string" isExpression itemFields={itemFields} placeholder="$state.x or literal" />
        </View>
      );

    case 'resetState':
      return (
        <View style={s.group}>
          <SmartInput label="State key" value={String(a.payload.key || '')} onChange={v => upd({ key: v })} propType="string" placeholder="myVar" />
          <SmartInput label="Default value" value={a.payload.defaultValue ?? ''} onChange={v => upd({ defaultValue: v })} propType="string" placeholder="null, 0, false..." />
        </View>
      );

    case 'delay':
      return (
        <View style={s.group}>
          <View style={s.row}>
            <Text style={s.label}>Wait (ms)</Text>
            <TextInput style={[s.bodyKey, { flex: 1 }]} value={String(a.payload.ms || 500)} onChangeText={v => upd({ ms: Number(v) || 500 })} keyboardType="numeric" placeholderTextColor={C.muted} />
          </View>
          <Text style={s.hint}>Then execute the next action in the pipeline</Text>
        </View>
      );

    case 'conditional':
      return (
        <View style={s.group}>
          <SmartInput label="Condition" value={String(a.payload.condition || '')} onChange={v => upd({ condition: v })} propType="string" isExpression itemFields={itemFields} placeholder="$state.isLoggedIn" />
          <View style={s.sub}>
            <Text style={s.subTitle}>If true → setState</Text>
            <TextInput style={s.bodyKey} value={String((a.payload.then as any)?.[0]?.payload?.key || '')}
              onChangeText={v => upd({ then: [{ type: 'setState', payload: { key: v, value: (a.payload.then as any)?.[0]?.payload?.value || '' } }] })}
              placeholder="state key" placeholderTextColor={C.muted} />
            <TextInput style={s.bodyKey} value={String((a.payload.then as any)?.[0]?.payload?.value || '')}
              onChangeText={v => upd({ then: [{ type: 'setState', payload: { key: (a.payload.then as any)?.[0]?.payload?.key || '', value: v } }] })}
              placeholder="value" placeholderTextColor={C.muted} />
          </View>
          <View style={s.sub}>
            <Text style={s.subTitle}>If false → setState</Text>
            <TextInput style={s.bodyKey} value={String((a.payload.else as any)?.[0]?.payload?.key || '')}
              onChangeText={v => upd({ else: [{ type: 'setState', payload: { key: v, value: (a.payload.else as any)?.[0]?.payload?.value || '' } }] })}
              placeholder="state key" placeholderTextColor={C.muted} />
            <TextInput style={s.bodyKey} value={String((a.payload.else as any)?.[0]?.payload?.value || '')}
              onChangeText={v => upd({ else: [{ type: 'setState', payload: { key: (a.payload.else as any)?.[0]?.payload?.key || '', value: v } }] })}
              placeholder="value" placeholderTextColor={C.muted} />
          </View>
        </View>
      );

    case 'callApi':
      return <CallApiFields action={a} upd={upd} queries={queries} itemFields={itemFields} />;

    case 'transform':
      return <TransformFields action={a} upd={upd} itemFields={itemFields} />;

    case 'compute':
      return <ComputeFields action={a} upd={upd} itemFields={itemFields} />;

    case 'mergeState':
      return (
        <View style={s.group}>
          <SmartInput label="State key" value={String(a.payload.key || '')} onChange={v => upd({ key: v })} propType="string" placeholder="myObject" />
          <SmartInput label="Merge with" value={a.payload.value ?? ''} onChange={v => upd({ value: v })} propType="string" isExpression itemFields={itemFields} placeholder="$state.patch or {field: value}" />
          <Text style={s.hint}>Shallow-merges the value into the existing object</Text>
        </View>
      );

    case 'toggleState':
      return (
        <View style={s.group}>
          <SmartInput label="State key" value={String(a.payload.key || '')} onChange={v => upd({ key: v })} propType="string" placeholder="isOpen" />
          <Text style={s.hint}>Flips boolean: true → false, false → true</Text>
        </View>
      );

    case 'incrementState':
      return (
        <View style={s.group}>
          <SmartInput label="State key" value={String(a.payload.key || '')} onChange={v => upd({ key: v })} propType="string" placeholder="counter" />
          <View style={s.row}>
            <Text style={s.label}>By</Text>
            <TextInput style={[s.bodyKey, { flex: 1, overflow: 'hidden' }]} value={String(a.payload.by ?? 1)} onChangeText={v => upd({ by: Number(v) || 1 })} keyboardType="numeric" placeholderTextColor={C.muted} placeholder="1" />
          </View>
          <View style={s.row}>
            <Text style={s.label}>Min</Text>
            <TextInput style={[s.bodyKey, { flex: 1, overflow: 'hidden' }]} value={String(a.payload.min ?? '')} onChangeText={v => upd({ min: v === '' ? undefined : Number(v) })} keyboardType="numeric" placeholderTextColor={C.muted} placeholder="none" />
          </View>
          <View style={s.row}>
            <Text style={s.label}>Max</Text>
            <TextInput style={[s.bodyKey, { flex: 1, overflow: 'hidden' }]} value={String(a.payload.max ?? '')} onChangeText={v => upd({ max: v === '' ? undefined : Number(v) })} keyboardType="numeric" placeholderTextColor={C.muted} placeholder="none" />
          </View>
        </View>
      );

    case 'loop':
      return (
        <View style={s.group}>
          <SmartInput label="Array source" value={String(a.payload.source || '')} onChange={v => upd({ source: v })} propType="string" isExpression itemFields={itemFields} placeholder="$state.items" />
          <SmartInput label="Item variable" value={String(a.payload.itemVar || 'item')} onChange={v => upd({ itemVar: v })} propType="string" placeholder="item" />
          <Text style={s.hint}>Each iteration: $loop.item, $loop.index, $loop.total</Text>
          <View style={s.sub}>
            <Text style={s.subTitle}>Body action (setState per item)</Text>
            <TextInput style={s.bodyKey} value={String((a.payload.body as any)?.[0]?.payload?.key || '')}
              onChangeText={v => upd({ body: [{ type: 'setState', payload: { key: v, value: (a.payload.body as any)?.[0]?.payload?.value || '' } }] })}
              placeholder="state key" placeholderTextColor={C.muted} />
          </View>
        </View>
      );

    case 'parallel':
      return <ParallelFields action={a} upd={upd} itemFields={itemFields} />;

    case 'callCustomFn':
      return <CallCustomFnFields action={a} upd={upd} itemFields={itemFields} />;

    case 'openModal':
    case 'closeModal':
      return <SmartInput label="Modal name" value={a.payload.name || ''} onChange={v => upd({ name: v })} propType="string" />;

    case 'alert':
      return (
        <View style={s.group}>
          <SmartInput label="Title" value={a.payload.title || ''} onChange={v => upd({ title: v })} propType="string" isExpression itemFields={itemFields} />
          <SmartInput label="Message" value={a.payload.message || ''} onChange={v => upd({ message: v })} propType="string" isExpression itemFields={itemFields} />
        </View>
      );

    case 'toast':
      return (
        <View style={s.group}>
          <SmartInput label="Message" value={a.payload.message || ''} onChange={v => upd({ message: v })} propType="string" itemFields={itemFields} />
          <View style={s.chips}>
            {(['success', 'error', 'info', 'warning'] as const).map(t => (
              <Pressable key={t} style={[s.chip, (a.payload.variant || 'info') === t && s.chipOn]} onPress={() => upd({ variant: t })}>
                <Text style={[s.chipTxt, (a.payload.variant || 'info') === t && s.chipTxtOn]}>{t}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      );

    case 'consoleLog':
      return <SmartInput label="Message" value={a.payload.message || ''} onChange={v => upd({ message: v })} propType="string" itemFields={itemFields} />;

    case 'haptics':
      return (
        <View style={s.chips}>
          {(['Light', 'Medium', 'Heavy', 'Success', 'Warning', 'Error'] as const).map(style => (
            <Pressable key={style} style={[s.chip, (a.payload.style || 'Medium') === style && s.chipOn]} onPress={() => upd({ style })}>
              <Text style={[s.chipTxt, (a.payload.style || 'Medium') === style && s.chipTxtOn]}>{style}</Text>
            </Pressable>
          ))}
        </View>
      );

    case 'share':
      return (
        <View style={s.group}>
          <SmartInput label="Message" value={a.payload.message || ''} onChange={v => upd({ message: v })} propType="string" itemFields={itemFields} />
          <SmartInput label="URL (optional)" value={String(a.payload.url || '')} onChange={v => upd({ url: v })} propType="string" />
        </View>
      );

    case 'sendSMS':
      return (
        <View style={s.group}>
          <SmartInput label="Phone" value={a.payload.number || ''} onChange={v => upd({ number: v })} propType="string" itemFields={itemFields} />
          <SmartInput label="Message" value={a.payload.message || ''} onChange={v => upd({ message: v })} propType="string" itemFields={itemFields} />
        </View>
      );

    case 'clipboard':
      return <SmartInput label="Text" value={a.payload.text || ''} onChange={v => upd({ text: v })} propType="string" itemFields={itemFields} />;

    case 'openURL':
      return <SmartInput label="URL" value={a.payload.url || ''} onChange={v => upd({ url: v })} propType="string" itemFields={itemFields} />;

    case 'playSound':
      return <SmartInput label="Sound URI" value={String(a.payload.uri || '')} onChange={v => upd({ uri: v })} propType="string" />;

    case 'biometrics':
      return <Text style={s.hint}>Triggers biometric authentication prompt</Text>;

    case 'getLocation':
      return (
        <View style={s.group}>
          <Text style={s.hint}>Fetches current GPS position</Text>
          <SmartInput label="Store in state" value={String(a.payload.storeAs || '')} onChange={v => upd({ storeAs: v })} propType="string" placeholder="location" />
        </View>
      );

    case 'custom':
      return (
        <TextInput
          style={s.codeInput}
          value={String(a.payload.code || '')}
          onChangeText={v => upd({ code: v })}
          multiline
          numberOfLines={4}
          placeholder="// custom JS code"
          placeholderTextColor={C.muted}
        />
      );

    default:
      return null;
  }
};

// ---------------------------------------------------------------------------
// CallApi — full body editor + onSuccess/onError
// ---------------------------------------------------------------------------

const CallApiFields: React.FC<{
  action: ActionDef;
  upd: (p: Record<string, any>) => void;
  queries: any[];
  itemFields?: ItemField[];
}> = ({ action, upd, queries, itemFields }) => {
  const a = action;
  const selQ = queries.find((q: any) => q.id === a.payload.queryName || q.name === a.payload.queryName);
  const body = (a.payload.body as Record<string, string>) || {};
  const onSuccess: any[] = (a.payload.onSuccess as any[]) || [];
  const onError: any[] = (a.payload.onError as any[]) || [];

  const updBody = (next: Record<string, string>) => upd({ body: next });
  const updSuccess = (next: any[]) => upd({ onSuccess: next });
  const updError = (next: any[]) => upd({ onError: next });

  const needsBody = selQ && selQ.method !== 'GET' && selQ.method !== 'DELETE';

  return (
    <View style={s.group}>
      {/* Query selector */}
      <Text style={s.label}>Query</Text>
      {queries.length === 0 && <Text style={s.hint}>No queries — add one in Data Queries (toolbar)</Text>}
      {queries.map((q: any) => {
        const on = a.payload.queryName === q.id || a.payload.queryName === q.name;
        return (
          <Pressable key={q.id} style={[s.qRow, on && s.qRowOn]} onPress={() => upd({ queryName: q.id })}>
            <View style={[s.mDot, { backgroundColor: METHOD_COLORS[q.method] || C.primary }]} />
            <View style={{ flex: 1 }}>
              <Text style={[s.qName, on && { color: C.primary }]}>{q.name}</Text>
              <Text style={s.qPath}>{q.method} {q.path}{q.alias ? ` → $state.${q.alias}` : ''}</Text>
            </View>
            {on && <Feather name="check" size={9} color={C.primary} />}
          </Pressable>
        );
      })}

      {/* Body key-value editor */}
      {needsBody && (
        <View style={s.sub}>
          <Text style={s.subTitle}>Request Body</Text>
          <Text style={s.hint}>Link field values to state vars or component props</Text>
          {Object.entries(body).map(([k, v], i) => (
            <BodyRow
              key={i}
              fieldKey={k}
              fieldValue={v}
              itemFields={itemFields}
              onChangeKey={newKey => {
                const next: Record<string, string> = {};
                for (const [ek, ev] of Object.entries(body)) {
                  next[ek === k ? newKey : ek] = ev;
                }
                updBody(next);
              }}
              onChangeValue={newVal => updBody({ ...body, [k]: newVal })}
              onRemove={() => { const next = { ...body }; delete next[k]; updBody(next); }}
            />
          ))}
          <Pressable style={s.addRow} onPress={() => updBody({ ...body, '': '' })}>
            <Feather name="plus" size={10} color={C.primary} />
            <Text style={s.addRowTxt}>Add field</Text>
          </Pressable>
          {/* Quick-fill from query definition */}
          {selQ?.body && Object.keys(selQ.body).length > 0 && (
            <Pressable style={s.fillBtn} onPress={() => updBody({ ...selQ.body, ...body })}>
              <Feather name="copy" size={9} color={C.cyan} />
              <Text style={s.fillBtnTxt}>Fill from query definition</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Store response */}
      <View style={s.sub}>
        <Text style={s.subTitle}>Store Response As</Text>
        <SmartInput
          label=""
          value={String(a.payload.storeResponseAs || '')}
          onChange={v => upd({ storeResponseAs: v || undefined })}
          propType="string"
          placeholder="user → $state.user"
        />
      </View>

      {/* onSuccess */}
      <View style={s.sub}>
        <Text style={s.subTitle}>On Success</Text>
        <Text style={s.hint}>$response · $response.field</Text>
        {onSuccess.map((sa: any, i: number) => (
          <ResponseRow
            key={i}
            action={sa}
            onChange={u => { const n = [...onSuccess]; n[i] = u; updSuccess(n); }}
            onRemove={() => { const n = [...onSuccess]; n.splice(i, 1); updSuccess(n); }}
          />
        ))}
        <View style={s.chips}>
          <Pressable style={s.addChip} onPress={() => updSuccess([...onSuccess, { type: 'setState', payload: { key: '', value: '$response' } }])}>
            <Text style={s.addChipTxt}>+ setState</Text>
          </Pressable>
          <Pressable style={s.addChip} onPress={() => updSuccess([...onSuccess, { type: 'navigate', payload: { screen: '' } }])}>
            <Text style={s.addChipTxt}>+ navigate</Text>
          </Pressable>
          <Pressable style={s.addChip} onPress={() => updSuccess([...onSuccess, { type: 'toast', payload: { message: 'Success', variant: 'success' } }])}>
            <Text style={s.addChipTxt}>+ toast</Text>
          </Pressable>
        </View>
      </View>

      {/* onError */}
      <View style={s.sub}>
        <Text style={s.subTitle}>On Error</Text>
        <Text style={s.hint}>$error.message</Text>
        {onError.map((ea: any, i: number) => (
          <ResponseRow
            key={i}
            action={ea}
            onChange={u => { const n = [...onError]; n[i] = u; updError(n); }}
            onRemove={() => { const n = [...onError]; n.splice(i, 1); updError(n); }}
          />
        ))}
        <View style={s.chips}>
          <Pressable style={s.addChip} onPress={() => updError([...onError, { type: 'setState', payload: { key: 'error', value: '$error.message' } }])}>
            <Text style={s.addChipTxt}>+ setState error</Text>
          </Pressable>
          <Pressable style={s.addChip} onPress={() => updError([...onError, { type: 'alert', payload: { title: 'Error', message: '$error.message' } }])}>
            <Text style={s.addChipTxt}>+ alert</Text>
          </Pressable>
          <Pressable style={s.addChip} onPress={() => updError([...onError, { type: 'toast', payload: { message: '$error.message', variant: 'error' } }])}>
            <Text style={s.addChipTxt}>+ toast</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

// Body row: key input + SmartInput value + remove
const BodyRow: React.FC<{
  fieldKey: string;
  fieldValue: string;
  itemFields?: ItemField[];
  onChangeKey: (k: string) => void;
  onChangeValue: (v: string) => void;
  onRemove: () => void;
}> = ({ fieldKey, fieldValue, itemFields, onChangeKey, onChangeValue, onRemove }) => (
  <View style={s.bodyRow}>
    <TextInput
      style={s.bodyKey}
      value={fieldKey}
      onChangeText={onChangeKey}
      placeholder="field"
      placeholderTextColor={C.muted}
    />
    <Text style={s.bodySep}>:</Text>
    <View style={{ flex: 1 }}>
      <SmartInput
        label=""
        value={fieldValue}
        onChange={onChangeValue}
        propType="string"
        isExpression
        itemFields={itemFields}
        placeholder="$state.email"
      />
    </View>
    <Pressable onPress={onRemove} hitSlop={6}>
      <Feather name="x" size={10} color={C.muted} />
    </Pressable>
  </View>
);

// Inline onSuccess/onError action row
const ResponseRow: React.FC<{
  action: any;
  onChange: (a: any) => void;
  onRemove: () => void;
}> = ({ action, onChange, onRemove }) => {
  const upd = (payload: Record<string, any>) => onChange({ ...action, payload: { ...action.payload, ...payload } });
  const meta = ACTION_META[action.type as ActionType] || ACTION_META.custom;
  return (
    <View style={s.resRow}>
      <View style={[s.resIcon, { backgroundColor: meta.color + '22' }]}>
        <Feather name={meta.icon} size={9} color={meta.color} />
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        {action.type === 'setState' && (
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <TextInput style={[s.bodyKey, { flex: 1 }]} value={action.payload?.key || ''} onChangeText={v => upd({ key: v })} placeholder="state key" placeholderTextColor={C.muted} />
            <TextInput style={[s.bodyKey, { flex: 2 }]} value={String(action.payload?.value || '')} onChangeText={v => upd({ value: v })} placeholder="$response or $response.field" placeholderTextColor={C.muted} />
          </View>
        )}
        {action.type === 'navigate' && (
          <TextInput style={s.bodyKey} value={String(action.payload?.screen || '')} onChangeText={v => upd({ screen: v })} placeholder="screen name" placeholderTextColor={C.muted} />
        )}
        {action.type === 'toast' && (
          <TextInput style={s.bodyKey} value={String(action.payload?.message || '')} onChangeText={v => upd({ message: v })} placeholder="message" placeholderTextColor={C.muted} />
        )}
        {action.type === 'alert' && (
          <TextInput style={s.bodyKey} value={String(action.payload?.message || '')} onChangeText={v => upd({ message: v })} placeholder="$error.message" placeholderTextColor={C.muted} />
        )}
        {!['setState', 'navigate', 'toast', 'alert'].includes(action.type) && (
          <Text style={s.hint}>{meta.label}</Text>
        )}
      </View>
      <Pressable onPress={onRemove} hitSlop={6}><Feather name="x" size={9} color={C.muted} /></Pressable>
    </View>
  );
};

// ---------------------------------------------------------------------------
// CallCustomFn — call a user-defined custom function
// ---------------------------------------------------------------------------
const CallCustomFnFields: React.FC<{
  action: ActionDef;
  upd: (p: Record<string, any>) => void;
  itemFields?: ItemField[];
}> = ({ action, upd, itemFields }) => {
  const { project } = useStudio();
  const a = action;
  const customFns: any[] = (project as any)?.customFunctions || [];
  const selFn = customFns.find((f: any) => f.id === a.payload.fnId || f.name === a.payload.fnId);
  const paramValues = (a.payload.params as Record<string, string>) || {};

  return (
    <View style={s.group}>
      <Text style={s.label}>Custom Function</Text>
      {customFns.length === 0 && (
        <Text style={s.hint}>No custom functions yet — create one with the purple button in the toolbar.</Text>
      )}
      {customFns.map((fn: any) => {
        const on = a.payload.fnId === fn.id || a.payload.fnId === fn.name;
        return (
          <Pressable key={fn.id} style={[s.qRow, on && s.qRowOn]} onPress={() => upd({ fnId: fn.id })}>
            <Feather name="cpu" size={10} color={on ? '#a78bfa' : C.muted} />
            <View style={{ flex: 1 }}>
              <Text style={[s.qName, on && { color: '#a78bfa' }]}>{fn.name}</Text>
              <Text style={s.qPath}>{fn.description || fn.template}</Text>
            </View>
            {on && <Feather name="check" size={9} color="#a78bfa" />}
          </Pressable>
        );
      })}

      {/* Param bindings */}
      {selFn && selFn.params?.length > 0 && (
        <View style={s.sub}>
          <Text style={s.subTitle}>Parameters</Text>
          <Text style={s.hint}>Link each parameter to a state variable or node prop</Text>
          {selFn.params.map((p: any) => (
            <View key={p.name} style={{ marginBottom: 6 }}>
              <SmartInput
                label={`${p.name} (${p.type})`}
                value={paramValues[p.name] || p.stateBinding || ''}
                onChange={v => upd({ params: { ...paramValues, [p.name]: v } })}
                propType="string"
                isExpression
                itemFields={itemFields}
                placeholder={p.stateBinding || `$state.${p.name}`}
              />
            </View>
          ))}
        </View>
      )}

      {/* Store result */}
      {selFn && (
        <View style={s.sub}>
          <Text style={s.subTitle}>Store result in</Text>
          <SmartInput
            label=""
            value={String(a.payload.storeResultAs || selFn.returnStateKey || '')}
            onChange={v => upd({ storeResultAs: v || undefined })}
            propType="string"
            placeholder={selFn.returnStateKey || 'result'}
          />
          <Text style={s.hint}>Result stored in $state.{String(a.payload.storeResultAs || selFn.returnStateKey || 'result')}</Text>
        </View>
      )}
    </View>
  );
};

export default ActionEditor;

const C_primary = C.primary;

const s = StyleSheet.create({
  card: { backgroundColor: C.s2, borderRadius: 8, borderWidth: 1, borderColor: C.border, marginBottom: 6, overflow: 'hidden' },
  head: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: C.border },
  iconBox: { width: 22, height: 22, borderRadius: 5, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  typeLabel: { flex: 1, fontSize: 11, fontWeight: '600' },
  changeBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  changeBtnText: { color: C.muted, fontSize: 9 },
  removeBtn: { padding: 3 },
  // Type picker modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  typeModal: { width: '100%', maxWidth: 340, backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 14, gap: 10 },
  typeModalTitle: { color: C.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' as any, marginBottom: 2 },
  typeGroup: { gap: 5 },
  typeGroupLabel: { fontSize: 8, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' as any },
  typeGroupBtns: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  typeBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 7, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  typeBtnTxt: { color: C.muted, fontSize: 10, fontWeight: '500' },
  fields: { padding: 8 },
  group: { gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { color: C.muted, fontSize: 10, fontWeight: '500' },
  stateTypeRow: { gap: 3 },
  hint: { color: C.muted, fontSize: 9, fontStyle: 'italic' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  chip: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 4, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  chipOn: { backgroundColor: C_primary, borderColor: C_primary },
  chipTxt: { color: C.muted, fontSize: 9, fontWeight: '500' },
  chipTxtOn: { color: '#fff' },
  codeInput: { backgroundColor: C.bg, borderRadius: 6, borderWidth: 1, borderColor: C.border, color: '#22c55e', fontSize: 10, fontFamily: 'monospace' as any, padding: 8, minHeight: 70, textAlignVertical: 'top' },
  // Query selector
  qRow: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 8, paddingVertical: 7, borderRadius: 6, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, marginBottom: 3 },
  qRowOn: { borderColor: C_primary, backgroundColor: 'rgba(59,130,246,0.06)' },
  qName: { color: C.text, fontSize: 10, fontWeight: '500' },
  qPath: { color: C.muted, fontSize: 8 },
  mDot: { width: 7, height: 7, borderRadius: 4, flexShrink: 0 },
  // Sub-sections
  sub: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 6, borderWidth: 1, borderColor: C.border, padding: 7, gap: 4 },
  subTitle: { color: C.text, fontSize: 10, fontWeight: '600' },
  // Body row
  bodyRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  bodyKey: { height: 24, flex: 1, backgroundColor: C.bg, borderRadius: 4, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 10, paddingHorizontal: 6 },
  bodySep: { color: C.muted, fontSize: 10 },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 3 },
  addRowTxt: { color: C_primary, fontSize: 10, fontWeight: '500' },
  fillBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 3 },
  fillBtnTxt: { color: '#22d3ee', fontSize: 9 },
  addChip: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 4, backgroundColor: 'rgba(59,130,246,0.1)', borderWidth: 1, borderColor: 'rgba(59,130,246,0.3)' },
  addChipTxt: { color: C_primary, fontSize: 9, fontWeight: '500' },
  // Response rows
  resRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 5, paddingVertical: 3, borderBottomWidth: 1, borderBottomColor: C.border },
  resIcon: { width: 18, height: 18, borderRadius: 4, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  // Parallel
  parallelWrap: { gap: 6 },
  parallelHint: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  parallelHintTxt: { color: '#8b5cf6', fontSize: 9, fontStyle: 'italic' },
  parallelLanes: { flexDirection: 'row', gap: 6, paddingBottom: 4 },
  parallelLane: { width: 130, backgroundColor: C.bg, borderRadius: 8, borderWidth: 1, borderColor: C.border, borderTopWidth: 2, padding: 6, gap: 4 },
  parallelLaneHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  parallelLaneLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  parallelAction: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.s2, borderRadius: 5, borderLeftWidth: 2, paddingHorizontal: 6, paddingVertical: 4 },
  parallelActionIcon: { width: 16, height: 16, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  parallelActionLabel: { flex: 1, fontSize: 9, fontWeight: '600' },
  parallelAddBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingVertical: 5, borderRadius: 5, borderWidth: 1, borderStyle: 'dashed' as any, justifyContent: 'center' },
  parallelAddTxt: { fontSize: 9, fontWeight: '600' },
  parallelAddLane: { width: 44, alignItems: 'center', justifyContent: 'center', gap: 3, backgroundColor: C.s2, borderRadius: 8, borderWidth: 1, borderColor: C.border, borderStyle: 'dashed' as any },
  parallelAddLaneTxt: { color: C.muted, fontSize: 8, fontWeight: '600' },
});
