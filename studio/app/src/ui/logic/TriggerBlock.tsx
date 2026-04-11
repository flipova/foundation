/**
 * TriggerBlock — Pipeline/connector view with trigger dropdown.
 * Event node (with inline event switcher) → connector → action nodes.
 */
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ActionDef } from '../../store/StudioProvider';
import ActionEditor from './ActionEditor';
import { C, EVENT_META, EVENT_NAMES, ACTION_META } from './constants';
import type { EventName } from './constants';
import type { ItemField } from './useLogicContext';

interface Props {
  event: EventName;
  actions: ActionDef[];
  onChange: (actions: ActionDef[]) => void;
  onRemove: () => void;
  onChangeEvent: (ev: EventName) => void;
  itemFields?: ItemField[];
  availableEvents?: EventName[];
}

// ─── Connector ───────────────────────────────────────────────────────────────
const Connector: React.FC<{ color?: string; dashed?: boolean }> = ({ color = C.border, dashed }) => (
  <View style={s.connectorWrap}>
    <View style={[s.connectorLine, { backgroundColor: dashed ? 'transparent' : color, borderLeftWidth: dashed ? 1.5 : 0, borderLeftColor: color, borderStyle: dashed ? 'dashed' : 'solid' }]} />
    <View style={[s.connectorArrow, { borderTopColor: color }]} />
  </View>
);

// ─── Action node ─────────────────────────────────────────────────────────────
const ActionNode: React.FC<{
  action: ActionDef; index: number; color: string;
  onChange: (a: ActionDef) => void; onRemove: () => void; onMoveUp?: () => void; onMoveDown?: () => void;
  itemFields?: ItemField[];
}> = ({ action, index, color, onChange, onRemove, onMoveUp, onMoveDown, itemFields }) => {
  const [expanded, setExpanded] = useState(false);
  const meta = ACTION_META[action.type as keyof typeof ACTION_META] as { icon: React.ComponentProps<typeof Feather>['name']; color: string; label: string } | undefined;

  // Summary line shown when collapsed
  const summary: string | null = (() => {
    const p = action.payload as any;
    switch (action.type) {
      case 'setState':
        return p.key ? `${p.key} = ${String(p.value ?? '').slice(0, 20)}` : null;
      case 'transform':
        return p.storeAs ? `→ $state.${p.storeAs}` : null;
      case 'compute':
        return p.storeAs ? `→ $state.${p.storeAs}` : null;
      case 'conditional':
        return p.condition ? String(p.condition).slice(0, 24) : null;
      case 'navigate':
        return p.screen || null;
      case 'delay':
        return `${p.ms || 500}ms`;
      case 'callApi':
        return p.url || null;
      case 'toast':
        return p.message || null;
      default:
        return p.key || p.message || p.url || null;
    }
  })();

  return (
    <View style={s.actionNode}>
      <Pressable style={[s.nodeHeader, { borderLeftColor: color }]} onPress={() => setExpanded(e => !e)}>
        <View style={[s.nodeIconBadge, { backgroundColor: color + '20' }]}>
          <Feather name={(meta?.icon as React.ComponentProps<typeof Feather>['name']) || 'zap'} size={11} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.nodeTitle, { color }]}>{meta?.label || action.type || 'Unknown'}</Text>
          {!expanded && summary ? <Text style={s.nodeSubtitle} numberOfLines={1}>{summary}</Text> : null}
        </View>
        <View style={s.nodeActions}>
          {onMoveUp && <Pressable onPress={onMoveUp} hitSlop={6} style={s.nodeBtn}><Feather name="chevron-up" size={10} color={C.muted} /></Pressable>}
          {onMoveDown && <Pressable onPress={onMoveDown} hitSlop={6} style={s.nodeBtn}><Feather name="chevron-down" size={10} color={C.muted} /></Pressable>}
          <Text style={s.nodeIndex}>{index + 1}</Text>
          <Pressable onPress={onRemove} hitSlop={8} style={s.nodeBtn}><Feather name="x" size={10} color={C.muted} /></Pressable>
          <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={10} color={C.muted} />
        </View>
      </Pressable>
      {expanded && (
        <View style={s.nodeBody}>
          <ActionEditor action={action} onChange={onChange} onRemove={onRemove} itemFields={itemFields} />
        </View>
      )}
    </View>
  );
};

