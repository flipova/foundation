/**
 * SlotModeSection — Mode selector for array slots (kind: "items" and kind: "named-array").
 *
 * Three modes:
 *   STATIC   — children dropped manually, no data binding
 *   TEMPLATE — one dropped child repeated via source.map()
 *   DATA     — no dropped child; source.map() renders a template inline
 *
 * Used in LogicPanel for:
 *   - The primary items slot (kind: "items") — replaces ItemsDataSourceSection
 *   - Each named-array slot (kind: "named-array") — e.g. backContent, social, actions
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TreeNode } from '../../store/StudioProvider';
import SmartInput from '../shared/SmartInput';
import { C } from './constants';

export type SlotMode = 'static' | 'template' | 'data';

export interface SlotBinding {
  mode: SlotMode;
  source?: string;
  keyProp?: string;
  itemVar?: string;
}

interface Props {
  /** Display label for this slot (e.g. "Items", "Faces verso") */
  label: string;
  /** Prop name of the slot (e.g. "items", "backContent") */
  slotProp: string;
  /** Current binding for this slot */
  binding: SlotBinding;
  /** Number of children currently in this slot */
  childCount: number;
  /** Called when the binding changes */
  onChange: (binding: SlotBinding) => void;
}

const MODE_OPTIONS: { mode: SlotMode; icon: React.ComponentProps<typeof Feather>['name']; label: string; desc: string }[] = [
  {
    mode: 'static',
    icon: 'grid',
    label: 'Static',
    desc: 'Drop components manually',
  },
  {
    mode: 'template',
    icon: 'repeat',
    label: 'Template',
    desc: 'One child repeated from a list',
  },
  {
    mode: 'data',
    icon: 'database',
    label: 'Data',
    desc: 'List drives the slot directly',
  },
];

