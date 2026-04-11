/**
 * LogicPanel — Unified logic editor for a selected element.
 *
 * Structure (single flow, beginner-friendly):
 *
 *  ┌─ WHAT HAPPENS (Triggers & Actions) ──────────────────────────────┐
 *  │  When [event] → do [actions...]                                   │
 *  └───────────────────────────────────────────────────────────────────┘
 *  ┌─ WHAT IT SHOWS (Bindings) ────────────────────────────────────────┐
 *  │  Connect each prop to a variable or data field                    │
 *  └───────────────────────────────────────────────────────────────────┘
 *  ┌─ WHEN IT SHOWS (Visibility) ──────────────────────────────────────┐
 *  │  Show or hide based on a condition                                │
 *  └───────────────────────────────────────────────────────────────────┘
 *  ┌─ LIST MODE (Repeat) ──────────────────────────────────────────────┐
 *  │  Repeat this element for each item in a list                      │
 *  └───────────────────────────────────────────────────────────────────┘
 *  ┌─ PAGE VARIABLES (State) ──────────────────────────────────────────┐
 *  │  Variables that store data on this page                           │
 *  └───────────────────────────────────────────────────────────────────┘
 *  ┌─ ANIMATION ───────────────────────────────────────────────────────┐
 *  └───────────────────────────────────────────────────────────────────┘
 */
import React, { useState, useRef, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStudio, ActionDef, TreeNode, RegItem } from '../../store/StudioProvider';
import SmartInput from '../shared/SmartInput';
import TriggerBlock from './TriggerBlock';
import ConditionalSection from './ConditionalSection';
import RepeatSection from './RepeatSection';
import SlotModeSection from './SlotModeSection';
import type { SlotBinding } from './SlotModeSection';
import StateSection from './StateSection';
import AnimationSection from './AnimationSection';
import { useLogicContext } from './useLogicContext';
import { C, EVENT_NAMES, EVENT_META, COMPONENT_ONLY_EVENTS, SCREEN_EVENTS, APP_EVENTS } from './constants';
import { getLayoutMeta } from '../../../../../foundation/layout/registry/layouts';
import { getBlockMeta } from '../../../../../foundation/layout/registry/blocks';
import { deriveSlotConfig } from '../../renderer/slotConfig';
import { LOGIC_TEXTS } from './logicTexts';
import { usePanelWidth } from '../shared/usePanelWidth';
import { LOGIC_RESPONSIVE } from '../logicResponsive';
import type { EventName } from './constants';

// Re-export for external consumers (tests, ActionEditor)
export { LOGIC_TEXTS } from './logicTexts';

// ---------------------------------------------------------------------------
// Collapsible section
// ---------------------------------------------------------------------------
const Section: React.FC<{
  title: string;
  subtitle?: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  color?: string;
  badge?: string | number;
  defaultOpen?: boolean;
  active?: boolean;
  /** External open state — if provided, overrides internal state */
  open?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
}> = ({ title, subtitle, icon, color = C.muted, badge, defaultOpen = true, active, open: externalOpen, onToggle, children }) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const toggle = onToggle ?? (() => setInternalOpen(o => !o));
  const activeColor = active ? color : C.muted;
  return (
    <View style={[s.section, active && { borderLeftWidth: 2, borderLeftColor: color }]}>
      <Pressable style={s.sHead} onPress={toggle}>
        <View style={[s.sIconBox, { backgroundColor: activeColor + '18' }]}>
          <Feather name={icon} size={11} color={activeColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.sTitle, { color: active ? C.text : C.muted }]}>{title}</Text>
          {subtitle && !open && <Text style={s.sSubtitle}>{subtitle}</Text>}
        </View>
        {badge !== undefined && Number(badge) > 0 && (
          <View style={[s.badge, { backgroundColor: color + '25' }]}>
            <Text style={[s.badgeText, { color }]}>{badge}</Text>
          </View>
        )}
        <Feather name={open ? 'chevron-down' : 'chevron-right'} size={11} color={C.muted} />
      </Pressable>
      {open && <View style={s.sBody}>{children}</View>}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Bindings — connect props to variables
