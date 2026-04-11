/**
 * DataQueryModal — Modern query manager with live data preview.
 * Copies $state.alias.field paths. Never mixes response state with body params.
 */
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStudio, DataQuery } from '../../store/StudioProvider';
import ModalShell from './shared/ModalShell';
import { Field, Check } from './shared/FormPrimitives';
import { C, METHOD_COLORS } from './shared/colors';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;
interface Props { onClose: () => void; }

// JSON tree viewer with copy-to-$state
const DataNode: React.FC<{ k: string; v: any; depth: number; path: string; onCopy: (p: string) => void }> = ({ k, v, depth, path, onCopy }) => {
  const [open, setOpen] = useState(depth < 2);
  const isObj = v !== null && typeof v === 'object';
  const isArr = Array.isArray(v);
  const entries: [string, any][] = isObj ? (isArr ? v.map((x: any, i: number) => [String(i), x]) : Object.entries(v)) : [];
  const preview = isArr ? `[${v.length}]` : isObj ? `{${Object.keys(v).length}}` : JSON.stringify(v);
  const tc = isArr ? C.warn : isObj ? C.cyan : typeof v === 'boolean' ? C.accent : typeof v === 'number' ? C.success : C.text;
  return (
    <View>
      <Pressable style={[t.row, { paddingLeft: 8 + depth * 12 }]} onPress={() => isObj ? setOpen(o => !o) : onCopy(path)}>
        {isObj ? <Feather name={open ? 'chevron-down' : 'chevron-right'} size={9} color={C.muted} style={{ marginRight: 3 }} /> : <View style={{ width: 12 }} />}
        <Text style={t.key}>{k}</Text><Text style={t.colon}>: </Text>
        <Text style={[t.val, { color: tc }]} numberOfLines={1}>{preview}</Text>
        <Pressable onPress={() => onCopy(path)} hitSlop={6} style={t.copy}><Feather name="copy" size={8} color={C.muted} /></Pressable>
      </Pressable>
      {isObj && open && entries.map(([ek, ev]) => <DataNode key={ek} k={ek} v={ev} depth={depth + 1} path={`${path}.${ek}`} onCopy={onCopy} />)}
    </View>
  );
};

const QueryPreview: React.FC<{ query: DataQuery; baseUrl: string; onCopied: (e: string) => void }> = ({ query, baseUrl, onCopied }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const run = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true); setError(null);
    try {
      let url = baseUrl.replace(/\/$/, '') + query.path;
      const q = query as any;
      if (q.params) url += (url.includes('?') ? '&' : '?') + Object.entries(q.params).map(([a, b]) => `${a}=${b}`).join('&');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (q.headers) Object.assign(headers, q.headers);
      const opts: RequestInit = { method: query.method, headers };
      if (q.body && query.method !== 'GET') opts.body = JSON.stringify(q.body);
      const res = await fetch(url, opts);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      setData(await res.json());
    } catch (e: any) { setError(e.message || 'Request failed'); }
    finally { setLoading(false); }
  }, [query, baseUrl]);

  useEffect(() => { run(); }, []);

  const handleCopy = (path: string) => {
    const alias = query.alias || query.name;
    const rest = path.replace(/^root/, '').replace(/\.(\d+)/g, '[$1]');
    const expr = `$state.${alias}${rest}`;
    onCopied(expr); setFlash(expr); setTimeout(() => setFlash(null), 2000);
  };

  return (
    <View style={pv.root}>
      <View style={pv.header}>
        <View style={[pv.badge, { backgroundColor: METHOD_COLORS[query.method] || C.primary }]}><Text style={pv.badgeText}>{query.method}</Text></View>
        <Text style={pv.url} numberOfLines={1}>{baseUrl}{query.path}</Text>
        {query.alias && <View style={pv.aliasBadge}><Text style={pv.aliasText}>→ $state.{query.alias}</Text></View>}
        <Pressable onPress={run} style={pv.runBtn} disabled={loading}>
          {loading ? <ActivityIndicator size={10} color="#fff" /> : <Feather name="play" size={10} color="#fff" />}
        </Pressable>
      </View>
      {flash && <View style={pv.flash}><Feather name="check" size={10} color={C.success} /><Text style={pv.flashText}>{flash}</Text></View>}
      {error && <View style={pv.err}><Feather name="alert-circle" size={10} color={C.error} /><Text style={pv.errText}>{error}</Text></View>}
      {data !== null && !error ? (
        <ScrollView style={pv.tree}>
          <Text style={pv.hint}>Tap a key to copy its $state expression</Text>
          <DataNode k="root" v={data} depth={0} path="root" onCopy={handleCopy} />
        </ScrollView>
      ) : !error && !loading ? (
        <View style={pv.empty}><Text style={pv.emptyText}>Press ▶ to fetch data</Text></View>
      ) : null}
    </View>
  );
};

