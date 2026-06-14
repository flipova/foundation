/** PropertiesPanel — Right sidebar: Properties / Design / Logic / Code tabs. */
import React, { useState, useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {  TreeNode, RegItem  } from '@flipova/studio-core';
import { useStudio } from '../../useStudio';
import SmartInput from '../../shared/SmartInput';
import DesignPanel from './DesignPanel';
import LogicPanel from './LogicPanel/LogicPanel';
import SnackPanel from '../SnackPanel';
import { colors, font, radius, space } from '../../ds';

import { colors as C } from '../../ds';

const GROUP_ICONS: Record<string, { icon: React.ComponentProps<typeof Feather>['name']; color: string }> = {
  style:    { icon: 'droplet', color: colors.textSub },
  layout:   { icon: 'layout',  color: colors.primary },
  behavior: { icon: 'zap',     color: colors.textSub },
  content:  { icon: 'edit-3',  color: colors.text },
};

const KIND_ICON_MAP: Record<string, React.ComponentProps<typeof Feather>['name']> = {
  layout: 'layout', component: 'box', block: 'package', primitive: 'circle',
};

// ---------------------------------------------------------------------------
// Section wrapper (for Properties tab)
// ---------------------------------------------------------------------------
const Section: React.FC<{ title: string; group: string; children: React.ReactNode }> = ({ title, group, children }) => {
  const [open, setOpen] = useState(true);
  const gi = GROUP_ICONS[group] || { icon: 'circle' as const, color: C.muted };
  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: C.border }}>
      <Pressable style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 7, backgroundColor: C.bg }} onPress={() => setOpen(!open)}>
        <View style={{ width: 16, height: 16, borderRadius: (radius?.xs || 2), backgroundColor: gi.color + '14', marginRight: 6, alignItems: 'center', justifyContent: 'center' }}>
          <Feather name={gi.icon} size={9} color={gi.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10, fontWeight: '500', fontFamily: (font?.family || 'Lexend'), color: C.textSub, letterSpacing: 0.2 }}>{title.toUpperCase()}</Text>
        </View>
        <Feather name={open ? 'chevron-down' : 'chevron-right'} size={10} color={C.muted} />
      </Pressable>
      {open && <View style={{ backgroundColor: C.surface, paddingHorizontal: 10, paddingBottom: 10, paddingTop: 4 }}>{children}</View>}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Code view tab