// ---------------------------------------------------------------------------
const BindingsSection: React.FC<{
  sel: TreeNode;
  m: RegItem | undefined;
  itemFields: any[];
  inRepeat: boolean;
  singleColumn: boolean;
  onUpdateBindings: (id: string, b: Record<string, string>) => void;
}> = ({ sel, m, itemFields, inRepeat, singleColumn, onUpdateBindings }) => {
  const props = m?.props || [];
  if (props.length === 0) return (
    <Text style={s.hint}>This element has no configurable properties to connect.</Text>
  );

  return (
    <View style={{ gap: 8 }}>
      {inRepeat && itemFields.length > 0 && (
        <View style={s.contextNote}>
          <Feather name="repeat" size={10} color={C.cyan} />
          <Text style={s.contextNoteText}>
            Ce composant est dans une liste — vous pouvez connecter les props directement aux champs de l'élément ci-dessous.
          </Text>
        </View>
      )}
      {props.map((p: any) => {
        const bound = sel.bindings?.[p.name] || '';
        const isBound = !!bound;
        const isItemField = isBound && itemFields.some((f: any) => f.key === bound || bound.startsWith(f.key + '.'));
        return (
          <View key={p.name} style={singleColumn ? { width: '100%' } : undefined}>
            <View style={s.bindRow}>
              <Text
                style={[s.bindPropName, isBound && { color: isItemField ? C.cyan : C.accent }, s.bindPropNameTruncated]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {p.label || p.name}
              </Text>
              {isBound && (
                <Pressable onPress={() => onUpdateBindings(sel.id, { [p.name]: '' })} hitSlop={8} style={s.unbindBtn}>
                  <Feather name="x" size={9} color={C.muted} />
                  <Text style={s.unbindText}>unlink</Text>
                </Pressable>
              )}
            </View>
            <SmartInput
              label=""
              value={bound}
              onChange={v => onUpdateBindings(sel.id, { [p.name]: v })}
              propType={p.type || 'string'}
              options={p.options}
              itemFields={inRepeat && itemFields.length > 0 ? itemFields : undefined}
              isExpression
              placeholder={inRepeat && itemFields.length > 0 ? LOGIC_TEXTS.bindingPlaceholderInRepeat : LOGIC_TEXTS.bindingPlaceholderDefault}
            />
            {isBound && (
              <Text style={s.bindOverride}>
                Default value: <Text style={s.bindOverrideVal}>{String(sel.props[p.name] ?? '—')}</Text>
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Main LogicPanel
// ---------------------------------------------------------------------------
const LogicPanel: React.FC = () => {
  const {
    updateEvents, updateBindings, updateConditional,
    updateRepeat, updateSlotBinding, updateAnimation,
    addPageState, removePageState,
  } = useStudio();

  const { sel, pageState, queries, itemFields, repeatAncestor } = useLogicContext();
  const { meta } = useStudio();
  const m = sel ? meta(sel.kind, sel.registryId) : undefined;

  const { width } = usePanelWidth(280, LOGIC_RESPONSIVE.MIN_WIDTH, LOGIC_RESPONSIVE.MAX_WIDTH);
  const singleColumn = LOGIC_RESPONSIVE.shouldUseSingleColumn(width);

  const [showEventPicker, setShowEventPicker] = useState(false);

  // Persist section open/closed state across component selections (Requirement 16.6)
  const sectionState = useRef<Record<string, boolean>>({
    whatHappens: true,
    whatItShows: false,
    whenItShows: false,
    listMode: false,
    pageVariables: false,
    animation: false,
  });
  const [, forceUpdate] = useState(0);
  const toggleSection = useCallback((name: string) => {
    sectionState.current[name] = !sectionState.current[name];
    forceUpdate(n => n + 1);
  }, []);

  if (!sel) return (
    <View style={s.empty}>
      <Feather name="mouse-pointer" size={26} color={C.muted} />
      <Text style={s.emptyTitle}>Sélectionnez un composant</Text>
      <Text style={s.emptyHint}>{LOGIC_TEXTS.emptyState}</Text>
    </View>
  );

  const activeEvents = EVENT_NAMES.filter(ev => (sel.events?.[ev]?.length || 0) > 0);
  const totalActions = activeEvents.reduce((sum, ev) => sum + (sel.events?.[ev]?.length || 0), 0);
  const boundCount = Object.keys(sel.bindings || {}).length;
  const inRepeat = !!repeatAncestor;
  const hasRepeat = !!sel.repeatBinding;
  const hasCondition = !!sel.conditionalRender;
  const hasAnimation = !!sel.animation && sel.animation.preset !== 'none';

  // Detect items-mode layout (array slot) — shows dedicated data source section
  const isItemsMode = React.useMemo(() => {
    if (!sel) return false;
    const layoutMeta = getLayoutMeta(sel.registryId);
    const slotCfg = deriveSlotConfig(layoutMeta?.slots as any);
    return slotCfg.mode === 'items';
  }, [sel?.registryId]);

  // Compute full slot config for array slot UI
  const arraySlotConfig = React.useMemo(() => {
    if (!sel) return null;
    const layoutMeta = getLayoutMeta(sel.registryId) ?? getBlockMeta(sel.registryId);
    if (!layoutMeta) return null;
    const slotCfg = deriveSlotConfig(layoutMeta.slots as any);
    // Primary items slot
    const primarySlot = slotCfg.mode === 'items'
      ? { prop: slotCfg.itemsProp ?? 'items', label: layoutMeta.slots.find((s: any) => s.kind === 'items')?.label ?? 'Items', kind: 'items' as const }
      : null;
    // Named-array slots (from all registry slots with kind: "named-array")
    const namedArraySlots = (layoutMeta.slots as any[])
      .filter((s: any) => s.kind === 'named-array')
      .map((s: any) => ({ prop: s.name, label: s.label, kind: 'named-array' as const }));
    return { primarySlot, namedArraySlots, slotCfg };
  }, [sel?.registryId]);

  const hasArraySlots = !!(arraySlotConfig?.primarySlot || arraySlotConfig?.namedArraySlots.length);

  // Auto-open sections that have content (only if not explicitly toggled by user)
  // We track which sections have been manually toggled via a separate ref
  const manuallyToggled = useRef<Set<string>>(new Set());
  if (!manuallyToggled.current.has('whatItShows') && boundCount > 0) sectionState.current.whatItShows = true;
  if (!manuallyToggled.current.has('whenItShows') && hasCondition) sectionState.current.whenItShows = true;
  if (!manuallyToggled.current.has('listMode') && hasRepeat) sectionState.current.listMode = true;
  if (!manuallyToggled.current.has('animation') && hasAnimation) sectionState.current.animation = true;

  const toggleSectionTracked = useCallback((name: string) => {
    manuallyToggled.current.add(name);
    toggleSection(name);
  }, [toggleSection]);

  return (
    <View style={s.root}>
      {/* Context banner — shown when inside a list */}
      {inRepeat && (
        <View style={s.contextBanner}>
          <Feather name="repeat" size={10} color={C.cyan} />
          <Text style={s.contextBannerText}>
            {LOGIC_TEXTS.inRepeatBanner}
          </Text>
        </View>
      )}

      {/* ── WHAT HAPPENS ─────────────────────────────────────────────── */}
      <Section
        title="What happens"
        subtitle={totalActions > 0 ? `${totalActions} action${totalActions > 1 ? 's' : ''} configurée${totalActions > 1 ? 's' : ''}` : 'Aucune action'}
        icon="zap"
        color="#f59e0b"
        badge={totalActions}
        active={totalActions > 0}
        open={sectionState.current.whatHappens}
        onToggle={() => toggleSectionTracked('whatHappens')}
      >
        <Text style={s.sectionDesc}>
          {LOGIC_TEXTS.sections.whatHappens}
        </Text>

        {/* Event picker */}
        {showEventPicker ? (
          <View style={s.picker}>
            <Text style={s.pickerTitle}>When does it happen?</Text>
            <View style={s.pickerGrid}>
              {EVENT_NAMES.filter(ev => {
                // App-level events only on root node (depth 0 / no parent)
                if (APP_EVENTS.includes(ev as any)) return sel.kind === 'layout' && !sel.parentId;
                // Screen events only on layout nodes
                if (SCREEN_EVENTS.includes(ev as any)) return sel.kind === 'layout';
                // Component-only events not available on pure layout nodes
                if (COMPONENT_ONLY_EVENTS.includes(ev as any)) return sel.kind !== 'layout';
                return true;
              }).map(ev => {
                const meta = EVENT_META[ev];
                const hasIt = (sel.events?.[ev]?.length || 0) > 0;
                return (
                  <Pressable
                    key={ev}
                    style={[s.pickerBtn, hasIt && { borderColor: meta.color, backgroundColor: meta.color + '12' }]}
                    onPress={() => {
                      if (!hasIt) updateEvents(sel.id, ev, [{ type: 'setState', payload: { key: '', value: '' } }]);
                      setShowEventPicker(false);
                    }}
                  >
                    <Feather name={meta.icon} size={12} color={hasIt ? meta.color : C.muted} />
                    <Text style={[s.pickerBtnText, hasIt && { color: meta.color }]}>{meta.label}</Text>
                    {hasIt && <Feather name="check" size={8} color={meta.color} />}
                  </Pressable>
                );
              })}
            </View>
            <Pressable onPress={() => setShowEventPicker(false)} style={s.cancelBtn}>
              <Text style={s.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={s.addBtn} onPress={() => setShowEventPicker(true)}>
            <Feather name="plus" size={12} color="#f59e0b" />
            <Text style={s.addBtnText}>Add a trigger</Text>
          </Pressable>
        )}

        {activeEvents.map(ev => (
          <TriggerBlock
            key={ev}
            event={ev as EventName}
            actions={(sel.events?.[ev] || []) as ActionDef[]}
            onChange={actions => updateEvents(sel.id, ev, actions)}
            onRemove={() => updateEvents(sel.id, ev, [])}
            onChangeEvent={(newEv: EventName) => {
              // Move the flow to the new event, remove from old
              const currentActions = (sel.events?.[ev] || []) as ActionDef[];
              updateEvents(sel.id, ev, []);
              updateEvents(sel.id, newEv, currentActions);
            }}
            itemFields={itemFields}
            availableEvents={EVENT_NAMES.filter(e => {
              if (APP_EVENTS.includes(e as any)) return sel.kind === 'layout' && !sel.parentId;
              if (SCREEN_EVENTS.includes(e as any)) return sel.kind === 'layout';
              if (COMPONENT_ONLY_EVENTS.includes(e as any)) return sel.kind !== 'layout';
              return true;
            }) as EventName[]}
          />
        ))}

        {activeEvents.length === 0 && !showEventPicker && (
          <Text style={s.hint}>{LOGIC_TEXTS.noTriggers}</Text>
        )}
      </Section>

      {/* ── WHAT IT SHOWS ────────────────────────────────────────────── */}
      <Section
        title="What it shows"
        subtitle={boundCount > 0 ? `${boundCount} prop${boundCount > 1 ? 's' : ''} connectée${boundCount > 1 ? 's' : ''}` : 'Valeurs statiques'}
        icon="link"
        color={C.accent}
        badge={boundCount}
        active={boundCount > 0}
        open={sectionState.current.whatItShows}
        onToggle={() => toggleSectionTracked('whatItShows')}
      >
        <Text style={s.sectionDesc}>
          {LOGIC_TEXTS.sections.whatItShows}
        </Text>
        <BindingsSection
          sel={sel}
          m={m}
          itemFields={itemFields}
          inRepeat={inRepeat}
          singleColumn={singleColumn}
          onUpdateBindings={updateBindings}
        />
      </Section>

      {/* ── WHEN IT SHOWS ────────────────────────────────────────────── */}
      <Section
        title="When it shows"
        subtitle={hasCondition ? `${sel.conditionalRender!.mode === 'show' ? 'Visible' : 'Masqué'} quand la condition est remplie` : 'Toujours visible'}
        icon="eye"
        color={hasCondition ? C.success : C.muted}
        active={hasCondition}
        open={sectionState.current.whenItShows}
        onToggle={() => toggleSectionTracked('whenItShows')}
      >
        <Text style={s.sectionDesc}>
          {LOGIC_TEXTS.sections.whenItShows}
        </Text>
        <ConditionalSection
          value={sel.conditionalRender}
          onChange={v => updateConditional(sel.id, v)}
          itemFields={inRepeat && itemFields.length > 0 ? itemFields : undefined}
        />
      </Section>

      {/* ── ARRAY SLOTS (items + named-array) ───────────────────── */}
      {hasArraySlots ? (
        <Section
          title="Slot data sources"
          subtitle={
            arraySlotConfig!.primarySlot && sel.repeatBinding
              ? `${arraySlotConfig!.primarySlot.label}: ${sel.repeatBinding.source}`
              : arraySlotConfig!.namedArraySlots.some(s => sel.slotBindings?.[s.prop]?.source)
              ? 'Connected'
              : 'Static'
          }
          icon="layers"
          color="#a78bfa"
          active={!!(sel.repeatBinding || Object.keys(sel.slotBindings ?? {}).length > 0)}
          open={sectionState.current.listMode}
          onToggle={() => toggleSectionTracked('listMode')}
        >
          <Text style={s.sectionDesc}>
            Choose how each array slot is populated — static components, a repeated template, or a live data source.
          </Text>

          {/* Primary items slot */}
          {arraySlotConfig!.primarySlot && (() => {
            const slot = arraySlotConfig!.primarySlot!;
            const primaryChildren = sel.children.filter(c => !c.slotName || c.slotName === slot.prop);
            // Derive current binding from repeatBinding (legacy) or slotBindings
            const slotBinding = sel.slotBindings?.[slot.prop];
            const currentBinding: SlotBinding = slotBinding ?? (
              sel.repeatBinding
                ? { mode: 'data', source: sel.repeatBinding.source, keyProp: sel.repeatBinding.keyProp }
                : primaryChildren.length === 1 && primaryChildren[0].repeatBinding
                ? { mode: 'template', source: primaryChildren[0].repeatBinding.source, keyProp: primaryChildren[0].repeatBinding.keyProp }
                : { mode: 'static' }
            );
            return (
              <SlotModeSection
                key={slot.prop}
                label={slot.label}
                slotProp={slot.prop}
                binding={currentBinding}
                childCount={primaryChildren.length}
                onChange={binding => {
                  // Sync to repeatBinding for backward compat
                  if (binding.mode === 'data' && binding.source) {
                    updateRepeat(sel.id, { source: binding.source, keyProp: binding.keyProp ?? 'id' });
                  } else if (binding.mode === 'static' || (binding.mode === 'template' && !binding.source)) {
                    updateRepeat(sel.id, undefined);
                  }
                  updateSlotBinding(sel.id, slot.prop, binding.mode === 'static' ? undefined : binding);
                }}
              />
            );
          })()}

          {/* Separator between primary and secondary slots */}
          {arraySlotConfig!.primarySlot && arraySlotConfig!.namedArraySlots.length > 0 && (
            <View style={s.slotDivider} />
          )}

          {/* Named-array slots */}
          {arraySlotConfig!.namedArraySlots.map(slot => {
            const slotChildren = sel.children.filter(c => c.slotName === slot.prop);
            const existing = sel.slotBindings?.[slot.prop];
            const currentBinding: SlotBinding = existing ?? { mode: 'static' };
            return (
              <SlotModeSection
                key={slot.prop}
                label={slot.label}
                slotProp={slot.prop}
                binding={currentBinding}
                childCount={slotChildren.length}
                onChange={binding => updateSlotBinding(sel.id, slot.prop, binding.mode === 'static' ? undefined : binding)}
              />
            );
          })}
        </Section>
      ) : (
        /* Non-array-slot nodes: standard list mode (repeat on the node itself) */
        <Section
          title="List mode"
          subtitle={hasRepeat ? `Répétition depuis ${sel.repeatBinding!.source}` : 'Pas de répétition'}
          icon="repeat"
          color={hasRepeat ? C.cyan : C.muted}
          active={hasRepeat}
          open={sectionState.current.listMode}
          onToggle={() => toggleSectionTracked('listMode')}
        >
          <Text style={s.sectionDesc}>
            {LOGIC_TEXTS.sections.listMode}
          </Text>
          <RepeatSection
            node={sel}
            itemFields={itemFields}
            onChange={repeat => updateRepeat(sel.id, repeat)}
          />
        </Section>
      )}

      {/* ── PAGE VARIABLES ───────────────────────────────────────────── */}
      <Section
        title="Page variables"
        subtitle={`${pageState.length} variable${pageState.length !== 1 ? 's' : ''} · ${queries.filter((q: any) => q.alias).length} depuis les requêtes`}
        icon="database"
        color="#8b5cf6"
        badge={pageState.length}
        active={pageState.length > 0}
        open={sectionState.current.pageVariables}
        onToggle={() => toggleSectionTracked('pageVariables')}
      >
        <Text style={s.sectionDesc}>
          {LOGIC_TEXTS.sections.pageVariables}
        </Text>
        <StateSection
          pageState={pageState}
          queries={queries}
          onAdd={addPageState}
          onRemove={removePageState}
        />
      </Section>

      {/* ── ANIMATION ────────────────────────────────────────────────── */}
      <Section
        title="Animation"
        subtitle={hasAnimation ? `${sel.animation!.preset} au ${sel.animation!.trigger}` : 'Aucune animation'}
        icon="wind"
        color={hasAnimation ? C.accent : C.muted}
        active={hasAnimation}
        open={sectionState.current.animation}
        onToggle={() => toggleSectionTracked('animation')}
      >
        <Text style={s.sectionDesc}>
          {LOGIC_TEXTS.sections.animation}
        </Text>
        <AnimationSection
          animation={sel.animation}
          nodeId={sel.id}
          onChange={anim => updateAnimation(sel.id, anim)}
        />
      </Section>
    </View>
  );
};

export default LogicPanel;

const s = StyleSheet.create({
  root: { paddingBottom: 40 },
  // Empty state
  empty: { alignItems: 'center', justifyContent: 'center', gap: 8, padding: 32 },
  emptyTitle: { color: C.text, fontSize: 13, fontWeight: '600' },
  emptyHint: { color: C.muted, fontSize: 11, textAlign: 'center', lineHeight: 16 },
  // Context banner
  contextBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: 'rgba(34,211,238,0.07)', borderBottomWidth: 1, borderBottomColor: 'rgba(34,211,238,0.15)' },
  contextBannerText: { color: C.cyan, fontSize: 10, flex: 1 },
  // Section
  section: { borderBottomWidth: 1, borderBottomColor: C.border, borderLeftWidth: 0 },
  sHead: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: C.bg },
  sIconBox: { width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  sTitle: { fontSize: 11, fontWeight: '700', letterSpacing: -0.1 },
  sSubtitle: { color: C.muted, fontSize: 9, marginTop: 1 },
  sBody: { paddingHorizontal: 12, paddingBottom: 14, paddingTop: 6, backgroundColor: C.surface },
  sectionDesc: { color: C.muted, fontSize: 10, lineHeight: 14, marginBottom: 10 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  badgeText: { fontSize: 9, fontWeight: '700' },
  // Event picker
  picker: { backgroundColor: C.s2, borderRadius: 8, borderWidth: 1, borderColor: C.border, padding: 10, marginBottom: 8 },
  pickerTitle: { color: C.text, fontSize: 11, fontWeight: '600', marginBottom: 8 },
  pickerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  pickerBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 6, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  pickerBtnText: { color: C.muted, fontSize: 10, fontWeight: '500' },
  cancelBtn: { alignSelf: 'center', marginTop: 8, padding: 4 },
  cancelText: { color: C.muted, fontSize: 10 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 9, borderRadius: 7, borderWidth: 1, borderStyle: 'dashed' as any, borderColor: 'rgba(245,158,11,0.35)', backgroundColor: 'rgba(245,158,11,0.04)', marginBottom: 8 },
  addBtnText: { color: '#f59e0b', fontSize: 11, fontWeight: '600' },
  // Bindings
  contextNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, backgroundColor: 'rgba(34,211,238,0.06)', borderRadius: 6, padding: 8, borderWidth: 1, borderColor: 'rgba(34,211,238,0.15)', marginBottom: 4 },
  contextNoteText: { color: C.cyan, fontSize: 9, flex: 1, lineHeight: 13 },
  bindRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 },
  bindPropName: { color: C.text, fontSize: 10, fontWeight: '600' },
  bindPropNameTruncated: { flex: 1, marginRight: 4 },
  unbindBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  unbindText: { color: C.muted, fontSize: 9 },
  bindOverride: { color: C.muted, fontSize: 8, fontStyle: 'italic', marginTop: 2 },
  bindOverrideVal: { color: '#22c55e', fontFamily: 'monospace' as any },
  hint: { color: C.muted, fontSize: 10, fontStyle: 'italic', lineHeight: 14 },
  slotDivider: { height: 1, backgroundColor: 'rgba(26,34,64,0.8)', marginVertical: 6 },
});