const DataQueryModal: React.FC<Props> = ({ onClose }) => {
  const { project, addQuery, updateQuery, removeQuery } = useStudio();
  const queries = project?.queries || [];
  const services = project?.services || [];
  const [editId, setEditId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(queries[0]?.id || null);
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const [copied, setCopied] = useState<string | null>(null);
  const blank = { name: '', serviceId: services[0]?.id || '', method: 'GET', path: '', body: '', params: '', headers: '', transform: '', autoFetch: true, alias: '' };
  const [form, setForm] = useState(blank);
  const set = (p: Partial<typeof blank>) => setForm(f => ({ ...f, ...p }));

  const startEdit = (q: DataQuery) => {
    setForm({ name: q.name, serviceId: q.serviceId, method: q.method, path: q.path, body: (q as any).body ? JSON.stringify((q as any).body, null, 2) : '', params: (q as any).params ? Object.entries((q as any).params).map(([a, b]) => `${a}=${b}`).join('&') : '', headers: (q as any).headers ? JSON.stringify((q as any).headers) : '', transform: q.transform || '', autoFetch: q.autoFetch !== false, alias: q.alias || '' });
    setEditId(q.id); setActiveId(q.id); setTab('edit');
  };

  const save = useCallback(() => {
    if (!form.name.trim() || !form.serviceId) return;
    const { normalizeQueryName } = require('../../../../engine/codegen/naming');
    const name = normalizeQueryName(form.name.trim());
    const alias = form.alias.trim() || name;
    const q: any = { id: editId || 'q_' + Date.now(), name, serviceId: form.serviceId, method: form.method, path: form.path, transform: form.transform || undefined, autoFetch: form.autoFetch, alias };
    if (form.body) { try { q.body = JSON.parse(form.body); } catch {} }
    if (form.params) q.params = Object.fromEntries(form.params.split('&').filter(Boolean).map((p: string) => p.split('=')));
    if (form.headers) { try { q.headers = JSON.parse(form.headers); } catch {} }
    if (editId) updateQuery(editId, q); else addQuery(q);
    setForm(blank); setEditId(null); setActiveId(q.id);
  }, [form, editId, addQuery, updateQuery]);

  const activeQuery = queries.find(q => q.id === activeId);
  const activeSvc = activeQuery ? services.find((sv: any) => sv.id === activeQuery.serviceId) : null;
  const baseUrl = (activeSvc?.config as any)?.baseUrl || '';
  const needsBody = form.method === 'POST' || form.method === 'PUT' || form.method === 'PATCH';

  return (
    <ModalShell title="Data Queries" icon="database" onClose={onClose} width="90%" height="85%"
      headerRight={copied ? <View style={m.copiedBadge}><Feather name="link" size={9} color={C.cyan} /><Text style={m.copiedText} numberOfLines={1}>{copied}</Text></View> : undefined}>
      <View style={m.body}>
        {/* Sidebar */}
        <View style={m.sidebar}>
          <ScrollView>
            {queries.map(q => {
              const svc = services.find((sv: any) => sv.id === q.serviceId);
              const on = q.id === activeId;
              return (
                <Pressable key={q.id} style={[m.qRow, on && m.qRowOn]} onPress={() => { setActiveId(q.id); setTab('preview'); }}>
                  <View style={[m.dot, { backgroundColor: METHOD_COLORS[q.method] || C.primary }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[m.qName, on && { color: C.primary }]}>{q.name}</Text>
                    <Text style={m.qMeta}>{(svc as any)?.name || q.serviceId} · {q.path}</Text>
                    {q.alias && <Text style={m.qAlias}>→ $state.{q.alias}</Text>}
                  </View>
                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    <Pressable onPress={() => startEdit(q)} hitSlop={6}><Feather name="edit-2" size={10} color={C.muted} /></Pressable>
                    <Pressable onPress={() => removeQuery(q.id)} hitSlop={6}><Feather name="trash-2" size={10} color={C.error} /></Pressable>
                  </View>
                </Pressable>
              );
            })}
            {queries.length === 0 && <Text style={m.emptyList}>No queries yet</Text>}
          </ScrollView>
          <Pressable style={m.newBtn} onPress={() => { setForm(blank); setEditId(null); setTab('edit'); setActiveId(null); }}>
            <Feather name="plus" size={12} color="#fff" /><Text style={m.newBtnText}>New Query</Text>
          </Pressable>
        </View>
        {/* Main */}
        <View style={m.main}>
          <View style={m.tabBar}>
            {(['edit', 'preview'] as const).map(tb => (
              <Pressable key={tb} style={[m.tabBtn, tab === tb && m.tabBtnOn]} onPress={() => setTab(tb)}>
                <Feather name={tb === 'edit' ? 'edit-3' : 'eye'} size={11} color={tab === tb ? '#fff' : C.muted} />
                <Text style={[m.tabText, tab === tb && m.tabTextOn]}>{tb === 'edit' ? 'Configure' : 'Preview Data'}</Text>
              </Pressable>
            ))}
          </View>
          {tab === 'edit' ? (
            <ScrollView style={m.form} contentContainerStyle={{ padding: 16 }}>
              <Field label="Name" value={form.name} onChange={v => set({ name: v })} placeholder="getUsers" />
              <View style={m.field}>
                <Text style={m.fieldLabel}>Service</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 4 }}>
                  {services.map((svc: any) => (
                    <Pressable key={svc.id} style={[m.svcBtn, form.serviceId === svc.id && m.svcBtnOn]} onPress={() => set({ serviceId: svc.id })}>
                      <Text style={[m.svcText, form.serviceId === svc.id && m.svcTextOn]}>{svc.name}</Text>
                    </Pressable>
                  ))}
                  {services.length === 0 && <Text style={m.noSvc}>Add a service first</Text>}
                </ScrollView>
              </View>
              <View style={m.field}>
                <Text style={m.fieldLabel}>Method</Text>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  {METHODS.map(method => (
                    <Pressable key={method} style={[m.methodBtn, form.method === method && { backgroundColor: METHOD_COLORS[method] }]} onPress={() => set({ method })}>
                      <Text style={[m.methodText, form.method === method && { color: '#fff' }]}>{method}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <Field label="Path" value={form.path} onChange={v => set({ path: v })} placeholder="/users" />
              {needsBody && <Field label="Request Body (JSON)" value={form.body} onChange={v => set({ body: v })} placeholder={'{"key": "value"}'} multiline height={64} mono />}
              {!needsBody && <Field label="Query Params" value={form.params} onChange={v => set({ params: v })} placeholder="limit=10&offset=0" />}
              <Field label="Headers (JSON, optional)" value={form.headers} onChange={v => set({ headers: v })} placeholder='{"Authorization": "Bearer ..."}' />
              <Field label="Transform (optional)" value={form.transform} onChange={v => set({ transform: v })} placeholder="data.results" hint="Dot-path to extract from response" />
              <Check label="Auto-fetch on mount" value={form.autoFetch} onChange={v => set({ autoFetch: v })} />
              <View style={m.aliasBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Feather name="box" size={12} color={C.pink} />
                  <Text style={[m.fieldLabel, { color: C.pink, marginBottom: 0 }]}>State Alias</Text>
                  <Text style={m.aliasExpr}>→ $state.{form.alias || form.name || 'alias'}</Text>
                </View>
                <TextInput style={m.aliasInput} value={form.alias} onChangeText={v => set({ alias: v })} placeholder={form.name || 'users'} placeholderTextColor={C.muted} />
                <Text style={m.aliasDesc}>Response stored in $state.{form.alias || form.name || 'alias'}. {form.autoFetch ? 'Auto-fetched on mount.' : 'Triggered via callApi action.'}</Text>
              </View>
              <View style={m.formActions}>
                {editId && <Pressable style={m.cancelBtn} onPress={() => { setForm(blank); setEditId(null); }}><Text style={m.cancelText}>Cancel</Text></Pressable>}
                <Pressable style={m.saveBtn} onPress={save}><Text style={m.saveText}>{editId ? 'Update' : 'Add Query'}</Text></Pressable>
              </View>
            </ScrollView>
          ) : activeQuery ? (
            <QueryPreview query={activeQuery} baseUrl={baseUrl} onCopied={e => setCopied(e)} />
          ) : (
            <View style={m.emptyMain}><Feather name="database" size={28} color={C.muted} /><Text style={m.emptyList}>Select a query to preview</Text></View>
          )}
        </View>
      </View>
    </ModalShell>
  );
};

export default DataQueryModal;

const m = StyleSheet.create({
  body: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 220, borderRightWidth: 1, borderRightColor: C.border },
  qRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: C.border },
  qRowOn: { backgroundColor: C.s2 },
  dot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  qName: { color: C.text, fontSize: 11, fontWeight: '600' },
  qMeta: { color: C.muted, fontSize: 9 },
  qAlias: { color: C.pink, fontSize: 8, fontFamily: 'monospace' as any },
  emptyList: { color: C.muted, fontSize: 11, textAlign: 'center', padding: 16 },
  newBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: C.primary, margin: 8, borderRadius: 6, paddingVertical: 8 },
  newBtnText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  main: { flex: 1 },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 9 },
  tabBtnOn: { backgroundColor: C.s2, borderBottomWidth: 2, borderBottomColor: C.primary },
  tabText: { color: C.muted, fontSize: 11, fontWeight: '500' },
  tabTextOn: { color: C.text },
  form: { flex: 1 },
  field: { marginBottom: 10 },
  fieldLabel: { color: C.muted, fontSize: 11, marginBottom: 3 },
  svcBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  svcBtnOn: { backgroundColor: C.primary, borderColor: C.primary },
  svcText: { color: C.muted, fontSize: 10, fontWeight: '500' },
  svcTextOn: { color: '#fff' },
  noSvc: { color: C.muted, fontSize: 10, fontStyle: 'italic' },
  methodBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  methodText: { color: C.muted, fontSize: 10, fontWeight: '600' },
  aliasBox: { backgroundColor: 'rgba(236,72,153,0.06)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(236,72,153,0.2)', padding: 10, marginBottom: 12 },
  aliasExpr: { color: C.pink, fontSize: 9, fontFamily: 'monospace' as any, flex: 1 },
  aliasInput: { height: 30, backgroundColor: C.bg, borderRadius: 6, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 12, paddingHorizontal: 8 },
  aliasDesc: { color: C.muted, fontSize: 9, marginTop: 5, fontStyle: 'italic' },
  formActions: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end', marginTop: 4 },
  cancelBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  cancelText: { color: C.muted, fontSize: 11, fontWeight: '500' },
  saveBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6, backgroundColor: C.primary },
  saveText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  emptyMain: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  copiedBadge: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(6,182,212,0.1)', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, marginHorizontal: 8 },
  copiedText: { color: C.cyan, fontSize: 10, fontFamily: 'monospace' as any, flex: 1 },
});
const pv = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  badge: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3 },
  badgeText: { color: '#fff', fontSize: 8, fontWeight: '700' },
  url: { flex: 1, color: C.muted, fontSize: 10, fontFamily: 'monospace' as any },
  aliasBadge: { backgroundColor: 'rgba(236,72,153,0.12)', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  aliasText: { color: C.pink, fontSize: 9, fontFamily: 'monospace' as any },
  runBtn: { width: 26, height: 26, borderRadius: 6, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  flash: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(34,197,94,0.1)', padding: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(34,197,94,0.2)' },
  flashText: { color: C.success, fontSize: 10, fontFamily: 'monospace' as any },
  err: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(239,68,68,0.1)', padding: 8 },
  errText: { color: C.error, fontSize: 10 },
  tree: { flex: 1 },
  hint: { color: C.muted, fontSize: 9, fontStyle: 'italic', padding: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: C.muted, fontSize: 11 },
});
const t = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingRight: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(26,34,64,0.4)' },
  key: { color: C.cyan, fontSize: 10, fontWeight: '600', fontFamily: 'monospace' as any },
  colon: { color: C.muted, fontSize: 10 },
  val: { flex: 1, fontSize: 10, fontFamily: 'monospace' as any },
  copy: { padding: 3 },
});