const SlotModeSection: React.FC<Props> = ({ label, slotProp, binding, childCount, onChange }) => {
  const { mode, source, keyProp } = binding;

  const setMode = (m: SlotMode) => {
    onChange({ ...binding, mode: m });
  };

  return (
    <View style={s.root}>
      {/* Slot label */}
      <View style={s.slotHeader}>
        <Feather name={mode === 'data' ? 'database' : mode === 'template' ? 'repeat' : 'layers'} size={10} color="#a78bfa" />
        <Text style={s.slotLabel}>{label}</Text>
        {mode !== 'static' && source && (
          <View style={s.activeBadge}>
            <Text style={s.activeBadgeText}>connected</Text>
          </View>
        )}
      </View>

      {/* Mode picker */}
      <View style={s.modePicker}>
        {MODE_OPTIONS.map(opt => {
          const active = mode === opt.mode;
          return (
            <Pressable
              key={opt.mode}
              style={[s.modeBtn, active && s.modeBtnActive]}
              onPress={() => setMode(opt.mode)}
            >
              <Feather name={opt.icon} size={11} color={active ? '#a78bfa' : C.muted} />
              <Text style={[s.modeBtnLabel, active && s.modeBtnLabelActive]}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Mode description */}
      <Text style={s.modeDesc}>
        {MODE_OPTIONS.find(o => o.mode === mode)?.desc}
      </Text>

      {/* STATIC — just show child count hint */}
      {mode === 'static' && (
        <View style={s.staticHint}>
          <Feather name="info" size={9} color={C.muted} />
          <Text style={s.staticHintText}>
            {childCount === 0
              ? `Drop components into the "${label}" slot from the canvas.`
              : `${childCount} component${childCount > 1 ? 's' : ''} in this slot.`}
          </Text>
        </View>
      )}

      {/* TEMPLATE — source + key, child must be dropped */}
      {mode === 'template' && (
        <View style={s.bindingForm}>
          <View style={s.templateNote}>
            <Feather name="info" size={9} color={C.cyan} />
            <Text style={s.templateNoteText}>
              Drop one component into the "{label}" slot — it will be repeated for each item in the list.
            </Text>
          </View>
          {childCount === 0 && (
            <View style={s.warningRow}>
              <Feather name="alert-triangle" size={9} color="#f59e0b" />
              <Text style={s.warningText}>No template child yet — drop one component into this slot.</Text>
            </View>
          )}
          <SmartInput
            label="Data source (list)"
            value={source || ''}
            onChange={v => onChange({ ...binding, mode: 'template', source: v || undefined })}
            propType="string"
            isExpression
            placeholder="$state.items"
          />
          {source && (
            <SmartInput
              label="Key field"
              value={keyProp || 'id'}
              onChange={v => onChange({ ...binding, keyProp: v || 'id' })}
              propType="string"
              placeholder="id"
            />
          )}
        </View>
      )}

      {/* DATA — source + key, no child needed */}
      {mode === 'data' && (
        <View style={s.bindingForm}>
          <View style={s.dataNote}>
            <Feather name="info" size={9} color="#a78bfa" />
            <Text style={s.dataNoteText}>
              The list drives this slot directly. Drop one component as the item template.
            </Text>
          </View>
          <SmartInput
            label="Data source (list)"
            value={source || ''}
            onChange={v => onChange({ ...binding, mode: 'data', source: v || undefined })}
            propType="string"
            isExpression
            placeholder="$state.items"
          />
          {source && (
            <SmartInput
              label="Key field"
              value={keyProp || 'id'}
              onChange={v => onChange({ ...binding, keyProp: v || 'id' })}
              propType="string"
              placeholder="id"
            />
          )}
          {source && (
            <Pressable
              style={s.removeBtn}
              onPress={() => onChange({ mode: 'static' })}
            >
              <Feather name="x" size={9} color={C.muted} />
              <Text style={s.removeBtnText}>Remove data source</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

export default SlotModeSection;

const s = StyleSheet.create({
  root: { gap: 8 },
  slotHeader: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  slotLabel: { color: '#a78bfa', fontSize: 10, fontWeight: '700', flex: 1 },
  activeBadge: { backgroundColor: 'rgba(167,139,250,0.15)', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
  activeBadgeText: { color: '#a78bfa', fontSize: 8, fontWeight: '600' },
  modePicker: { flexDirection: 'row', gap: 4 },
  modeBtn: {
    flex: 1, flexDirection: 'column', alignItems: 'center', gap: 3,
    paddingVertical: 7, paddingHorizontal: 4,
    borderRadius: 7, borderWidth: 1, borderColor: 'rgba(26,34,64,0.8)',
    backgroundColor: 'rgba(13,18,32,0.6)',
  },
  modeBtnActive: {
    borderColor: '#a78bfa',
    backgroundColor: 'rgba(167,139,250,0.08)',
  },
  modeBtnLabel: { color: '#6a7494', fontSize: 9, fontWeight: '600' },
  modeBtnLabelActive: { color: '#a78bfa' },
  modeDesc: { color: '#6a7494', fontSize: 9, fontStyle: 'italic' },
  staticHint: { flexDirection: 'row', alignItems: 'flex-start', gap: 5, padding: 6, backgroundColor: 'rgba(13,18,32,0.4)', borderRadius: 6 },
  staticHintText: { color: '#6a7494', fontSize: 9, flex: 1, lineHeight: 13 },
  bindingForm: { gap: 7 },
  templateNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 5, backgroundColor: 'rgba(34,211,238,0.05)', borderRadius: 6, padding: 7, borderWidth: 1, borderColor: 'rgba(34,211,238,0.15)' },
  templateNoteText: { color: '#22d3ee', fontSize: 9, flex: 1, lineHeight: 13 },
  dataNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 5, backgroundColor: 'rgba(167,139,250,0.05)', borderRadius: 6, padding: 7, borderWidth: 1, borderColor: 'rgba(167,139,250,0.15)' },
  dataNoteText: { color: '#a78bfa', fontSize: 9, flex: 1, lineHeight: 13 },
  warningRow: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(245,158,11,0.06)', borderRadius: 5, padding: 6 },
  warningText: { color: '#f59e0b', fontSize: 9, flex: 1, lineHeight: 13 },
  removeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  removeBtnText: { color: '#6a7494', fontSize: 9 },
});