// ---------------------------------------------------------------------------
const CodeView: React.FC<{ sel: TreeNode }> = ({ sel }) => {
  const { updateProp, updateStyles } = useStudio();
  const [tab, setTab] = useState<'jsx' | 'props' | 'styles'>('jsx');
  const [editingProps, setEditingProps] = useState(() => JSON.stringify(sel.props, null, 2));
  const [editingStyles, setEditingStyles] = useState(() => JSON.stringify(sel.styles || {}, null, 2));

  React.useEffect(() => { setEditingProps(JSON.stringify(sel.props, null, 2)); }, [sel.props]);
  React.useEffect(() => { setEditingStyles(JSON.stringify(sel.styles || {}, null, 2)); }, [sel.styles]);

  const applyProps = () => {
    try { const p = JSON.parse(editingProps); for (const [k, v] of Object.entries(p)) updateProp(sel.id, k, v); } catch {}
  };
  const applyStyles = () => {
    try { updateStyles(sel.id, JSON.parse(editingStyles)); } catch {}
  };

  const jsxPreview = React.useMemo(() => {
    const tag = sel.registryId;
    const propsStr = Object.entries(sel.props)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => typeof v === 'string' ? `${k}="${v}"` : typeof v === 'boolean' ? (v ? k : `${k}={false}`) : `${k}={${JSON.stringify(v)}}`)
      .join('\n  ');
    const styleStr = sel.styles && Object.keys(sel.styles).length > 0
      ? `\n  style={${JSON.stringify(sel.styles, null, 4)}}` : '';
    return sel.children?.length > 0
      ? `<${tag}\n  ${propsStr}${styleStr}\n>\n  {/* ${sel.children.length} children */}\n</${tag}>`
      : `<${tag}\n  ${propsStr}${styleStr}\n/>`;
  }, [sel]);

  return (
    <View style={{ padding: 8, gap: 5 }}>
      <View style={{ flexDirection: 'row', marginBottom: 4, gap: 3 }}>
        {(['jsx', 'props', 'styles'] as const).map(t => (
          <Pressable key={t} style={{ ...s.codeTab as any, backgroundColor: tab === t ? C.primary : C.surface2, borderColor: tab === t ? C.primary : C.border }} onPress={() => setTab(t)}>
            <Text style={{ fontSize: 9, fontWeight: '500', fontFamily: (font?.family || 'Lexend'), color: tab === t ? '#fff' : C.muted }}>{t.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
      {tab === 'jsx' && <Text style={{ ...s.codeBlock as any, backgroundColor: C.bg, borderColor: C.border, userSelect: 'text' as any }}>{jsxPreview}</Text>}
      {tab === 'props' && <TextInput style={[s.codeBlock, { backgroundColor: C.bg, borderColor: C.border }]} value={editingProps} onChangeText={setEditingProps} multiline numberOfLines={10} onBlur={applyProps} />}
      {tab === 'styles' && <TextInput style={[s.codeBlock, { backgroundColor: C.bg, borderColor: C.border }]} value={editingStyles} onChangeText={setEditingStyles} multiline numberOfLines={10} onBlur={applyStyles} />}
      <Text style={{ fontSize: 8, color: C.muted, opacity: 0.4, fontFamily: (font?.family || 'Lexend') }}>ID: {sel.id} · {sel.kind}</Text>
    </View>
  );
};

// ---------------------------------------------------------------------------
// PropEditor — shows binding expression when bound, static value otherwise
// ---------------------------------------------------------------------------

/** Prop types where omitting the value (undefined) means "auto" — the component decides */
const AUTO_CAPABLE_TYPES = new Set(['number', 'spacing', 'radius', 'shadow', 'padding', 'ratio']);

function isPropOverridden(prop: any, sel: TreeNode): boolean {
  const val = sel.props[prop.name];
  if (val === undefined || val === null) return false;
  if (prop.default === undefined) return true;
  return val !== prop.default;
}

const PropEditor: React.FC<{
  prop: any;
  sel: TreeNode;
  onChangeProp: (k: string, v: any) => void;
  onChangeBinding: (k: string, v: string) => void;
  onClearBinding: (k: string) => void;
}> = ({ prop, sel, onChangeProp, onChangeBinding, onClearBinding }) => {
  const binding = sel.bindings?.[prop.name];
  const staticVal = sel.props[prop.name];
  const isBound = !!binding;
  const isOverridden = isPropOverridden(prop, sel);
  // "auto" means the prop has no default in the registry — omitting it lets the component decide
  const canBeAuto = AUTO_CAPABLE_TYPES.has(prop.type) && prop.default === undefined;
  // "reset" means the prop has a default and the current value differs from it
  const canReset = !canBeAuto && prop.default !== undefined && isOverridden;

  const displayValue = isBound ? binding : (staticVal ?? prop.default);

  const handleChange = (v: any) => {
    if (typeof v === 'string' && v.startsWith('$')) {
      onChangeBinding(prop.name, v);
    } else if (typeof v === 'string' && v && !v.startsWith('$') && isBound) {
      onClearBinding(prop.name);
      onChangeProp(prop.name, v);
    } else {
      onChangeProp(prop.name, v);
    }
  };

  return (
    <View style={{ ...pe.row, backgroundColor: C.surface }}>
      {isBound && (
        <View style={[pe.boundIndicator, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
          <Feather name="link" size={8} color={C.primary} />
          <Text style={{ fontSize: 8, fontWeight: '500', fontFamily: (font?.family || 'Lexend'), color: C.primary, flex: 1 }}>linked</Text>
          <Pressable onPress={() => onClearBinding(prop.name)} hitSlop={6} style={pe.clearBtn}>
            <Feather name="x" size={8} color={C.muted} />
          </Pressable>
        </View>
      )}
      <Text style={{ fontSize: 10, fontWeight: '400', fontFamily: (font?.family || 'Lexend'), color: C.muted, marginBottom: 4 }}>{prop.label || prop.name}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
        <View style={{ flex: 1 }}>
          <SmartInput
            label=""
            value={displayValue}
            onChange={handleChange}
            propType={prop.type}
            options={Array.isArray(prop.options) ? prop.options : undefined}
            isExpression={isBound}
          />
        </View>
        {!isBound && canBeAuto && isOverridden && (
          <Pressable onPress={() => onChangeProp(prop.name, undefined)} hitSlop={8} style={pe.autoBtn}>
            <Text style={pe.autoBtnText}>auto</Text>
          </Pressable>
        )}
        {!isBound && canReset && (
          <Pressable onPress={() => onChangeProp(prop.name, prop.default)} hitSlop={8} style={pe.resetBtn}>
            <Feather name="rotate-ccw" size={9} color={C.muted} />
          </Pressable>
        )}
      </View>
      {isBound && staticVal !== undefined && staticVal !== null && staticVal !== '' && (
        <Text style={{ fontSize: 8, color: C.muted, fontStyle: 'italic', fontFamily: (font?.family || 'Lexend'), marginTop: 2 }}>
          Fallback: <Text style={pe.fallbackVal}>{String(staticVal)}</Text>
        </Text>
      )}
    </View>
  );
};

// ---------------------------------------------------------------------------// Main PropertiesPanel
// ---------------------------------------------------------------------------
const PropertiesPanel: React.FC = () => {
  const { selId, node, meta, rightTab, setRightTab, updateProp, updateBindings } = useStudio();
  const sel: TreeNode | null = selId ? node(selId) : null;
  const m: RegItem | undefined = sel ? meta(sel.kind, sel.registryId) : undefined;

  const onChangeProp = useCallback((k: string, v: any) => {
    if (selId) updateProp(selId, k, v);
  }, [selId, updateProp]);

  const onChangeBinding = useCallback((k: string, expr: string) => {
    if (selId) updateBindings(selId, { [k]: expr });
  }, [selId, updateBindings]);

  const onClearBinding = useCallback((k: string) => {
    if (selId) updateBindings(selId, { [k]: '' }); // empty string removes the binding
  }, [selId, updateBindings]);

  if (!sel) return (
    <View style={s.root}>
      <View style={s.empty}>
        <Feather name="target" size={24} color={C.muted} />
        <Text style={{ fontSize: 11, color: C.muted, fontFamily: (font?.family || 'Lexend') }}>Select an element</Text>
      </View>
    </View>
  );

  const grouped: Record<string, any[]> = {};
  (m?.props || []).forEach((p: any) => {
    const g = p.group || 'content';
    (grouped[g] ??= []).push(p);
  });

  return (
    <View style={s.root}>
      {/* Node header */}
      <View style={{ paddingHorizontal: 10, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.bg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <View style={s.kindBadge}>
            <Feather name={KIND_ICON_MAP[sel.kind] || 'circle'} size={11} color={C.primary} />
          </View>
          <Text style={{ fontSize: 12, fontWeight: '600', fontFamily: (font?.family || 'Lexend'), color: C.text, letterSpacing: -0.2, flex: 1 }} numberOfLines={1}>{sel.registryId}</Text>
          <Text style={{ fontSize: 8, fontWeight: '500', fontFamily: (font?.family || 'Lexend'), color: C.muted, textTransform: 'uppercase' as any, letterSpacing: 0.8 }}>{sel.kind}</Text>
        </View>
        {m?.variants && m.variants.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.variantRow}>
            {m.variants.map((v: any) => (
              <Pressable key={v.name} style={{ ...s.variantBtn as any, ...(sel.variant === v.name ? s.variantBtnOn : {}) }}
                onPress={() => { if (selId) updateProp(selId, '__variant__', v.name); }}>
                <Text style={{ fontSize: 9, fontFamily: (font?.family || 'Lexend'), fontWeight: '500', color: sel.variant === v.name ? '#fff' : C.muted }}>{v.label || v.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Tabs */}
      <View style={s.tabs}>
        {(['properties', 'design', 'config', 'code'] as const).map(t => (
          <Pressable key={t} style={s.tab} onPress={() => setRightTab(t)}>
            <Text style={{ fontSize: 10, fontFamily: (font?.family || 'Lexend'), fontWeight: rightTab === t ? '500' : '400', color: rightTab === t ? C.primary : C.muted }}>
              {t === 'code' ? '</>' : t === 'config' ? 'Logic' : t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
            {rightTab === t && <View style={s.tabIndicator} />}
          </Pressable>
        ))}
      </View>

      {/* Tab content */}
      <ScrollView style={s.body}>
        {rightTab === 'properties' && (
          Object.entries(grouped).length > 0
            ? Object.entries(grouped).map(([g, props]) => (
                <Section key={g} title={g.charAt(0).toUpperCase() + g.slice(1)} group={g}>
                  {props.map((p: any) => (
                    <PropEditor
                      key={p.name}
                      prop={p}
                      sel={sel}
                      onChangeProp={onChangeProp}
                      onChangeBinding={onChangeBinding}
                      onClearBinding={onClearBinding}
                    />
                  ))}
                </Section>
              ))
            : <View style={s.emptyProps}><Text style={{ fontSize: 11, color: C.muted, fontStyle: 'italic' }}>No configurable props</Text></View>
        )}
        {rightTab === 'design' && <DesignPanel />}
        {rightTab === 'config' && <LogicPanel />}
        {rightTab === 'code' && <CodeView sel={sel} />}
      </ScrollView>
    </View>
  );
};

export default PropertiesPanel;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface, borderLeftWidth: 1, borderLeftColor: C.border },
  header: { paddingHorizontal: 10, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.bg },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  kindBadge: { width: 20, height: 20, borderRadius: (radius?.xs || 2), backgroundColor: C.primaryGlow, alignItems: 'center', justifyContent: 'center' },
  headerName: { color: C.text, fontSize: 12, fontWeight: '600', fontFamily: (font?.family || 'Lexend'), letterSpacing: -0.2, flex: 1 },
  headerKind: { color: C.muted, fontSize: 9, fontWeight: '600', fontFamily: (font?.family || 'Lexend'), textTransform: 'uppercase' as any, letterSpacing: 0.8 },
  variantRow: { gap: 3, marginTop: 6 },
  variantBtn: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: (radius?.xs || 2), backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border },
  variantBtnOn: { backgroundColor: C.primary, borderColor: C.primary },
  variantText: { color: C.muted, fontSize: 9, fontWeight: '500', fontFamily: (font?.family || 'Lexend') },
  variantTextOn: { color: '#fff', fontFamily: (font?.family || 'Lexend') },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.bg, paddingHorizontal: 4 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, paddingHorizontal: 8, borderRadius: 0, position: 'relative' },
  tabIndicator: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: C.primary, borderRadius: 1 },
  tabText: { color: C.muted, fontSize: 11, fontWeight: '400', fontFamily: (font?.family || 'Lexend') },
  tabTextActive: { color: C.primary, fontWeight: '500', fontFamily: (font?.family || 'Lexend') },
  body: { flex: 1 },
  section: { borderBottomWidth: 1, borderBottomColor: C.border },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 7, backgroundColor: C.bg },
  sectionIconBadge: { width: 18, height: 18, borderRadius: (radius?.xs || 2), alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  sectionTitle: { flex: 1, color: C.text, fontSize: 10, fontWeight: '500', fontFamily: (font?.family || 'Lexend'), letterSpacing: -0.1 },
  sectionBody: { paddingHorizontal: 10, paddingBottom: 10, paddingTop: 4, backgroundColor: C.surface },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, padding: 32 },
  emptyText: { color: C.muted, fontSize: 12, fontFamily: (font?.family || 'Lexend') },
  emptyProps: { padding: 20, alignItems: 'center' },
  emptyPropsText: { fontSize: 11, fontStyle: 'italic', fontFamily: (font?.family || 'Lexend') },
  // Code view
  codeTab: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: (radius?.xs || 2), borderWidth: 1 },
  codeTabOn: { },
  codeTabText: { fontSize: 9, fontWeight: '500', fontFamily: (font?.family || 'Lexend') },
  codeTabTextOn: { color: '#fff', fontFamily: (font?.family || 'Lexend') },
  codeBlock: { borderRadius: (radius?.sm || 3), borderWidth: 1, color: C.text, fontSize: 10, fontFamily: 'monospace' as any, padding: 10, minHeight: 100, textAlignVertical: 'top' },
  codeId: { fontSize: 8, opacity: 0.5, fontFamily: (font?.family || 'Lexend') },
});

// PropEditor styles
const pe = StyleSheet.create({
  row: { borderRadius: (radius?.xs || 2), padding: 7, marginBottom: 3, backgroundColor: C.surface },
  propLabel: { fontSize: 10, fontWeight: '500', fontFamily: (font?.family || 'Lexend'), marginBottom: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  boundIndicator: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2,
    backgroundColor: 'rgba(0,0,145,0.12)', borderRadius: (radius?.xs || 2), paddingHorizontal: 5, paddingVertical: 2,
  },
  boundLabel: { color: C.primary, fontSize: 8, fontWeight: '600', fontFamily: (font?.family || 'Lexend'), flex: 1 },
  clearBtn: { padding: 2 },
  autoBtn: {
    borderRadius: (radius?.xs || 2), height: 20, paddingHorizontal: 5,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,145,0.1)', borderWidth: 1, borderColor: 'rgba(0,0,145,0.25)',
  },
  autoBtnText: { color: C.primary, fontSize: 8, fontWeight: '600', fontFamily: (font?.family || 'Lexend') },
  resetBtn: {
    width: 20, height: 20, borderRadius: (radius?.xs || 2), alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border,
  },
  fallbackHint: { fontSize: 8, fontStyle: 'italic', marginTop: 2, fontFamily: (font?.family || 'Lexend') },
  fallbackVal: { color: C.textSub, fontFamily: 'monospace' as any },
});



