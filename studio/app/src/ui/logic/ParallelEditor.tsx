/**
 * ParallelEditor — Dedicated panel for the "parallel" action node.
 *
 * Layout:
 *   ┌─ Lane 1 ──────────────────────────────┐
 *   │  [action] [action] [+ Add]            │
 *   └───────────────────────────────────────┘
 *   ┌─ Lane 2 ──────────────────────────────┐
 *   │  ...                                  │
 *   └───────────────────────────────────────┘
 *   [+ Add lane]
 *
 *   ┌─ Join / Barrier ──────────────────────┐
 *   │  Wait for: [all | any | first]        │
 *   │  Timeout: 5000ms                      │
 *   │  On complete → [actions...]           │
 *   │  On timeout  → [actions...]           │
 *   └───────────────────────────────────────┘
 *
 * The "join" config is stored in payload.join:
 *   { mode: 'all'|'any'|'first', timeoutMs?: number,
 *     onComplete?: ActionDef[], onTimeout?: ActionDef[] }
 */
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ActionDef } from '../../store/StudioProvider';
import ActionEditor from './ActionEditor';
import { C, ACTION_META } from './constants';
import type { ItemField } from './useLogicContext';

const LANE_COLORS = ['#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b', '#ec4899'];

// ─── Join mode badge ──────────────────────────────────────────────────────────
const JOIN_MODES = [
  { id: 'all',   label: 'All',   hint: 'Wait for every lane to finish',   icon: 'check-square' as const },
  { id: 'any',   label: 'Any',   hint: 'Continue when the first lane finishes', icon: 'zap' as const },
  { id: 'first', label: 'First', hint: 'Use result of the fastest lane',  icon: 'fast-forward' as const },
] as const;
type JoinMode = typeof JOIN_MODES[number]['id'];

interface JoinConfig {
  mode: JoinMode;
  timeoutMs?: number;
  onComplete?: ActionDef[];
  onTimeout?: ActionDef[];
}

// ─── Inline mini action row (for join callbacks) ──────────────────────────────
const MiniActionRow: React.FC<{
  action: ActionDef;
  onChange: (a: ActionDef) => void;
  onRemove: () => void;
  itemFields?: ItemField[];
}> = ({ action, onChange, onRemove, itemFields }) => {
  const [expanded, setExpanded] = useState(false);
  const meta = ACTION_META[action.type as keyof typeof ACTION_META] || ACTION_META.custom;
  return (
    <View style={s.miniRow}>
      <Pressable style={[s.miniHeader, { borderLeftColor: meta.color }]} onPress={() => setExpanded(e => !e)}>
        <View style={[s.miniIcon, { backgroundColor: meta.color + '22' }]}>
          <Feather name={meta.icon} size={9} color={meta.color} />
        </View>
        <Text style={[s.miniLabel, { color: meta.color }]}>{meta.label}</Text>
        <Pressable onPress={onRemove} hitSlop={6}><Feather name="x" size={9} color={C.muted} /></Pressable>
        <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={9} color={C.muted} />
      </Pressable>
      {expanded && (
        <View style={s.miniBody}>
          <ActionEditor action={action} onChange={onChange} onRemove={onRemove} itemFields={itemFields} />
        </View>
      )}
    </View>
  );
};