// ─── Event picker modal ───────────────────────────────────────────────────────
const EventPickerModal: React.FC<{
  current: EventName; available: EventName[];
  onSelect: (ev: EventName) => void; onClose: () => void;
}> = ({ current, available, onSelect, onClose }) => (
  <Modal visible transparent animationType="fade" onRequestClose={onClose}>
    <Pressable style={s.overlay} onPress={onClose}>
      <View style={s.eventPickerCard}>
        <Text style={s.eventPickerTitle}>Change trigger</Text>
        {available.map(ev => {
          const m = EVENT_META[ev];
          const on = ev === current;
          return (
            <Pressable key={ev} style={[s.eventPickerRow, on && { backgroundColor: m.color + '15', borderColor: m.color + '40' }]}
              onPress={() => { onSelect(ev); onClose(); }}>
              <View style={[s.eventPickerIcon, { backgroundColor: m.color + '20' }]}>
                <Feather name={m.icon} size={12} color={m.color} />
              </View>
              <Text style={[s.eventPickerLabel, { color: on ? m.color : C.text }]}>{m.label}</Text>
              {on && <Feather name="check" size={11} color={m.color} />}
            </Pressable>
          );
        })}
      </View>
    </Pressable>
  </Modal>
);

// ─── Add action menu ──────────────────────────────────────────────────────────
const ADD_QUICK = [
  { type: 'setState',   payload: { key: '', value: '' } },
  { type: 'transform',  payload: { source: '', dataType: 'array', op: 'filter', storeAs: '' } },
  { type: 'conditional',payload: { condition: '', then: [], else: [] } },
  { type: 'callApi',    payload: {} },
  { type: 'delay',      payload: { ms: 500 } },
  { type: 'navigate',   payload: { screen: '' } },
  { type: 'toast',      payload: { message: '', variant: 'info' } },
] as const;

