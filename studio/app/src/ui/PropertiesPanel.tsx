/** PropertiesPanel — Right sidebar: Properties / Design / Logic / Code tabs. */
import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStudio, TreeNode, RegItem } from '../store/StudioProvider';
import SmartInput from './shared/SmartInput';
import DesignPanel from './DesignPanel';
import LogicPanel from './logic/LogicPanel';
import SnackPanel from './SnackPanel';

const C = {
  bg: '#07090f', surface: '#0d1220', surface2: '#131a2e',
  border: '#1a2240', text: '#d0d8f0', muted: '#4a5470',
  primary: '#3b82f6', success: '#22c55e', error: '#ef4444',
};

const GROUP_ICONS: Record<string, { icon: React.ComponentProps<typeof Feather>['name']; color: string }> = {
  style:    { icon: 'droplet', color: '#a78bfa' },
  layout:   { icon: 'layout',  color: '#3b82f6' },
  behavior: { icon: 'zap',     color: '#f59e0b' },
  content:  { icon: 'edit-3',  color: '#22c55e' },
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
    <View style={s.section}>
      <Pressable style={s.sectionHeader} onPress={() => setOpen(!open)}>
        <View style={[s.sectionIconBadge, { backgroundColor: gi.color + '20' }]}>
          <Feather name={gi.icon} size={11} color={gi.color} />
        </View>
        <Text style={s.sectionTitle}>{title}</Text>
        <Feather name={open ? 'chevron-down' : 'chevron-right'} size={12} color={C.muted} />
      </Pressable>
      {open && <View style={s.sectionBody}>{children}</View>}
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
    <View style={{ padding: 10, gap: 6 }}>
      <View style={{ flexDirection: 'row', gap: 4, marginBottom: 4 }}>
        {(['jsx', 'props', 'styles'] as const).map(t => (
          <Pressable key={t} style={[s.codeTab, tab === t && s.codeTabOn]} onPress={() => setTab(t)}>
            <Text style={[s.codeTabText, tab === t && s.codeTabTextOn]}>{t.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
      {tab === 'jsx' && <Text style={s.codeBlock} selectable>{jsxPreview}</Text>}
      {tab === 'props' && <TextInput style={s.codeBlock} value={editingProps} onChangeText={setEditingProps} multiline numberOfLines={10} onBlur={applyProps} />}
      {tab === 'styles' && <TextInput style={s.codeBlock} value={editingStyles} onChangeText={setEditingStyles} multiline numberOfLines={10} onBlur={applyStyles} />}
      <Text style={s.codeId}>ID: {sel.id} · {sel.kind}</Text>
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
    <View style={pe.row}>
      {isBound && (
        <View style={pe.boundIndicator}>
          <Feather name="link" size={8} color="#a78bfa" />
          <Text style={pe.boundLabel}>linked</Text>
          <Pressable onPress={() => onClearBinding(prop.name)} hitSlop={6} style={pe.clearBtn}>
            <Feather name="x" size={8} color={C.muted} />
          </Pressable>
        </View>
      )}
      <Text style={pe.propLabel}>{prop.label || prop.name}</Text>
      <View style={pe.inputRow}>
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
          <Pressable
            onPress={() => onChangeProp(prop.name, undefined)}
            hitSlop={8}
            style={pe.autoBtn}
          >
            <Text style={pe.autoBtnText}>auto</Text>
          </Pressable>
        )}
        {!isBound && canReset && (
          <Pressable
            onPress={() => onChangeProp(prop.name, prop.default)}
            hitSlop={8}
            style={pe.resetBtn}
          >
            <Feather name="rotate-ccw" size={9} color={C.muted} />
          </Pressable>
        )}
      </View>
      {isBound && staticVal !== undefined && staticVal !== null && staticVal !== '' && (
        <Text style={pe.fallbackHint}>
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
        <Feather name="target" size={32} color={C.muted} />
        <Text style={s.emptyText}>Select an element</Text>
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
      <View style={s.header}>
        <View style={s.headerRow}>
          <View style={s.kindBadge}>
            <Feather name={KIND_ICON_MAP[sel.kind] || 'circle'} size={12} color={C.primary} />
          </View>
          <Text style={s.headerName} numberOfLines={1}>{sel.registryId}</Text>
          <Text style={s.headerKind}>{sel.kind}</Text>
        </View>
        {m?.variants && m.variants.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.variantRow}>
            {m.variants.map((v: any) => (
              <Pressable key={v.name} style={[s.variantBtn, sel.variant === v.name && s.variantBtnOn]}
                onPress={() => { if (selId) updateProp(selId, '__variant__', v.name); }}>
                <Text style={[s.variantText, sel.variant === v.name && s.variantTextOn]}>{v.label || v.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Tabs */}
      <View style={s.tabs}>
        {(['properties', 'design', 'config', 'code'] as const).map(t => (
          <Pressable key={t} style={s.tab} onPress={() => setRightTab(t)}>
            <Text style={[s.tabText, rightTab === t && s.tabTextActive]}>
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
            : <View style={s.emptyProps}><Text style={s.emptyPropsText}>No configurable props</Text></View>
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
  header: { paddingHorizontal: 12, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.bg },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  kindBadge: { width: 22, height: 22, borderRadius: 6, backgroundColor: C.primary + '20', alignItems: 'center', justifyContent: 'center' },
  headerName: { color: C.text, fontSize: 13, fontWeight: '700', letterSpacing: -0.2, flex: 1 },
  headerKind: { color: C.muted, fontSize: 9, fontWeight: '600', textTransform: 'uppercase' as any, letterSpacing: 0.8 },
  variantRow: { gap: 3, marginTop: 6 },
  variantBtn: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border },
  variantBtnOn: { backgroundColor: C.primary, borderColor: C.primary },
  variantText: { color: C.muted, fontSize: 9, fontWeight: '500' },
  variantTextOn: { color: '#fff' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.bg, paddingHorizontal: 4 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 9, paddingHorizontal: 10, borderRadius: 0, position: 'relative' },
  tabIndicator: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: C.primary, borderRadius: 1 },
  tabText: { color: C.muted, fontSize: 11, fontWeight: '500' },
  tabTextActive: { color: C.primary, fontWeight: '600' },
  body: { flex: 1 },
  section: { borderBottomWidth: 1, borderBottomColor: C.border },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 9, backgroundColor: C.bg },
  sectionIconBadge: { width: 20, height: 20, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  sectionTitle: { flex: 1, color: C.text, fontSize: 11, fontWeight: '600', letterSpacing: -0.1 },
  sectionBody: { paddingHorizontal: 12, paddingBottom: 12, paddingTop: 6, backgroundColor: C.surface },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, padding: 32 },
  emptyText: { color: C.muted, fontSize: 12 },
  emptyProps: { padding: 20, alignItems: 'center' },
  emptyPropsText: { color: C.muted, fontSize: 11, fontStyle: 'italic' },
  // Code view
  codeTab: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border },
  codeTabOn: { backgroundColor: C.primary, borderColor: C.primary },
  codeTabText: { color: C.muted, fontSize: 9, fontWeight: '600' },
  codeTabTextOn: { color: '#fff' },
  codeBlock: { backgroundColor: C.bg, borderRadius: 8, borderWidth: 1, borderColor: C.border, color: '#22c55e', fontSize: 10, fontFamily: 'monospace' as any, padding: 10, minHeight: 100, textAlignVertical: 'top' },
  codeId: { color: C.muted, fontSize: 8, opacity: 0.5 },
});

// PropEditor styles
const pe = StyleSheet.create({
  row: { backgroundColor: C.surface, borderRadius: 6, padding: 8, marginBottom: 4 },
  propLabel: { fontSize: 10, fontWeight: '600', color: C.muted, marginBottom: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  boundIndicator: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2,
    backgroundColor: 'rgba(167,139,250,0.12)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2,
  },
  boundLabel: { color: '#a78bfa', fontSize: 8, fontWeight: '600', flex: 1 },
  clearBtn: { padding: 2 },
  autoBtn: {
    borderRadius: 5, height: 22, paddingHorizontal: 6,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(59,130,246,0.1)', borderWidth: 1, borderColor: 'rgba(59,130,246,0.25)',
  },
  autoBtnText: { color: '#3b82f6', fontSize: 8, fontWeight: '700' },
  resetBtn: {
    width: 22, height: 22, borderRadius: 5, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(106,116,148,0.1)', borderWidth: 1, borderColor: 'rgba(106,116,148,0.2)',
  },
  fallbackHint: { color: C.muted, fontSize: 8, fontStyle: 'italic', marginTop: 2 },
  fallbackVal: { color: '#22c55e', fontFamily: 'monospace' as any },
});