// ─── Join / Barrier block ─────────────────────────────────────────────────────
const JoinBlock: React.FC<{
  join: JoinConfig;
  onChange: (j: JoinConfig) => void;
  itemFields?: ItemField[];
}> = ({ join, onChange, itemFields }) => {
  const [open, setOpen] = useState(true);
  const upd = (patch: Partial<JoinConfig>) => onChange({ ...join, ...patch });

  const addComplete = () => upd({ onComplete: [...(join.onComplete || []), { type: 'setState', payload: { key: '', value: '' } }] });
  const addTimeout  = () => upd({ onTimeout:  [...(join.onTimeout  || []), { type: 'setState', payload: { key: '', value: '' } }] });

  return (
    <View style={s.joinWrap}>
      {/* Barrier visual connector */}
      <View style={s.barrierLine}>
        <View style={s.barrierDash} />
        <View style={s.barrierBadge}>
          <Feather name="align-justify" size={9} color="#8b5cf6" />
          <Text style={s.barrierBadgeTxt}>JOIN</Text>
        </View>
        <View style={s.barrierDash} />
      </View>

      <Pressable style={s.joinHeader} onPress={() => setOpen(o => !o)}>
        <View style={s.joinIconBox}>
          <Feather name="align-justify" size={11} color="#8b5cf6" />
        </View>
        <Text style={s.joinTitle}>Join / Barrier</Text>
        <Text style={s.joinMode}>{join.mode.toUpperCase()}</Text>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={10} color={C.muted} />
      </Pressable>

      {open && (
        <View style={s.joinBody}>
          {/* Mode selector */}
          <Text style={s.joinLabel}>Wait for</Text>
          <View style={s.joinModes}>
            {JOIN_MODES.map(m => {
              const on = join.mode === m.id;
              return (
                <Pressable key={m.id} style={[s.joinModeBtn, on && s.joinModeBtnOn]} onPress={() => upd({ mode: m.id })}>
                  <Feather name={m.icon} size={9} color={on ? '#fff' : C.muted} />
                  <Text style={[s.joinModeTxt, on && { color: '#fff' }]}>{m.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={s.joinHint}>{JOIN_MODES.find(m => m.id === join.mode)?.hint}</Text>

          {/* Timeout */}
          <View style={s.joinRow}>
            <Text style={s.joinLabel}>Timeout (ms)</Text>
            <TextInput
              style={s.joinInput}
              value={join.timeoutMs !== undefined ? String(join.timeoutMs) : ''}
              onChangeText={v => upd({ timeoutMs: v === '' ? undefined : Number(v) || undefined })}
              keyboardType="numeric"
              placeholder="none"
              placeholderTextColor={C.muted}
            />
          </View>

          {/* On complete */}
          <View style={s.joinSection}>
            <View style={s.joinSectionHead}>
              <Feather name="check-circle" size={9} color="#22c55e" />
              <Text style={[s.joinSectionTitle, { color: '#22c55e' }]}>On complete</Text>
              <Text style={s.joinSectionHint}>Runs after all lanes finish</Text>
            </View>
            {(join.onComplete || []).map((a, i) => (
              <MiniActionRow
                key={i}
                action={a}
                onChange={u => { const n = [...(join.onComplete || [])]; n[i] = u; upd({ onComplete: n }); }}
                onRemove={() => upd({ onComplete: (join.onComplete || []).filter((_, idx) => idx !== i) })}
                itemFields={itemFields}
              />
            ))}
            <Pressable style={s.joinAddBtn} onPress={addComplete}>
              <Feather name="plus" size={9} color="#22c55e" />
              <Text style={[s.joinAddTxt, { color: '#22c55e' }]}>Add action</Text>
            </Pressable>
          </View>

          {/* On timeout — only shown if timeout is set */}
          {join.timeoutMs !== undefined && (
            <View style={s.joinSection}>
              <View style={s.joinSectionHead}>
                <Feather name="clock" size={9} color="#f59e0b" />
                <Text style={[s.joinSectionTitle, { color: '#f59e0b' }]}>On timeout</Text>
                <Text style={s.joinSectionHint}>Runs if timeout is exceeded</Text>
              </View>
              {(join.onTimeout || []).map((a, i) => (
                <MiniActionRow
                  key={i}
                  action={a}
                  onChange={u => { const n = [...(join.onTimeout || [])]; n[i] = u; upd({ onTimeout: n }); }}
                  onRemove={() => upd({ onTimeout: (join.onTimeout || []).filter((_, idx) => idx !== i) })}
                  itemFields={itemFields}
                />
              ))}
              <Pressable style={s.joinAddBtn} onPress={addTimeout}>
                <Feather name="plus" size={9} color="#f59e0b" />
                <Text style={[s.joinAddTxt, { color: '#f59e0b' }]}>Add action</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

// ─── Lane ─────────────────────────────────────────────────────────────────────
const Lane: React.FC<{
  lane: ActionDef[];
  index: number;
  name: string;
  color: string;
  canRemove: boolean;
  onChangeName: (n: string) => void;
  onUpdate: (actions: ActionDef[]) => void;
  onRemove: () => void;
  itemFields?: ItemField[];
}> = ({ lane, index, name, color, canRemove, onChangeName, onUpdate, onRemove, itemFields }) => {
  const [editingName, setEditingName] = useState(false);

  const addAction = () => onUpdate([...lane, { type: 'setState', payload: { key: '', value: '' } }]);
  const updateAction = (ai: number, a: ActionDef) => { const n = [...lane]; n[ai] = a; onUpdate(n); };
  const removeAction = (ai: number) => onUpdate(lane.filter((_, i) => i !== ai));

  return (
    <View style={[s.lane, { borderTopColor: color }]}>
      {/* Lane header */}
      <View style={s.laneHeader}>
        <View style={[s.laneDot, { backgroundColor: color }]} />
        {editingName ? (
          <TextInput
            style={[s.laneNameInput, { borderBottomColor: color }]}
            value={name}
            onChangeText={onChangeName}
            onBlur={() => setEditingName(false)}
            autoFocus
            placeholder={`Lane ${index + 1}`}
            placeholderTextColor={C.muted}
          />
        ) : (
          <Pressable onPress={() => setEditingName(true)} style={{ flex: 1 }}>
            <Text style={[s.laneName, { color }]}>{name || `Lane ${index + 1}`}</Text>
          </Pressable>
        )}
        {canRemove && (
          <Pressable onPress={onRemove} hitSlop={8} style={s.laneRemove}>
            <Feather name="trash-2" size={9} color={C.muted} />
          </Pressable>
        )}
      </View>

      {/* Actions */}
      {lane.length === 0 && (
        <Text style={s.laneEmpty}>No actions — this lane does nothing</Text>
      )}
      {lane.map((a, ai) => (
        <ActionEditor
          key={ai}
          action={a}
          onChange={u => updateAction(ai, u)}
          onRemove={() => removeAction(ai)}
          itemFields={itemFields}
        />
      ))}

      {/* Add action */}
      <Pressable style={[s.laneAddBtn, { borderColor: color + '50' }]} onPress={addAction}>
        <Feather name="plus" size={9} color={color} />
        <Text style={[s.laneAddTxt, { color }]}>Add action</Text>
      </Pressable>
    </View>
  );
};

// ─── ParallelEditor (main export) ────────────────────────────────────────────
export interface ParallelPayload {
  lanes: ActionDef[][];
  laneNames?: string[];
  join?: JoinConfig;
}

interface Props {
  payload: ParallelPayload;
  onChange: (p: ParallelPayload) => void;
  itemFields?: ItemField[];
}

const ParallelEditor: React.FC<Props> = ({ payload, onChange, itemFields }) => {
  const lanes: ActionDef[][] = payload.lanes?.length ? payload.lanes : [[], []];
  const laneNames: string[] = payload.laneNames || lanes.map((_, i) => `Lane ${i + 1}`);
  const join: JoinConfig = payload.join || { mode: 'all' };

  const upd = (patch: Partial<ParallelPayload>) => onChange({ ...payload, ...patch });

  const updateLane = (li: number, actions: ActionDef[]) => {
    const next = [...lanes]; next[li] = actions; upd({ lanes: next });
  };
  const updateLaneName = (li: number, name: string) => {
    const next = [...laneNames]; next[li] = name; upd({ laneNames: next });
  };
  const addLane = () => {
    upd({ lanes: [...lanes, []], laneNames: [...laneNames, `Lane ${lanes.length + 1}`] });
  };
  const removeLane = (li: number) => {
    upd({
      lanes: lanes.filter((_, i) => i !== li),
      laneNames: laneNames.filter((_, i) => i !== li),
    });
  };

  return (
    <View style={s.root}>
      {/* Header hint */}
      <View style={s.hint}>
        <Feather name="columns" size={10} color="#8b5cf6" />
        <Text style={s.hintTxt}>All lanes fire simultaneously</Text>
      </View>

      {/* Lanes */}
      {lanes.map((lane, li) => (
        <Lane
          key={li}
          lane={lane}
          index={li}
          name={laneNames[li] || `Lane ${li + 1}`}
          color={LANE_COLORS[li % LANE_COLORS.length]}
          canRemove={lanes.length > 1}
          onChangeName={n => updateLaneName(li, n)}
          onUpdate={actions => updateLane(li, actions)}
          onRemove={() => removeLane(li)}
          itemFields={itemFields}
        />
      ))}

      {/* Add lane */}
      <Pressable style={s.addLaneBtn} onPress={addLane}>
        <Feather name="plus" size={10} color={C.muted} />
        <Text style={s.addLaneTxt}>Add lane</Text>
      </Pressable>

      {/* Join / Barrier */}
      <JoinBlock join={join} onChange={j => upd({ join: j })} itemFields={itemFields} />
    </View>
  );
};

export default ParallelEditor;

const s = StyleSheet.create({
  root: { gap: 6 },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  hintTxt: { color: '#8b5cf6', fontSize: 9, fontStyle: 'italic' },
  // Lane
  lane: { backgroundColor: C.bg, borderRadius: 8, borderWidth: 1, borderColor: C.border, borderTopWidth: 2, padding: 8, gap: 5 },
  laneHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  laneDot: { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  laneName: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3, flex: 1 },
  laneNameInput: { flex: 1, fontSize: 10, fontWeight: '700', color: C.text, borderBottomWidth: 1, paddingBottom: 1 },
  laneRemove: { padding: 2 },
  laneEmpty: { color: C.muted, fontSize: 9, fontStyle: 'italic', paddingVertical: 4 },
  laneAddBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 6, borderRadius: 5, borderWidth: 1, borderStyle: 'dashed' as any },
  laneAddTxt: { fontSize: 9, fontWeight: '600' },
  // Add lane
  addLaneBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 8, borderRadius: 7, borderWidth: 1, borderStyle: 'dashed' as any, borderColor: C.border },
  addLaneTxt: { color: C.muted, fontSize: 10, fontWeight: '500' },
  // Join / Barrier
  joinWrap: { gap: 0, marginTop: 4 },
  barrierLine: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  barrierDash: { flex: 1, height: 1, borderTopWidth: 1, borderStyle: 'dashed' as any, borderTopColor: '#8b5cf6' + '50' },
  barrierBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, backgroundColor: '#8b5cf6' + '18', borderWidth: 1, borderColor: '#8b5cf6' + '40' },
  barrierBadgeTxt: { color: '#8b5cf6', fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  joinHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: C.s2, borderRadius: 8, borderWidth: 1, borderColor: '#8b5cf6' + '40' },
  joinIconBox: { width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#8b5cf6' + '20' },
  joinTitle: { flex: 1, color: C.text, fontSize: 11, fontWeight: '600' },
  joinMode: { color: '#8b5cf6', fontSize: 9, fontWeight: '700', letterSpacing: 0.8 },
  joinBody: { backgroundColor: C.bg, borderRadius: 8, borderWidth: 1, borderColor: '#8b5cf6' + '30', padding: 10, gap: 8, marginTop: 2 },
  joinLabel: { color: C.muted, fontSize: 10, fontWeight: '500' },
  joinHint: { color: C.muted, fontSize: 9, fontStyle: 'italic', marginTop: -4 },
  joinModes: { flexDirection: 'row', gap: 5 },
  joinModeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 6, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  joinModeBtnOn: { backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' },
  joinModeTxt: { color: C.muted, fontSize: 9, fontWeight: '600' },
  joinRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  joinInput: { flex: 1, height: 26, backgroundColor: C.s2, borderRadius: 5, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 10, paddingHorizontal: 7 },
  joinSection: { gap: 4 },
  joinSectionHead: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  joinSectionTitle: { fontSize: 10, fontWeight: '600' },
  joinSectionHint: { color: C.muted, fontSize: 9, flex: 1 },
  joinAddBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4 },
  joinAddTxt: { fontSize: 9, fontWeight: '600' },
  // Mini action row (join callbacks)
  miniRow: { backgroundColor: C.s2, borderRadius: 6, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  miniHeader: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 7, paddingVertical: 5, borderLeftWidth: 2 },
  miniIcon: { width: 16, height: 16, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  miniLabel: { flex: 1, fontSize: 9, fontWeight: '600' },
  miniBody: { padding: 6, borderTopWidth: 1, borderTopColor: C.border },
});
