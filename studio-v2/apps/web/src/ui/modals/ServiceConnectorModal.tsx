/** ServiceConnectorModal — Configure API services (REST, GraphQL, Supabase, Firebase). */
import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStudio } from '../useStudio';
import ModalShell from './shared/ModalShell';
import { Field } from './shared/FormPrimitives';
import { colors, font, radius } from '../ds';
const C = colors;

const SERVICE_TYPES = ['rest', 'graphql', 'supabase', 'firebase', 'custom'] as const;
type ServiceType = typeof SERVICE_TYPES[number];

const TYPE_META: Record<ServiceType, { icon: React.ComponentProps<typeof Feather>['name']; color: string }> = {
  rest:     { icon: 'globe',    color: C.primary },
  graphql:  { icon: 'share-2', color: C.textSub },
  supabase: { icon: 'database', color: C.text },
  firebase: { icon: 'cloud',   color: C.muted },
  custom:   { icon: 'code',    color: C.muted },
};

function resolveUrl(baseUrl: string): string {
  if (!baseUrl || baseUrl.startsWith('http')) return baseUrl;
  if (Platform.OS === 'web' && typeof window !== 'undefined') return window.location.origin + baseUrl;
  return baseUrl;
}

interface Props { onClose: () => void; }

const ServiceConnectorModal: React.FC<Props> = ({ onClose }) => {
  const { project, updateProject } = useStudio();
  const services = project?.services || [];
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState({ id: '', type: 'rest' as ServiceType, name: '', baseUrl: '', apiKey: '', headers: '', fb_projectId: '', fb_authDomain: '', fb_databaseURL: '', fb_storageBucket: '' });
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const set = (patch: Partial<typeof form>) => setForm(f => ({ ...f, ...patch }));

  const reset = () => { setForm({ id: '', type: 'rest', name: '', baseUrl: '', apiKey: '', headers: '', fb_projectId: '', fb_authDomain: '', fb_databaseURL: '', fb_storageBucket: '' }); setTestStatus('idle'); };

  const startEdit = (idx: number) => {
    const svc = services[idx];
    setForm({ 
      id: svc.id, 
      type: svc.type as ServiceType, 
      name: svc.name, 
      baseUrl: String(svc.config?.baseUrl || ''), 
      apiKey: String(svc.config?.apiKey || ''), 
      headers: svc.config?.headers ? JSON.stringify(svc.config.headers) : '',
      fb_projectId: String(svc.config?.firebaseConfig?.projectId || ''),
      fb_authDomain: String(svc.config?.firebaseConfig?.authDomain || ''),
      fb_databaseURL: String(svc.config?.firebaseConfig?.databaseURL || ''),
      fb_storageBucket: String(svc.config?.firebaseConfig?.storageBucket || ''),
    });
    setEditIdx(idx); setTestStatus('idle');
  };

  const save = useCallback(() => {
    if (!form.name.trim()) return;
    const svc = { 
      id: form.id || form.name.toLowerCase().replace(/[^a-z0-9]/g, '_'), 
      type: form.type, 
      name: form.name, 
      config: { 
        baseUrl: form.baseUrl, 
        apiKey: form.apiKey, 
        ...(form.headers ? { headers: JSON.parse(form.headers) } : {}),
        ...(form.type === 'firebase' ? { 
          firebaseConfig: { projectId: form.fb_projectId, authDomain: form.fb_authDomain, databaseURL: form.fb_databaseURL, storageBucket: form.fb_storageBucket } 
        } : {})
      } 
    };
    const next = [...services];
    if (editIdx !== null) next[editIdx] = svc; else next.push(svc);
    updateProject({ services: next } as any);
    reset(); setEditIdx(null);
  }, [form, services, editIdx, updateProject]);

  const remove = (idx: number) => updateProject({ services: services.filter((_, i) => i !== idx) } as any);

  const test = async () => {
    if (form.type === 'firebase') { setTestStatus('ok'); return; } // Mock firebase success
    if (!form.baseUrl) return;
    setTestStatus('loading');
    try {
      const res = await fetch(resolveUrl(form.baseUrl), { signal: AbortSignal.timeout(5000) });
      setTestStatus(res.ok || res.status < 500 ? 'ok' : 'error');
    } catch { setTestStatus('error'); }
  };

  const addDemoApi = () => {
    updateProject({ services: [...services, {
      id: 'jsonplaceholder',
      type: 'rest',
      name: 'JSONPlaceholder (Demo)',
      config: { baseUrl: 'https://jsonplaceholder.typicode.com' }
    }] } as any);
  };

  return (
    <ModalShell title="Service Connectors" icon="cloud" onClose={onClose} width="80%" height="75%">
      <View style={s.body}>
        {/* Service list */}
        <View style={s.list}>
          <View style={s.listHeader}>
            <Text style={s.listTitle}>Your services</Text>
            <Text style={s.listHint}>Connect to APIs, databases, and backends</Text>
          </View>
          <ScrollView>
            {services.map((svc: any, i: number) => {
            const meta = TYPE_META[svc.type as ServiceType] || TYPE_META.custom;
            const isDemo = svc.id === 'placeholderApi';
            return (
              <Pressable key={svc.id + i} style={[s.svcRow, editIdx === i && s.svcRowOn]} onPress={() => startEdit(i)}>
                <Feather name={meta.icon} size={14} color={isDemo ? C.info : meta.color} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Text style={s.svcName}>{svc.name}</Text>
                    {isDemo && <View style={s.demoBadge}><Text style={s.demoText}>demo</Text></View>}
                  </View>
                  <Text style={s.svcUrl} numberOfLines={1}>{resolveUrl(svc.config?.baseUrl || '')}</Text>
                </View>
                <Pressable onPress={() => remove(i)} hitSlop={6}><Feather name="trash-2" size={12} color={C.error} /></Pressable>
              </Pressable>
            );
          })}
          {services.length === 0 && (
              <View style={s.emptyList}>
                <Feather name="cloud-off" size={24} color={C.muted} />
                <Text style={s.emptyTitle}>No services yet</Text>
                <Text style={s.emptyHint}>Add a service to connect your app to an API or backend. Fill in the form on the right to get started.</Text>
              </View>
            )}
          </ScrollView>
          <View style={{ flexDirection: 'row', gap: 8, padding: 8 }}>
            <Pressable style={[s.newBtn, { flex: 1, margin: 0 }]} onPress={() => { reset(); setEditIdx(null); }}>
              <Feather name="plus" size={12} color="#fff" />
              <Text style={s.newBtnText}>Add Service</Text>
            </Pressable>
            <Pressable style={[s.newBtn, { flex: 1, margin: 0, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border }]} onPress={addDemoApi}>
              <Feather name="zap" size={12} color={C.info} />
              <Text style={[s.newBtnText, { color: C.text }]}>Add Demo API</Text>
            </Pressable>
          </View>
        </View>

        {/* Form */}
        <View style={s.form}>
          <Text style={s.formTitle}>{editIdx !== null ? 'Edit Service' : 'Add a Service'}</Text>
          <Text style={s.formDesc}>
            A service is an API or backend your app talks to. Give it a name, choose its type, and enter the base URL.
          </Text>
          {/* Type selector */}
          <View style={s.typeRow}>
            {SERVICE_TYPES.map(type => {
              const meta = TYPE_META[type];
              const on = form.type === type;
              return (
                <Pressable key={type} style={[s.typeBtn, on && { backgroundColor: meta.color, borderColor: meta.color }]} onPress={() => set({ type })}>
                  <Feather name={meta.icon} size={12} color={on ? '#fff' : C.muted} />
                  <Text style={[s.typeText, on && s.typeTextOn]}>{type}</Text>
                </Pressable>
              );
            })}
          </View>
          <Field label="Name" value={form.name} onChange={(v: any) => set({ name: v })} placeholder="My API" />
          
          {form.type === 'supabase' && (
            <>
              <Field label="Supabase URL" value={form.baseUrl} onChange={(v: any) => { set({ baseUrl: v }); setTestStatus('idle'); }} placeholder="https://xyz.supabase.co" hint={form.baseUrl ? `→ ${resolveUrl(form.baseUrl)}` : undefined} />
              <Field label="Anon Key" value={form.apiKey} onChange={(v: any) => set({ apiKey: v })} placeholder="ey..." />
            </>
          )}

          {form.type === 'firebase' && (
            <>
              <Field label="Project ID" value={form.fb_projectId} onChange={(v: any) => set({ fb_projectId: v })} placeholder="my-project" />
              <Field label="Web API Key" value={form.apiKey} onChange={(v: any) => set({ apiKey: v })} placeholder="AIzaSy..." />
              <Field label="Auth Domain" value={form.fb_authDomain} onChange={(v: any) => set({ fb_authDomain: v })} placeholder="my-project.firebaseapp.com" />
              <Field label="Database URL" value={form.fb_databaseURL} onChange={(v: any) => set({ fb_databaseURL: v })} placeholder="https://my-project.firebaseio.com" />
              <Field label="Storage Bucket" value={form.fb_storageBucket} onChange={(v: any) => set({ fb_storageBucket: v })} placeholder="my-project.appspot.com" />
            </>
          )}

          {(form.type === 'rest' || form.type === 'graphql' || form.type === 'custom') && (
            <>
              <Field label={form.type === 'graphql' ? "Endpoint URL" : "Base URL"} value={form.baseUrl} onChange={(v: any) => { set({ baseUrl: v }); setTestStatus('idle'); }} placeholder="https://api.example.com" hint={form.baseUrl ? `→ ${resolveUrl(form.baseUrl)}` : undefined} />
              <Field label="API Key (optional)" value={form.apiKey} onChange={(v: any) => set({ apiKey: v })} placeholder="sk-..." />
              <Field label='Headers (JSON, optional)' value={form.headers} onChange={(v: any) => set({ headers: v })} placeholder='{"Authorization": "Bearer ..."}' />
            </>
          )}
          <View style={s.actions}>
            <Pressable style={[s.testBtn, testStatus === 'ok' && s.testOk, testStatus === 'error' && s.testErr]} onPress={test} disabled={!form.baseUrl || testStatus === 'loading'}>
              <Feather name={testStatus === 'ok' ? 'check' : testStatus === 'error' ? 'x' : 'wifi'} size={11} color="#fff" />
              <Text style={s.testText}>{testStatus === 'loading' ? 'Testing…' : testStatus === 'ok' ? 'Connected' : testStatus === 'error' ? 'Failed' : 'Test'}</Text>
            </Pressable>
            {editIdx !== null && <Pressable style={s.cancelBtn} onPress={() => { reset(); setEditIdx(null); }}><Text style={s.cancelText}>Cancel</Text></Pressable>}
            <Pressable style={s.saveBtn} onPress={save}><Text style={s.saveText}>{editIdx !== null ? 'Update' : 'Add'}</Text></Pressable>
          </View>
        </View>
      </View>
    </ModalShell>
  );
};