// ─── TriggerBlock ─────────────────────────────────────────────────────────────
const TriggerBlock: React.FC<Props> = ({ event, actions, onChange, onRemove, onChangeEvent, itemFields, availableEvents }) => {
  const meta = EVENT_META[event];
  const [collapsed, setCollapsed] = useState(false);
  const [showEventPicker, setShowEventPicker] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const addAction = (type: string, payload: any) => {
    onChange([...actions, { type, payload } as ActionDef]);
    setShowAddMenu(false);
  };

  const updateAction = (i: number, updated: ActionDef) => {
    const next = [...actions]; next[i] = updated; onChange(next);
  };
  const removeAction = (i: number) => onChange(actions.filter((_, j) => j !== i));
  const moveAction = (i: number, dir: -1 | 1) => {
    const next = [...actions];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const eventsToShow = availableEvents ?? (EVENT_NAMES as unknown as EventName[]);

  return (
    <View style={s.pipeline}>
      {/* ── Trigger node ── */}
      <View style={s.triggerRow}>
        <View style={[s.triggerNode, { borderColor: meta.color + '60', backgroundColor: meta.color + '10' }]}>
          <View style={[s.triggerIconBadge, { backgroundColor: meta.color + '25' }]}>
            <Feather name={meta.icon} size={14} color={meta.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.triggerWhen}>WHEN</Text>
            {/* Tap event name to change trigger */}
            <Pressable style={s.triggerEventBtn} onPress={() => setShowEventPicker(true)}>
              <Text style={[s.triggerEvent, { color: meta.color }]}>{meta.label}</Text>
              <Feather name="chevron-down" size={10} color={meta.color + 'aa'} />
            </Pressable>
          </View>
          <Pressable onPress={() => setCollapsed(c => !c)} style={s.triggerBtn}>
            <Feather name={collapsed ? 'chevron-down' : 'chevron-up'} size={12} color={C.muted} />
          </Pressable>
          <Pressable onPress={onRemove} hitSlop={8} style={s.triggerBtn}>
            <Feather name="trash-2" size={11} color={C.muted} />
          </Pressable>
        </View>
      </View>

      {!collapsed && (
        <>
          {actions.map((a, i) => {
            const aMeta = ACTION_META[a.type as keyof typeof ACTION_META] as { color: string } | undefined;
            return (
              <React.Fragment key={i}>
                <Connector color={meta.color + '40'} />
                <ActionNode
                  action={a} index={i} color={aMeta?.color || C.muted}
                  onChange={u => updateAction(i, u)}
                  onRemove={() => removeAction(i)}
                  onMoveUp={i > 0 ? () => moveAction(i, -1) : undefined}
                  onMoveDown={i < actions.length - 1 ? () => moveAction(i, 1) : undefined}
                  itemFields={itemFields}
                />
              </React.Fragment>
            );
          })}

          {/* ── Add action ── */}
          <Connector color={C.border} dashed />
          {showAddMenu ? (
            <View style={s.addMenu}>
              <Text style={s.addMenuTitle}>Add action</Text>
              <View style={s.addMenuGrid}>
                {ADD_QUICK.map(q => {
                  const m = ACTION_META[q.type as keyof typeof ACTION_META] as { icon: React.ComponentProps<typeof Feather>['name']; color: string; label: string } | undefined;
                  return (
                    <Pressable key={q.type} style={[s.addMenuBtn, { borderColor: (m?.color || C.muted) + '40' }]}
                      onPress={() => addAction(q.type, { ...q.payload })}>
                      <View style={[s.addMenuIcon, { backgroundColor: (m?.color || C.muted) + '20' }]}>
                        <Feather name={(m?.icon as React.ComponentProps<typeof Feather>['name']) || 'zap'} size={12} color={m?.color || C.muted} />
                      </View>
                      <Text style={[s.addMenuLabel, { color: m?.color || C.muted }]}>{m?.label || q.type}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <Pressable style={s.addMenuMore} onPress={() => { addAction('setState', { key: '', value: '' }); }}>
                <Feather name="more-horizontal" size={11} color={C.muted} />
                <Text style={s.addMenuMoreTxt}>More actions…</Text>
              </Pressable>
              <Pressable style={s.addMenuCancel} onPress={() => setShowAddMenu(false)}>
                <Text style={s.addMenuCancelTxt}>Cancel</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={s.addNode} onPress={() => setShowAddMenu(true)}>
              <View style={s.addNodeIcon}><Feather name="plus" size={12} color={C.primary} /></View>
              <Text style={s.addNodeTxt}>Add action</Text>
            </Pressable>
          )}
        </>
      )}

      {/* Event picker modal */}
      {showEventPicker && (
        <EventPickerModal
          current={event}
          available={eventsToShow}
          onSelect={onChangeEvent}
          onClose={() => setShowEventPicker(false)}
        />
      )}
    </View>
  );
};

export default TriggerBlock;

const s = StyleSheet.create({
  pipeline: { marginBottom: 12 },

  // Trigger
  triggerRow: { paddingHorizontal: 2 },
  triggerNode: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8 },
  triggerIconBadge: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  triggerWhen: { color: C.muted, fontSize: 7, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' as any },
  triggerEventBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  triggerEvent: { fontSize: 12, fontWeight: '700' },
  triggerBtn: { padding: 4 },

  // Connector
  connectorWrap: { alignItems: 'center', height: 20, justifyContent: 'center' },
  connectorLine: { width: 1.5, height: 12 },
  connectorArrow: { width: 0, height: 0, borderLeftWidth: 4, borderRightWidth: 4, borderTopWidth: 5, borderLeftColor: 'transparent', borderRightColor: 'transparent' },

  // Action node
  actionNode: { marginHorizontal: 8, backgroundColor: C.s2, borderRadius: 8, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  nodeHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 10, paddingVertical: 8, borderLeftWidth: 3 },
  nodeIconBadge: { width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  nodeTitle: { fontSize: 11, fontWeight: '700' },
  nodeSubtitle: { color: C.muted, fontSize: 9, marginTop: 1 },
  nodeActions: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  nodeBtn: { padding: 3 },
  nodeIndex: { color: C.muted, fontSize: 9, fontWeight: '700', width: 14, textAlign: 'center' },
  nodeBody: { borderTopWidth: 1, borderTopColor: C.border, padding: 8 },

  // Add menu
  addNode: { marginHorizontal: 8, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderStyle: 'dashed' as any, borderColor: C.primary + '40', backgroundColor: C.primary + '06' },
  addNodeIcon: { width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: C.primary + '20' },
  addNodeTxt: { color: C.primary, fontSize: 11, fontWeight: '600' },
  addMenu: { marginHorizontal: 8, backgroundColor: C.s2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 10, gap: 8 },
  addMenuTitle: { color: C.muted, fontSize: 9, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' as any },
  addMenuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  addMenuBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 7, backgroundColor: C.bg, borderWidth: 1 },
  addMenuIcon: { width: 20, height: 20, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  addMenuLabel: { fontSize: 10, fontWeight: '600' },
  addMenuMore: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 4 },
  addMenuMoreTxt: { color: C.muted, fontSize: 9 },
  addMenuCancel: { alignSelf: 'center', paddingVertical: 4 },
  addMenuCancelTxt: { color: C.muted, fontSize: 10 },

  // Event picker modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  eventPickerCard: { width: '100%', maxWidth: 320, backgroundColor: C.surface, borderRadius: 12, borderWidth: 1, borderColor: C.border, padding: 12, gap: 4 },
  eventPickerTitle: { color: C.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' as any, marginBottom: 6 },
  eventPickerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: 'transparent' },
  eventPickerIcon: { width: 28, height: 28, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  eventPickerLabel: { flex: 1, fontSize: 12, fontWeight: '600' },
});
