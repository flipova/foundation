/**
 * SmartInput — Universal prop editor with contextual linking.
 *
 * Design principles:
 * - No external chips/buttons — everything lives in the dropdown
 * - Contextual: shows item fields first when in repeat context
 * - propType-aware: filters suggestions to relevant types only
 * - Queries split by intent: GET = data sources, POST/PUT/PATCH = action results
 */
import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Modal, Switch, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStudio } from '../../store/StudioProvider';
import { getAllTokens } from '../../store/tokens';

const C = {
  bg: '#080c18', surface: '#0d1220', s2: '#131a2e', border: '#1a2240',
  text: '#d0d8f0', muted: '#6a7494', primary: '#3b82f6', success: '#22c55e',
  warn: '#f59e0b', accent: '#a78bfa', error: '#ef4444', cyan: '#22d3ee',
};

export interface ItemField { key: string; preview: string; type: string; children?: ItemField[]; }

interface Props {
  label: string;
  value: any;
  onChange: (v: any) => void;
  propType?: string;
  options?: string[];
  placeholder?: string;
  itemFields?: ItemField[];
  isExpression?: boolean;
}

const SmartInput: React.FC<Props> = ({ label, value, onChange, propType, options, placeholder, itemFields, isExpression }) => {
  const [showLinker, setShowLinker] = useState(false);
  const isLinked = typeof value === 'string' && (value.startsWith('$') || value.startsWith('@') || value.startsWith('#'));
  const hasItemField = typeof value === 'string' && !!value && !value.startsWith('$') && !!itemFields?.some(f => f.key === value || value.startsWith(f.key + '.'));

  const linkBtn = (
    <Pressable onPress={() => setShowLinker(true)} style={[s.linkBtn, (isLinked || hasItemField) && s.linkBtnActive]}>
      <Feather name={hasItemField ? 'layers' : 'link'} size={11} color={(isLinked || hasItemField) ? C.cyan : C.muted} />
    </Pressable>
  );

  const linkedBadge = (
    <Pressable style={[s.linkedBadge, hasItemField && s.linkedBadgeItem]} onPress={() => setShowLinker(true)}>
      <Feather name={hasItemField ? 'layers' : 'link'} size={10} color={hasItemField ? C.cyan : C.primary} />
      <Text style={[s.linkedText, hasItemField && { color: C.cyan }]}>{value}</Text>
      <Pressable onPress={() => onChange('')}><Feather name="x" size={10} color={C.muted} /></Pressable>
    </Pressable>
  );

  const linker = showLinker ? (
    <LinkerModal
      propType={propType}
      itemFields={itemFields}
      isExpression={isExpression}
      onSelect={v => { onChange(v); setShowLinker(false); }}
      onClose={() => setShowLinker(false)}
    />
  ) : null;

  if (propType === 'boolean') return (
    <View style={s.row}>
      <Text style={s.label}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Switch value={!!value} onValueChange={onChange} trackColor={{ false: C.s2, true: C.primary }} thumbColor="#fff" style={{ transform: [{ scale: 0.8 }] }} />
        {linkBtn}
      </View>
      {linker}
    </View>
  );

  if (propType === 'enum' && options) return (
    <View style={s.col}>
      <View style={s.labelRow}><Text style={s.label}>{label}</Text>{linkBtn}</View>
      {isLinked || hasItemField ? linkedBadge : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.segRow}>
          {options.map(o => (
            <Pressable key={o} style={[s.seg, value === o && s.segOn]} onPress={() => onChange(o)}>
              <Text style={[s.segText, value === o && s.segTextOn]}>{o}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
      {linker}
    </View>
  );

  if (propType === 'color') return (
    <View style={s.col}>
      <View style={s.labelRow}><Text style={s.label}>{label}</Text>{linkBtn}</View>
      <View style={s.colorRow}>
        <View style={[s.swatch, { backgroundColor: isLinked ? C.primary : (value || 'transparent') }]}>
          {isLinked && <Feather name="link" size={9} color="#fff" />}
        </View>
        <TextInput style={s.colorInput} value={String(value ?? '')} onChangeText={onChange} placeholderTextColor={C.muted} placeholder="#hex or $token" />
      </View>
      {linker}
    </View>
  );

  if (propType === 'number' || propType === 'spacing' || propType === 'ratio' || propType === 'padding') return (
    <View style={s.row}>
      <Text style={s.label}>{label}</Text>
      <View style={s.numRow}>
        <Pressable onPress={() => onChange(Math.max(0, (Number(value) || 0) - (propType === 'ratio' ? 0.1 : 1)))} style={s.numBtn}><Feather name="minus" size={11} color={C.muted} /></Pressable>
        <TextInput
          style={s.numInput}
          value={String(value ?? '')}
          onChangeText={t => { if (t.startsWith('$')) onChange(t); else onChange(Number(t) || 0); }}
          keyboardType="numeric"
          placeholderTextColor={C.muted}
        />
        <Pressable onPress={() => onChange((Number(value) || 0) + (propType === 'ratio' ? 0.1 : 1))} style={s.numBtn}><Feather name="plus" size={11} color={C.muted} /></Pressable>
        {linkBtn}
      </View>
      {linker}
    </View>
  );

  if (propType === 'radius') return (
    <View style={s.col}>
      <View style={s.labelRow}><Text style={s.label}>{label}</Text>{linkBtn}</View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.segRow}>
        {['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].map(o => (
          <Pressable key={o} style={[s.seg, value === o && s.segOn]} onPress={() => onChange(o)}>
            <Text style={[s.segText, value === o && s.segTextOn]}>{o}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {linker}
    </View>
  );

  if (propType === 'shadow') return (
    <View style={s.col}>
      <View style={s.labelRow}><Text style={s.label}>{label}</Text>{linkBtn}</View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.segRow}>
        {['none', 'sm', 'md', 'lg', 'xl'].map(o => (
          <Pressable key={o} style={[s.seg, value === o && s.segOn]} onPress={() => onChange(o)}>
            <Text style={[s.segText, value === o && s.segTextOn]}>{o}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {linker}
    </View>
  );

  return (
    <View style={s.col}>
      {label ? <View style={s.labelRow}><Text style={s.label}>{label}</Text>{linkBtn}</View> : null}
      {!label && <View style={{ position: 'absolute', right: 0, top: 0, zIndex: 1 }}>{linkBtn}</View>}
      {isLinked || hasItemField ? linkedBadge : (
        <TextInput
          style={s.textInput}
          value={String(value ?? '')}
          onChangeText={onChange}
          placeholderTextColor={C.muted}
          placeholder={placeholder || (isExpression ? '$state.x, $query.xData, field...' : 'Value...')}
        />
      )}
      {linker}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Linker Modal
// ---------------------------------------------------------------------------

/**
 * Tab structure — unified around state as the single data access point:
 *
 * ITEM   → fields of the current repeat/dataContext item (contextual, shown first)
 *          → Configure: set repeatBinding or dataContext on a parent node
 *
 * STATE  → all state variables: declared + from callApi aliases + setState triggers
 *          → Configure: add state in Config tab, or set alias on a query
 *
 * GLOBAL → global state vars (persisted across screens)
 *          → Configure: add global state in Project Settings
 *
 * THEME  → theme colors ($theme.primary, etc.)
 *          → Configure: customize theme in Theme Editor
 *
 * TOK    → design tokens (spacing, radii, shadows, colors)
 *          → Configure: use token names directly
 *
 * NAV    → navigation routes and params
 *          → Configure: add screens in Project Settings
 *
 * CFG    → constants and env vars
 *          → Configure: add in Project Settings > Constants
 *
 * DEV    → device info, date, platform
 *          → Always available
 */
type LinkerTab = 'ITEM' | 'STATE' | 'GLOBAL' | 'NODES' | 'THEME' | 'TOK' | 'NAV' | 'CFG' | 'DEV';

const TAB_META: Record<LinkerTab, { label: string; color: string; icon: React.ComponentProps<typeof Feather>['name']; hint: string }> = {
  ITEM:   { label: 'Item',   color: '#22d3ee', icon: 'repeat',       hint: 'Fields from the current list item — connect directly to item data' },
  STATE:  { label: 'State',  color: '#ec4899', icon: 'box',          hint: 'Page variables — store data, API responses, user input' },
  GLOBAL: { label: 'Global', color: '#8b5cf6', icon: 'globe',        hint: 'Global variables — shared across all screens' },
  NODES:  { label: 'Nodes',  color: '#f97316', icon: 'link',         hint: 'Reference another element\'s value reactively ($node.id.prop)' },
  THEME:  { label: 'Theme',  color: '#a78bfa', icon: 'droplet',      hint: 'Theme colors — adapt to light/dark mode automatically' },
  TOK:    { label: 'Tokens', color: '#3b82f6', icon: 'grid',         hint: 'Design tokens — spacing, radii, shadows, typography' },
  NAV:    { label: 'Nav',    color: '#f59e0b', icon: 'navigation',   hint: 'Navigation — current route, params, go back' },
  CFG:    { label: 'Config', color: '#6a7494', icon: 'settings',     hint: 'App constants and environment variables' },
  DEV:    { label: 'Device', color: '#22c55e', icon: 'smartphone',   hint: 'Device info — screen size, platform, current date' },
};

function flattenQueryData(data: any, prefix: string, out: { key: string; label: string }[], depth = 0) {
  if (depth > 2) return;
  if (Array.isArray(data) && data.length > 0) {
    // For arrays, show the first item's fields directly — most useful for bindings
    const sample = data[0];
    if (sample && typeof sample === 'object') {
      for (const [k, v] of Object.entries(sample)) {
        const key = prefix + '[0].' + k;
        const type = typeof v === 'object' ? (Array.isArray(v) ? 'array' : 'object') : typeof v;
        const preview = typeof v === 'string' ? v.slice(0, 25) : typeof v === 'number' ? String(v) : type;
        out.push({ key, label: preview + ' · ' + type });
        if (typeof v === 'object' && v !== null && !Array.isArray(v) && depth < 1) {
          flattenQueryData(v, key, out, depth + 1);
        }
      }
    }
  } else if (data !== null && typeof data === 'object') {
    for (const [k, v] of Object.entries(data)) {
      const key = prefix + '.' + k;
      const type = typeof v === 'object' ? (Array.isArray(v) ? 'array' : 'object') : typeof v;
      const preview = typeof v === 'string' ? v.slice(0, 25) : typeof v === 'number' ? String(v) : type;
      out.push({ key, label: preview + ' · ' + type });
    }
  }
}

const LinkerModal: React.FC<{
  propType?: string;
  itemFields?: ItemField[];
  isExpression?: boolean;
  onSelect: (v: string) => void;
  onClose: () => void;
}> = ({ propType, itemFields, isExpression, onSelect, onClose }) => {
  const { project, page } = useStudio();
  const hasItemFields = !!itemFields?.length;
  // Show ITEM tab whenever itemFields prop is passed (even if empty — shows a hint)
  const itemFieldsProvided = itemFields !== undefined;

  // ITEM tab only shown when actually in a repeat context (itemFields provided)
  // Default: ITEM if in repeat, STATE for expressions/strings, TOK for design props
  const defaultTab: LinkerTab = hasItemFields ? 'ITEM' : (isExpression || !propType || propType === 'string') ? 'STATE' : 'TOK';
  const [tab, setTab] = useState<LinkerTab>(defaultTab);
  const [filter, setFilter] = useState('');

  // Fetch query data for STATE tab — to show drill-down fields of aliases AND storeResponseAs
  const [queryData, setQueryData] = React.useState<Record<string, any>>({});
  const [responseData, setResponseData] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    if (tab !== 'STATE') return;
    // Fetch data for query aliases
    (project?.queries || []).forEach(async (q: any) => {
      if (!q.alias || queryData[q.id] !== undefined) return;
      const svc = (project?.services || []).find((sv: any) => sv.id === q.serviceId);
      const base = (svc?.config as any)?.baseUrl || '';
      if (!base) return;
      try {
        const res = await fetch(base.replace(/\/$/, '') + q.path);
        if (res.ok) {
          const data = await res.json();
          setQueryData(prev => ({ ...prev, [q.id]: data }));
        }
      } catch {}
    });
  }, [tab, project]);

  // Determine relevant tabs — ITEM shown whenever itemFields prop is passed
  const relevantTabs = useMemo((): LinkerTab[] => {
    const tabs: LinkerTab[] = [];
    if (itemFieldsProvided) tabs.push('ITEM');  // Always show when in array context
    if (!propType || propType === 'string' || isExpression) {
      tabs.push('STATE', 'GLOBAL', 'NODES', 'NAV', 'CFG', 'DEV');
    }
    if (!propType || propType === 'color') tabs.push('THEME', 'TOK');
    else if (propType === 'number' || propType === 'spacing' || propType === 'padding') tabs.push('TOK');
    else if (propType === 'radius' || propType === 'shadow') tabs.push('TOK');
    else if (!tabs.includes('TOK')) tabs.push('TOK');
    return [...new Set(tabs)];
  }, [propType, itemFieldsProvided, isExpression]);

  const options = useMemo(() => {
    type Opt = { type: string; key: string; label: string; value: string; color: string; group?: string };
    const opts: Opt[] = [];

    // ITEM — fields of the current repeat item (only shown when in a list)
    if (tab === 'ITEM' && itemFields) {
      for (const f of itemFields) {
        opts.push({ type: 'item', key: f.key, label: f.preview + ' · ' + f.type, value: f.key, color: C.cyan });
        // Show sub-fields for arrays and objects
        if (f.children) {
          for (const child of f.children) {
            opts.push({
              type: 'item-child',
              key: child.key,
              label: child.preview + ' · ' + child.type,
              value: child.key,
              color: '#67e8f9',
              group: f.key,
            });
          }
        }
      }
    }

    // STATE — all state vars: declared + query aliases + setState triggers + storeResponseAs
    if (tab === 'STATE') {
      const pg = page();
      const seen = new Set<string>();

      // 1. Explicit page state vars
      (pg?.state || []).forEach((ps: any) => {
        seen.add(ps.name);
        opts.push({ type: 'state', key: '$state.' + ps.name, label: ps.type + ' · declared', value: '$state.' + ps.name, color: '#ec4899' });
      });

      // 2. Query aliases — the primary way to access API data
      (project?.queries || []).forEach((q: any) => {
        if (!q.alias || seen.has(q.alias)) return;
        seen.add(q.alias);
        const data = queryData[q.id];
        const isArray = Array.isArray(data);
        const label = q.method + ' ' + q.path + (q.autoFetch ? ' · auto' : ' · manual') + (isArray ? ' · array' : data ? ' · object' : '');
        opts.push({ type: 'state-query', key: '$state.' + q.alias, label, value: '$state.' + q.alias, color: '#06b6d4', group: q.alias });
        // Drill-down fields from real data
        if (data !== undefined) {
          const sample = isArray ? data[0] : data;
          if (sample && typeof sample === 'object') {
            for (const [k, v] of Object.entries(sample).slice(0, 12)) {
              const type = typeof v === 'object' ? (Array.isArray(v) ? 'array' : 'object') : typeof v;
              const preview = typeof v === 'string' ? v.slice(0, 20) : typeof v === 'number' ? String(v) : type;
              const fieldKey = isArray ? '$state.' + q.alias + '[0].' + k : '$state.' + q.alias + '.' + k;
              opts.push({ type: 'state-query-field', key: fieldKey, label: preview + ' · ' + type, value: fieldKey, color: '#22d3ee', group: q.alias });
            }
          }
        }
      });

      // 3. setState / transform / compute / incrementState / toggleState / mergeState actions in tree
      const walk = (n: any) => {
        if (n.events) {
          for (const acts of Object.values(n.events)) {
            for (const a of (acts as any[])) {
              if (a.type === 'setState' && a.payload?.key && !seen.has(a.payload.key)) {
                seen.add(a.payload.key);
                opts.push({ type: 'state', key: '$state.' + a.payload.key, label: 'from trigger', value: '$state.' + a.payload.key, color: '#ec4899' });
              }
              // transform / compute store results in state
              if ((a.type === 'transform' || a.type === 'compute') && a.payload?.storeAs && !seen.has(a.payload.storeAs)) {
                const key = String(a.payload.storeAs);
                seen.add(key);
                opts.push({ type: 'state', key: '$state.' + key, label: `${a.type} result`, value: '$state.' + key, color: '#f97316' });
              }
              // incrementState / toggleState / mergeState / resetState
              if (['incrementState','toggleState','mergeState','resetState'].includes(a.type) && a.payload?.key && !seen.has(a.payload.key)) {
                seen.add(a.payload.key);
                opts.push({ type: 'state', key: '$state.' + a.payload.key, label: a.type, value: '$state.' + a.payload.key, color: '#8b5cf6' });
              }
              if (a.type === 'callApi' && a.payload?.storeResponseAs && !seen.has(a.payload.storeResponseAs)) {
                const key = String(a.payload.storeResponseAs);
                seen.add(key);
                const q = (project?.queries || []).find((q: any) => q.id === a.payload.queryName || q.name === a.payload.queryName);
                const label = q ? 'response from ' + q.name : 'API response';
                opts.push({ type: 'state-response', key: '$state.' + key, label, value: '$state.' + key, color: '#f97316' });
                // Show drill-down if we have data for this query
                if (q && queryData[q.id]) {
                  const data = queryData[q.id];
                  const isArray = Array.isArray(data);
                  const sample = isArray ? data[0] : data;
                  if (sample && typeof sample === 'object') {
                    for (const [k, v] of Object.entries(sample).slice(0, 10)) {
                      const type = typeof v === 'object' ? (Array.isArray(v) ? 'array' : 'object') : typeof v;
                      const preview = typeof v === 'string' ? v.slice(0, 20) : typeof v === 'number' ? String(v) : type;
                      const fieldKey = isArray ? `$state.${key}[0].${k}` : `$state.${key}.${k}`;
                      opts.push({ type: 'state-query-field', key: fieldKey, label: `${k}: ${preview} · ${type}`, value: fieldKey, color: '#fb923c', group: key });
                    }
                  }
                }
              }
            }
          }
        }
        (n.children || []).forEach(walk);
      };
      if (pg?.root) walk(pg.root);
    }

    // GLOBAL
    if (tab === 'GLOBAL') {
      const globalVars: any[] = (project as any)?.globalState || [];
      globalVars.forEach((g: any) => {
        const persist = g.persist && g.persist !== 'none' ? ` 💾 ${g.persist}` : '';
        opts.push({
          type: 'global', key: '$global.' + g.name,
          label: `${g.type}${persist}`,
          value: '$global.' + g.name, color: '#8b5cf6',
        });
        // Drill-down for object/array types
        if ((g.type === 'object' || g.type === 'array') && g.default) {
          const sample = Array.isArray(g.default) ? g.default[0] : g.default;
          if (sample && typeof sample === 'object') {
            for (const [k, v] of Object.entries(sample).slice(0, 8)) {
              const type = typeof v === 'object' ? (Array.isArray(v) ? 'array' : 'object') : typeof v;
              const preview = typeof v === 'string' ? v.slice(0, 20) : typeof v === 'number' ? String(v) : type;
              const fieldKey = Array.isArray(g.default) ? `$global.${g.name}[0].${k}` : `$global.${g.name}.${k}`;
              opts.push({ type: 'global-field', key: fieldKey, label: `${k}: ${preview} · ${type}`, value: fieldKey, color: '#a78bfa', group: g.name });
            }
          }
        }
      });
    }

    // NODES — reference any node's prop reactively ($node.nodeId.propName)
    if (tab === 'NODES') {
      const pg = page();
      const walk = (n: any, depth: number = 0) => {
        const shortId = n.id.slice(-6);
        const nodeLabel = `${n.registryId} #${shortId}`;
        // Show the node itself as a group header
        opts.push({
          type: 'node-header',
          key: `$node.${n.id}`,
          label: nodeLabel,
          value: `$node.${n.id}`,
          color: '#f97316',
          group: n.id,
        });
        // Expose each prop of the node
        for (const [k, v] of Object.entries(n.props || {})) {
          if (v === undefined || v === null) continue;
          const type = typeof v;
          const preview = type === 'string' ? String(v).slice(0, 24) : type === 'number' ? String(v) : type === 'boolean' ? String(v) : type;
          opts.push({
            type: 'node-prop',
            key: `$node.${n.id}.${k}`,
            label: `${k}: ${preview} · ${type}`,
            value: `$node.${n.id}.${k}`,
            color: '#fb923c',
            group: n.id,
          });
        }
        (n.children || []).forEach((c: any) => walk(c, depth + 1));
      };
      if (pg?.root) walk(pg.root);
    }

    // THEME
    if (tab === 'THEME') {
      const { getThemeColors: gtc } = require('../../store/tokens');
      const tc = gtc(project?.theme || 'light');
      const overrides = (project as any)?.themeOverrides?.[project?.theme || 'light'] || {};
      for (const [k, v] of Object.entries({ ...tc, ...overrides })) {
        if (typeof v === 'string') opts.push({ type: 'theme', key: '$theme.' + k, label: String(v), value: '$theme.' + k, color: C.accent });
      }
    }

    // TOK — design tokens
    if (tab === 'TOK') {
      const allTokens = getAllTokens();
      const filtered = propType
        ? allTokens.filter(t => {
            if (propType === 'spacing' || propType === 'number' || propType === 'padding') return ['spacing', 'typography', 'opacity', 'zIndex'].includes(t.category);
            if (propType === 'radius') return t.category === 'radii';
            if (propType === 'shadow') return t.category === 'shadows';
            if (propType === 'color') return ['colors', 'theme'].includes(t.category);
            return true;
          })
        : allTokens;
      for (const t of filtered) opts.push({ type: 'token', key: t.path, label: t.label, value: t.path, color: t.category === 'theme' ? C.accent : C.primary });
    }

    // NAV
    if (tab === 'NAV') {
      (project?.pages || []).forEach((pg: any) => {
        const route = pg.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        opts.push({ type: 'nav', key: route, label: pg.name, value: route, color: '#f59e0b' });
      });
      opts.push({ type: 'nav', key: '$nav.currentRoute', label: 'Current route', value: '$nav.currentRoute', color: '#f59e0b' });
      opts.push({ type: 'nav', key: '$nav.params', label: 'Route params', value: '$nav.params', color: '#f59e0b' });
      opts.push({ type: 'nav', key: '$nav.goBack', label: 'Go back', value: '$nav.goBack', color: '#f59e0b' });
    }

    // CFG
    if (tab === 'CFG') {
      ((project as any)?.constants || []).forEach((c: any) => opts.push({ type: 'const', key: '$const.' + c.key, label: c.value, value: '$const.' + c.key, color: '#6a7494' }));
      ((project as any)?.envVars || []).forEach((e: any) => opts.push({ type: 'env', key: '$env.' + e.key, label: e.secret ? '••••' : e.value, value: '$env.' + e.key, color: '#6a7494' }));
      opts.push({ type: 'const', key: '$const.APP_NAME', label: project?.name || 'App', value: '$const.APP_NAME', color: '#6a7494' });
      opts.push({ type: 'const', key: '$const.APP_VERSION', label: project?.version || '1.0.0', value: '$const.APP_VERSION', color: '#6a7494' });
    }

    // DEV
    if (tab === 'DEV') {
      [
        ['$device.width', 'Screen width'], ['$device.height', 'Screen height'],
        ['$device.platform', 'ios | android | web'], ['$device.isIOS', 'boolean'],
        ['$device.isAndroid', 'boolean'], ['$date.now', 'Date.now()'],
        ['$date.today', 'YYYY-MM-DD'], ['$date.timestamp', 'Unix timestamp'],
      ].forEach(([k, l]) => opts.push({ type: 'device', key: k, label: l, value: k, color: '#22c55e' }));
    }

    return filter ? opts.filter(o => o.key.toLowerCase().includes(filter.toLowerCase()) || o.label.toLowerCase().includes(filter.toLowerCase())) : opts;
  }, [tab, filter, propType, project, page, queryData, itemFields]);

  // (groupedOptions removed — DATA tab removed)
  const getQueries: any[] = []; // kept for type safety, unused

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose}>
        <View style={s.linkerCard}>
          {/* Header */}
          <View style={s.linkerHeader}>
            <Text style={s.linkerTitle}>Link to</Text>
            {propType && <Text style={s.linkerPropType}>{propType}</Text>}
            <Pressable onPress={onClose}><Feather name="x" size={16} color={C.muted} /></Pressable>
          </View>

          {/* Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.linkerTabs}>
            {relevantTabs.map(k => {
              const meta = TAB_META[k];
              return (
                <Pressable key={k} style={[s.linkerTab, tab === k && { backgroundColor: meta.color }]} onPress={() => setTab(k)}>
                  <Feather name={meta.icon} size={9} color={tab === k ? '#fff' : C.muted} />
                  <Text style={[s.linkerTabText, tab === k && s.linkerTabTextOn]}>{meta.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Tab hint */}
          {TAB_META[tab] && (
            <View style={s.tabHint}>
              <Text style={s.tabHintText}>{TAB_META[tab].hint}</Text>
            </View>
          )}

          {/* Search */}
          <TextInput style={s.linkerSearch} placeholder="Filter..." placeholderTextColor={C.muted} value={filter} onChangeText={setFilter} />

          {/* Empty states */}
          {tab === 'STATE' && options.length === 0 && (
            <View style={s.linkerEmpty}>
              <Feather name="box" size={20} color={C.muted} />
              <Text style={s.linkerEmptyText}>No variables yet</Text>
              <Text style={s.linkerEmptyHint}>Add a variable in "Page variables", or set an alias on a query in Data Queries.</Text>
            </View>
          )}
          {tab === 'ITEM' && options.length === 0 && (
            <View style={s.linkerEmpty}>
              <Feather name="repeat" size={20} color={C.muted} />
              <Text style={s.linkerEmptyText}>No item fields yet</Text>
              <Text style={s.linkerEmptyHint}>Point to a $state variable that contains a list to see its fields here.</Text>
            </View>
          )}
          {tab === 'GLOBAL' && options.length === 0 && (
            <View style={s.linkerEmpty}>
              <Feather name="globe" size={20} color={C.muted} />
              <Text style={s.linkerEmptyText}>No global variables</Text>
              <Text style={s.linkerEmptyHint}>Add global variables in Project Settings → Global State.</Text>
            </View>
          )}
          {tab === 'NODES' && options.length === 0 && (
            <View style={s.linkerEmpty}>
              <Feather name="box" size={20} color={C.muted} />
              <Text style={s.linkerEmptyText}>No elements with props</Text>
              <Text style={s.linkerEmptyHint}>Add elements to the canvas to reference their values.</Text>
            </View>
          )}

          <FlatList
            data={options.slice(0, 100)}
            keyExtractor={(i, idx) => i.key + idx}
            style={s.linkerList}
            renderItem={({ item }) => {
              const isIndented = ['state-query-field', 'node-prop', 'global-field', 'item-child'].includes((item as any).type);
              const isHeader = (item as any).type === 'node-header';
              if (isHeader) {
                return (
                  <View style={s.linkerGroupHeader}>
                    <Feather name="box" size={9} color={item.color} />
                    <Text style={[s.linkerGroupLabel, { color: item.color }]}>{item.label}</Text>
                  </View>
                );
              }
              return (
                <Pressable style={[s.linkerItem, isIndented && s.linkerItemIndented]} onPress={() => onSelect(item.value)}>
                  <View style={[s.linkerDot, { backgroundColor: item.color }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.linkerKey}>{item.key}</Text>
                    <Text style={s.linkerLabel}>{item.label}</Text>
                  </View>
                  {(item as any).type === 'state-response' && (
                    <View style={s.responseBadge}><Text style={s.responseBadgeText}>response</Text></View>
                  )}
                  {(item as any).type === 'state-query' && (
                    <View style={s.queryAliasBadge}><Text style={s.queryAliasBadgeText}>alias</Text></View>
                  )}
                  {(item as any).type === 'node-prop' && (
                    <View style={s.nodePropBadge}><Text style={s.nodePropBadgeText}>node</Text></View>
                  )}
                </Pressable>
              );
            }}
          />
        </View>
      </Pressable>
    </Modal>
  );
};

export default SmartInput;

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  col: { marginBottom: 8 },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 },
  label: { color: C.muted, fontSize: 10, fontWeight: '500' },
  segRow: { gap: 3 },
  seg: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 4, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  segOn: { backgroundColor: C.primary, borderColor: C.primary },
  segText: { color: C.muted, fontSize: 9, fontWeight: '500' },
  segTextOn: { color: '#fff' },
  colorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 26, height: 26, borderRadius: 6, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  colorInput: { flex: 1, height: 26, backgroundColor: C.s2, borderRadius: 6, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 10, paddingHorizontal: 8 },
  numRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  numBtn: { width: 24, height: 24, borderRadius: 4, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  numInput: { width: 48, height: 24, backgroundColor: C.s2, borderRadius: 4, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 10, textAlign: 'center' },
  textInput: { height: 26, backgroundColor: C.s2, borderRadius: 6, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 10, paddingHorizontal: 8 },
  linkBtn: { width: 24, height: 24, borderRadius: 4, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  linkBtnActive: { backgroundColor: 'rgba(34,211,238,0.1)', borderColor: C.cyan },
  linkedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(59,130,246,0.2)' },
  linkedBadgeItem: { backgroundColor: 'rgba(34,211,238,0.08)', borderColor: 'rgba(34,211,238,0.25)' },
  linkedText: { color: C.primary, fontSize: 10, fontWeight: '600', flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  linkerCard: { width: 420, maxHeight: 520, backgroundColor: C.surface, borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  linkerHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  linkerTitle: { color: C.text, fontSize: 13, fontWeight: '600', flex: 1 },
  linkerPropType: { color: C.muted, fontSize: 9, backgroundColor: C.s2, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  linkerTabs: { gap: 3, paddingHorizontal: 10, paddingVertical: 6 },
  linkerTab: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 4, backgroundColor: C.s2 },
  linkerTabText: { color: C.muted, fontSize: 9, fontWeight: '600' },
  linkerTabTextOn: { color: '#fff' },
  linkerSearch: { height: 30, backgroundColor: C.s2, borderBottomWidth: 1, borderBottomColor: C.border, color: C.text, fontSize: 11, paddingHorizontal: 10 },
  linkerList: { maxHeight: 360 },
  linkerItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: C.border, gap: 8 },
  linkerItemMuted: { opacity: 0.55 },
  linkerDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  linkerKey: { color: C.text, fontSize: 10, fontWeight: '600' },
  linkerLabel: { color: C.muted, fontSize: 9 },
  linkerEmpty: { padding: 20, alignItems: 'center', gap: 6 },
  linkerEmptyText: { color: C.muted, fontSize: 12, fontWeight: '500' },
  linkerEmptyHint: { color: C.muted, fontSize: 10, textAlign: 'center', fontStyle: 'italic' },
  // Tab hint
  tabHint: { paddingHorizontal: 12, paddingVertical: 4, backgroundColor: 'rgba(255,255,255,0.03)', borderBottomWidth: 1, borderBottomColor: C.border },
  tabHintText: { color: C.muted, fontSize: 9, fontStyle: 'italic' },
  // Indented items (drill-down fields)
  linkerItemIndented: { paddingLeft: 24 },
  // Response badge
  responseBadge: { backgroundColor: 'rgba(249,115,22,0.15)', borderRadius: 3, paddingHorizontal: 5, paddingVertical: 1 },
  responseBadgeText: { color: '#f97316', fontSize: 8, fontWeight: '600' },
  // Query alias badge
  queryAliasBadge: { backgroundColor: 'rgba(6,182,212,0.15)', borderRadius: 3, paddingHorizontal: 5, paddingVertical: 1 },
  queryAliasBadgeText: { color: '#06b6d4', fontSize: 8, fontWeight: '600' },
  // Node prop badge
  nodePropBadge: { backgroundColor: 'rgba(249,115,22,0.15)', borderRadius: 3, paddingHorizontal: 5, paddingVertical: 1 },
  nodePropBadgeText: { color: '#f97316', fontSize: 8, fontWeight: '600' },
  // Node group header
  linkerGroupHeader: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 5, backgroundColor: 'rgba(249,115,22,0.06)', borderBottomWidth: 1, borderBottomColor: 'rgba(249,115,22,0.1)' },
  linkerGroupLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
});