export default ServiceConnectorModal;

const s = StyleSheet.create({
  body: { flex: 1, flexDirection: 'row' },
  list: { flex: 1, borderRightWidth: 1, borderRightColor: C.border, flexDirection: 'column' },
  svcRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  svcRowOn: { backgroundColor: C.surface2 },
  svcName: { color: C.text, fontSize: (font?.size?.md || 12), fontWeight: (font?.weight?.bold || '600'), fontFamily: (font?.family || 'Lexend') },
  svcUrl: { color: C.muted, fontSize: (font?.size?.xxs || 8), fontFamily: 'monospace' as any, marginTop: 1 },
  demoBadge: { backgroundColor: C.surface2, borderRadius: (radius?.sm || 3), paddingHorizontal: 4, paddingVertical: 1 },
  demoText: { color: C.textSub, fontSize: (font?.size?.xxs || 8), fontWeight: (font?.weight?.bold || '600'), fontFamily: (font?.family || 'Lexend') },
  empty: { color: C.muted, fontSize: (font?.size?.md || 12), fontFamily: (font?.family || 'Lexend'), textAlign: 'center', padding: 20 },
  emptyList: { alignItems: 'center', gap: 8, padding: 24 },
  emptyTitle: { color: C.text, fontSize: (font?.size?.md || 12), fontWeight: (font?.weight?.bold || '600'), fontFamily: (font?.family || 'Lexend') },
  emptyHint: { color: C.muted, fontSize: (font?.size?.xs || 10), fontFamily: (font?.family || 'Lexend'), textAlign: 'center', lineHeight: 14 },
  listHeader: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  listTitle: { color: C.text, fontSize: (font?.size?.md || 12), fontWeight: (font?.weight?.bold || '600'), fontFamily: (font?.family || 'Lexend') },
  listHint: { color: C.muted, fontSize: (font?.size?.xxs || 8), fontFamily: (font?.family || 'Lexend'), marginTop: 2 },
  newBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: C.primary, margin: 8, borderRadius: (radius?.lg || 6), paddingVertical: 8 },
  newBtnText: { color: '#fff', fontSize: (font?.size?.sm || 11), fontWeight: (font?.weight?.bold || '600'), fontFamily: (font?.family || 'Lexend') },
  form: { flex: 1, padding: 16 },
  formTitle: { color: C.text, fontSize: (font?.size?.base || 13), fontWeight: (font?.weight?.bold || '600'), fontFamily: (font?.family || 'Lexend'), marginBottom: 4 },
  formDesc: { color: C.muted, fontSize: (font?.size?.xs || 10), fontFamily: (font?.family || 'Lexend'), lineHeight: 14, marginBottom: 12 },
  typeRow: { flexDirection: 'row', gap: 4, marginBottom: 12, flexWrap: 'wrap' },
  typeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: (radius?.lg || 6), backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border },
  typeText: { color: C.muted, fontSize: (font?.size?.xs || 10), fontWeight: (font?.weight?.semi || '500'), fontFamily: (font?.family || 'Lexend') },
  typeTextOn: { color: '#fff', fontFamily: (font?.family || 'Lexend') },
  actions: { flexDirection: 'row', gap: 8, marginTop: 8, justifyContent: 'flex-end', alignItems: 'center' },
  testBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: (radius?.lg || 6), backgroundColor: C.elevated },
  testOk: { backgroundColor: C.surface2 },
  testErr: { backgroundColor: C.surface },
  testText: { color: '#fff', fontSize: (font?.size?.xs || 10), fontWeight: (font?.weight?.bold || '600'), fontFamily: (font?.family || 'Lexend') },
  cancelBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: (radius?.lg || 6), backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border },
  cancelText: { color: C.muted, fontSize: (font?.size?.sm || 11), fontWeight: (font?.weight?.semi || '500'), fontFamily: (font?.family || 'Lexend') },
  saveBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: (radius?.lg || 6), backgroundColor: C.primary },
  saveText: { color: '#fff', fontSize: (font?.size?.sm || 11), fontWeight: (font?.weight?.bold || '600'), fontFamily: (font?.family || 'Lexend') },
});
