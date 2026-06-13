/** PropertiesPanel — Right sidebar: Properties / Design / Logic / Code tabs. */
import React, { useState, useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStudio, TreeNode, RegItem } from '../store/StudioProvider';
import SmartInput from './shared/SmartInput';
import DesignPanel from './DesignPanel';
import LogicPanel from './logic/LogicPanel';
import SnackPanel from './SnackPanel';
import { Box, Inline, Center, Text, useTheme } from '@flipova/foundation/web';

const FALLBACK = {
  bg: '#0e1015', surface: '#15171e', surface2: '#1b1d24',
  border: '#272a31', text: '#e2e4e9', muted: '#8b949e',
  primary: '#3b82f6', success: '#238636', error: '#f85149',
};
const C = FALLBACK;

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
  const { theme } = useTheme();
  const C = { bg: theme.background || FALLBACK.bg, surface: theme.card || FALLBACK.surface, surface2: FALLBACK.surface2, border: theme.border || FALLBACK.border, text: theme.foreground || FALLBACK.text, muted: theme.mutedForeground || FALLBACK.muted, primary: theme.primary || FALLBACK.primary, success: theme.success || FALLBACK.success, error: theme.error || FALLBACK.error };
  const [open, setOpen] = useState(true);
  const gi = GROUP_ICONS[group] || { icon: 'circle' as const, color: C.muted };
  return (
    <Box style={{ borderBottomWidth: 1, borderBottomColor: C.border }}>
      <Pressable style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 9, backgroundColor: C.bg }} onPress={() => setOpen(!open)}>
        <Center style={{ width: 20, height: 20, borderRadius: 5, backgroundColor: gi.color + '20', marginRight: 6 }}>
          <Feather name={gi.icon} size={11} color={gi.color} />
        </Center>
        <Box flex={1}>
          <Text fontSize={11} fontWeight="600" color={C.text} style={{ letterSpacing: -0.1 }}>{title}</Text>
        </Box>
        <Feather name={open ? 'chevron-down' : 'chevron-right'} size={12} color={C.muted} />
      </Pressable>
      {open && <Box bg={C.surface} px={3} style={{ paddingBottom: 12, paddingTop: 6 }}>{children}</Box>}
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Code view tab
// ---------------------------------------------------------------------------
const CodeView: React.FC<{ sel: TreeNode }> = ({ sel }) => {
  const { theme } = useTheme();
  const C = { bg: theme.background || FALLBACK.bg, surface: theme.card || FALLBACK.surface, surface2: FALLBACK.surface2, border: theme.border || FALLBACK.border, text: theme.foreground || FALLBACK.text, muted: theme.mutedForeground || FALLBACK.muted, primary: theme.primary || FALLBACK.primary, success: theme.success || FALLBACK.success, error: theme.error || FALLBACK.error };
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
    <Box style={{ padding: 10, gap: 6 }}>
      <Inline style={{ marginBottom: 4 }} spacing={1}>
        {(['jsx', 'props', 'styles'] as const).map(t => (
          <Pressable key={t} style={{ ...s.codeTab as any, backgroundColor: C.surface2, borderColor: C.border, ...(tab === t ? { backgroundColor: C.primary, borderColor: C.primary } : {}) }} onPress={() => setTab(t)}>
            <Text fontSize={9} fontWeight="600" color={tab === t ? '#fff' : C.muted}>{t.toUpperCase()}</Text>
          </Pressable>
        ))}
      </Inline>
      {tab === 'jsx' && <Text style={{ ...s.codeBlock as any, backgroundColor: C.bg, borderColor: C.border, userSelect: 'text' }}>{jsxPreview}</Text>}
      {tab === 'props' && <TextInput style={[s.codeBlock, { backgroundColor: C.bg, borderColor: C.border }]} value={editingProps} onChangeText={setEditingProps} multiline numberOfLines={10} onBlur={applyProps} />}
      {tab === 'styles' && <TextInput style={[s.codeBlock, { backgroundColor: C.bg, borderColor: C.border }]} value={editingStyles} onChangeText={setEditingStyles} multiline numberOfLines={10} onBlur={applyStyles} />}
      <Text fontSize={8} color={C.muted} style={{ opacity: 0.5 }}>ID: {sel.id} · {sel.kind}</Text>
    </Box>
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
  const { theme } = useTheme();
  const C = { bg: theme.background || FALLBACK.bg, surface: theme.card || FALLBACK.surface, surface2: FALLBACK.surface2, border: theme.border || FALLBACK.border, text: theme.foreground || FALLBACK.text, muted: theme.mutedForeground || FALLBACK.muted, primary: theme.primary || FALLBACK.primary, success: theme.success || FALLBACK.success, error: theme.error || FALLBACK.error };
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
    <Box style={[pe.row, { backgroundColor: C.surface }]}>
      {isBound && (
        <Inline align="center" spacing={1} style={pe.boundIndicator}>
          <Feather name="link" size={8} color="#a78bfa" />
          <Text fontSize={8} fontWeight="600" color="#a78bfa" style={{ flex: 1 }}>linked</Text>
          <Pressable onPress={() => onClearBinding(prop.name)} hitSlop={6} style={pe.clearBtn}>
            <Feather name="x" size={8} color={C.muted} />
          </Pressable>
        </Inline>
      )}
      <Text fontSize={10} fontWeight="600" color={C.muted} style={{ marginBottom: 4 }}>{prop.label || prop.name}</Text>
      <Inline align="flex-end" spacing={1}>
        <Box flex={1}>
          <SmartInput
            label=""
            value={displayValue}
            onChange={handleChange}
            propType={prop.type}
            options={Array.isArray(prop.options) ? prop.options : undefined}
            isExpression={isBound}
          />
        </Box>
        {!isBound && canBeAuto && isOverridden && (
          <Pressable
            onPress={() => onChangeProp(prop.name, undefined)}
            hitSlop={8}
            style={pe.autoBtn}
          >
            <Text fontSize={8} fontWeight="700" color="#3b82f6">auto</Text>
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
      </Inline>
      {isBound && staticVal !== undefined && staticVal !== null && staticVal !== '' && (
        <Text fontSize={8} color={C.muted} style={{ fontStyle: 'italic', marginTop: 2 }}>
          Fallback: <Text fontSize={8} color="#22c55e" style={{ fontFamily: 'monospace' as any }}>{String(staticVal)}</Text>
        </Text>
      )}
    </Box>
  );
};

// ---------------------------------------------------------------------------// Main PropertiesPanel
// ---------------------------------------------------------------------------
const PropertiesPanel: React.FC = () => {
  const { selId, node, meta, rightTab, setRightTab, updateProp, updateBindings } = useStudio();
  const { theme } = useTheme();
  const C = { bg: theme.background || FALLBACK.bg, surface: theme.card || FALLBACK.surface, surface2: FALLBACK.surface2, border: theme.border || FALLBACK.border, text: theme.foreground || FALLBACK.text, muted: theme.mutedForeground || FALLBACK.muted, primary: theme.primary || FALLBACK.primary, success: theme.success || FALLBACK.success, error: theme.error || FALLBACK.error };
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
    <Box style={s.root}>
      <Center style={s.empty}>
        <Feather name="target" size={32} color={C.muted} />
        <Text fontSize={12} color={C.muted}>Select an element</Text>
      </Center>
    </Box>
  );

  const grouped: Record<string, any[]> = {};
  (m?.props || []).forEach((p: any) => {
    const g = p.group || 'content';
    (grouped[g] ??= []).push(p);
  });

  return (
    <Box style={s.root}>
      {/* Node header */}
      <Box px={3} py={2} style={{ borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.bg }}>
        <Inline align="center" spacing={2}>
          <Center style={s.kindBadge}>
            <Feather name={KIND_ICON_MAP[sel.kind] || 'circle'} size={12} color={C.primary} />
          </Center>
          <Text fontSize={13} fontWeight="700" color={C.text} style={{ letterSpacing: -0.2, flex: 1 }} numberOfLines={1}>{sel.registryId}</Text>
          <Text fontSize={9} fontWeight="600" color={C.muted} style={{ textTransform: 'uppercase' as any, letterSpacing: 0.8 }}>{sel.kind}</Text>
        </Inline>
        {m?.variants && m.variants.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.variantRow}>
            {m.variants.map((v: any) => (
              <Pressable key={v.name} style={{ ...s.variantBtn as any, ...(sel.variant === v.name ? s.variantBtnOn : {}) }}
                onPress={() => { if (selId) updateProp(selId, '__variant__', v.name); }}>
                <Text fontSize={9} fontWeight="500" color={sel.variant === v.name ? '#fff' : C.muted}>{v.label || v.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </Box>

      {/* Tabs */}
      <Box style={s.tabs}>
        {(['properties', 'design', 'config', 'code'] as const).map(t => (
          <Pressable key={t} style={s.tab} onPress={() => setRightTab(t)}>
            <Text fontSize={11} fontWeight={rightTab === t ? "600" : "500"} color={rightTab === t ? C.primary : C.muted}>
              {t === 'code' ? '</>' : t === 'config' ? 'Logic' : t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
            {rightTab === t && <Box style={s.tabIndicator} />}
          </Pressable>
        ))}
      </Box>

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
            : <Center style={s.emptyProps}><Text fontSize={11} color={C.muted} style={{ fontStyle: 'italic' }}>No configurable props</Text></Center>
        )}
        {rightTab === 'design' && <DesignPanel />}
        {rightTab === 'config' && <LogicPanel />}
        {rightTab === 'code' && <CodeView sel={sel} />}
      </ScrollView>
    </Box>
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
  emptyPropsText: { fontSize: 11, fontStyle: 'italic' },
  // Code view
  codeTab: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1 },
  codeTabOn: { },
  codeTabText: { fontSize: 9, fontWeight: '600' },
  codeTabTextOn: { color: '#fff' },
  codeBlock: { borderRadius: 8, borderWidth: 1, color: '#22c55e', fontSize: 10, fontFamily: 'monospace' as any, padding: 10, minHeight: 100, textAlignVertical: 'top' },
  codeId: { fontSize: 8, opacity: 0.5 },
});

// PropEditor styles
const pe = StyleSheet.create({
  row: { borderRadius: 6, padding: 8, marginBottom: 4 },
  propLabel: { fontSize: 10, fontWeight: '600', marginBottom: 4 },
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
  fallbackHint: { fontSize: 8, fontStyle: 'italic', marginTop: 2 },
  fallbackVal: { color: '#22c55e', fontFamily: 'monospace' as any },
});


