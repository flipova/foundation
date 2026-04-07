/** ProjectSettingsModal — App identity, navigation, status bar, auth, permissions, deep linking, constants. */
import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStudio } from '../../store/StudioProvider';
import { deriveScreenNames } from '../../../../engine/codegen/naming';
import ModalShell from './shared/ModalShell';
import { Field, Seg, Check, SectionTitle } from './shared/FormPrimitives';
import { C } from './shared/colors';
import IconPickerField from '../IconPickerField';

const SECTIONS = ['App', 'Navigation', 'Status Bar', 'Auth', 'Permissions', 'Deep Linking', 'Constants', 'Build'] as const;
type Section = typeof SECTIONS[number];

const GROUP_TYPES = ['tabs', 'stack', 'drawer', 'auth', 'protected', 'custom'] as const;
const ORIENTATIONS = ['portrait', 'landscape', 'auto'] as const;
const AUTH_PROVIDERS = ['supabase', 'firebase', 'custom'] as const;
const TRANSITIONS = ['default', 'fade', 'slide', 'modal', 'none'] as const;

const CAPABILITIES = [
  { id: 'camera',       label: 'Camera',           icon: 'camera'    as const, plugin: 'expo-camera' },
  { id: 'location',     label: 'Location',          icon: 'map-pin'   as const, plugin: 'expo-location' },
  { id: 'notifications',label: 'Push Notifications',icon: 'bell'      as const, plugin: 'expo-notifications' },
  { id: 'contacts',     label: 'Contacts',          icon: 'users'     as const, plugin: 'expo-contacts' },
  { id: 'biometrics',   label: 'Biometrics',        icon: 'lock'      as const, plugin: 'expo-local-authentication' },
  { id: 'haptics',      label: 'Haptics',           icon: 'zap'       as const, plugin: 'expo-haptics' },
  { id: 'imagePicker',  label: 'Image Picker',      icon: 'image'     as const, plugin: 'expo-image-picker' },
  { id: 'fileSystem',   label: 'File System',       icon: 'folder'    as const, plugin: 'expo-file-system' },
  { id: 'secureStore',  label: 'Secure Storage',    icon: 'shield'    as const, plugin: 'expo-secure-store' },
  { id: 'clipboard',    label: 'Clipboard',         icon: 'clipboard' as const, plugin: 'expo-clipboard' },
];

interface Props { onClose: () => void; }

const ProjectSettingsModal: React.FC<Props> = ({ onClose }) => {
  const { project, updateProject } = useStudio();
  const [section, setSection] = useState<Section>('App');
  const upd = useCallback((k: string, v: any) => { if (project) updateProject({ [k]: v } as any); }, [project, updateProject]);
  if (!project) return null;

  const renderContent = () => {
    switch (section) {
      case 'App': return (
        <ScrollView contentContainerStyle={sc.inner}>
          <SectionTitle>Identity</SectionTitle>
          <Field label="Display Name" value={project.name} onChange={v => upd('name', v)} />
          <Field label="Slug" value={(project as any).slug || ''} onChange={v => upd('slug', v)} placeholder="auto-derived" />
          <Field label="Bundle ID" value={(project as any).bundleId || ''} onChange={v => upd('bundleId', v)} placeholder="com.example.app" />
          <Field label="Version" value={project.version} onChange={v => upd('version', v)} />
          <SectionTitle mt={16}>Orientation</SectionTitle>
          <Seg options={ORIENTATIONS.map(o => ({ value: o, label: o }))} value={(project as any).orientation || 'portrait'} onChange={v => upd('orientation', v)} />
        </ScrollView>
      );

      case 'Navigation': {
        const screens = project.navigation?.screens || [];
        const screenGroups: any[] = (project as any).screenGroups || [];
        const updGroups = (groups: any[]) => upd('screenGroups', groups);
        return (
          <ScrollView contentContainerStyle={sc.inner}>
            <SectionTitle>Screen Groups</SectionTitle>
            <Text style={sc.hint}>Each group is a navigator. Change the type to switch between tabs, drawer, or stack. Screens always belong to exactly one group.</Text>
            {screenGroups.map((g: any, gi: number) => (
              <View key={g.id} style={sc.groupCard}>
                <View style={sc.groupCardHeader}>
                  <Feather name={g.type === 'auth' ? 'lock' : g.type === 'protected' ? 'shield' : g.type === 'tabs' ? 'grid' : g.type === 'drawer' ? 'menu' : 'layers'} size={13} color={C.primary} />
                  <Text style={sc.groupName}>{g.name}</Text>
                  <Text style={sc.groupScreenCount}>{(g.screenIds || []).length} screens</Text>
                  {gi > 0 && (
                    <Pressable onPress={() => updGroups(screenGroups.filter(x => x.id !== g.id))} hitSlop={6}>
                      <Feather name="trash-2" size={11} color={C.error} />
                    </Pressable>
                  )}
                </View>
                <Seg
                  options={GROUP_TYPES.map(t => ({ value: t, label: t }))}
                  value={g.type}
                  onChange={v => updGroups(screenGroups.map((x: any) => x.id === g.id ? { ...x, type: v } : x))}
                />
                {/* Screens in this group */}
                {(g.screenIds || []).map((sid: string) => {
                  const sc2 = screens.find((s: any) => s.pageId === sid);
                  const linked = project.pages?.find((p: any) => p.id === sid);
                  if (!linked) return null;
                  const names = deriveScreenNames(linked.name);
                  return (
                    <View key={sid} style={sc.screenInGroup}>
                      <View style={{ flex: 1 }}>
                        <Text style={sc.screenInGroupName}>{linked.name}</Text>
                        <Text style={sc.routeHint}>→ /{names.fileName}</Text>
                      </View>
                      {sc2 && (
                        <IconPickerField
                          value={sc2.icon || ''}
                          onChange={v => {
                            const next = screens.map((s: any) => s.pageId === sid ? { ...s, icon: v } : s);
                            upd('navigation', { ...project.navigation, screens: next });
                          }}
                        />
                      )}
                      {/* Move to another group */}
                      {screenGroups.length > 1 && (
                        <Pressable
                          style={sc.moveBtn}
                          onPress={() => {
                            const targetGroup = screenGroups[(gi + 1) % screenGroups.length];
                            updGroups(screenGroups.map((x: any) => {
                              if (x.id === g.id) return { ...x, screenIds: x.screenIds.filter((s: string) => s !== sid) };
                              if (x.id === targetGroup.id) return { ...x, screenIds: [...x.screenIds, sid] };
                              return x;
                            }));
                          }}
                        >
                          <Feather name="arrow-right-circle" size={13} color={C.muted} />
                        </Pressable>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        );
      }

      case 'Status Bar': {
        const sb = (project as any).statusBar || { style: 'auto', hidden: false, translucent: false };
        const tb = (project as any).tabBarConfig || {};
        return (
          <ScrollView contentContainerStyle={sc.inner}>
            <SectionTitle>Status Bar</SectionTitle>
            <Seg options={['auto', 'light', 'dark'].map(v => ({ value: v, label: v }))} value={sb.style || 'auto'} onChange={v => upd('statusBar', { ...sb, style: v })} />
            <Check label="Hidden" value={!!sb.hidden} onChange={v => upd('statusBar', { ...sb, hidden: v })} />
            <Check label="Translucent (Android)" value={!!sb.translucent} onChange={v => upd('statusBar', { ...sb, translucent: v })} />
            <Field label="Background Color" value={sb.backgroundColor || ''} onChange={v => upd('statusBar', { ...sb, backgroundColor: v })} placeholder="transparent" />
            <SectionTitle mt={16}>Tab Bar</SectionTitle>
            <Field label="Background Color" value={tb.backgroundColor || ''} onChange={v => upd('tabBarConfig', { ...tb, backgroundColor: v })} placeholder="$theme.card" />
            <Field label="Active Tint" value={tb.activeTintColor || ''} onChange={v => upd('tabBarConfig', { ...tb, activeTintColor: v })} placeholder="$theme.primary" />
            <Field label="Inactive Tint" value={tb.inactiveTintColor || ''} onChange={v => upd('tabBarConfig', { ...tb, inactiveTintColor: v })} placeholder="#8E8E93" />
            <Check label="Show Tab Labels" value={!!tb.showLabels} onChange={v => upd('tabBarConfig', { ...tb, showLabels: v })} />
          </ScrollView>
        );
      }

      case 'Auth': {
        const auth = (project as any).auth || { enabled: false, provider: 'supabase' };
        return (
          <ScrollView contentContainerStyle={sc.inner}>
            <SectionTitle>Authentication</SectionTitle>
            <Check label="Enable Authentication" value={!!auth.enabled} onChange={v => upd('auth', { ...auth, enabled: v })} />
            {auth.enabled && (
              <>
                <SectionTitle mt={12}>Provider</SectionTitle>
                <Seg options={AUTH_PROVIDERS.map(p => ({ value: p, label: p }))} value={auth.provider || 'supabase'} onChange={v => upd('auth', { ...auth, provider: v })} />
                <Field label="Service ID" value={auth.serviceId || ''} onChange={v => upd('auth', { ...auth, serviceId: v })} placeholder="Link to a configured service" />
                <Field label="Login Screen" value={auth.loginScreen || ''} onChange={v => upd('auth', { ...auth, loginScreen: v })} placeholder="login" />
                <Field label="Redirect After Login" value={auth.redirectAfterLogin || ''} onChange={v => upd('auth', { ...auth, redirectAfterLogin: v })} placeholder="home" />
              </>
            )}
          </ScrollView>
        );
      }

      case 'Permissions': {
        const caps: any[] = (project as any).capabilities || [];
        const toggle = (id: string) => {
          const existing = caps.find((c: any) => c.id === id);
          if (existing) upd('capabilities', caps.map((c: any) => c.id === id ? { ...c, enabled: !c.enabled } : c));
          else upd('capabilities', [...caps, { id, enabled: true }]);
        };
        return (
          <ScrollView contentContainerStyle={sc.inner}>
            <SectionTitle>Native Capabilities</SectionTitle>
            <Text style={sc.hint}>Adds required Expo plugins and permissions to the generated project.</Text>
            {CAPABILITIES.map(cap => {
              const enabled = caps.find((c: any) => c.id === cap.id)?.enabled || false;
              return (
                <Pressable key={cap.id} style={sc.capRow} onPress={() => toggle(cap.id)}>
                  <View style={[sc.checkbox, enabled && sc.checkboxOn]}>{enabled && <Feather name="check" size={10} color="#fff" />}</View>
                  <Feather name={cap.icon} size={14} color={enabled ? C.primary : C.muted} />
                  <View style={{ flex: 1 }}>
                    <Text style={[sc.capLabel, enabled && { color: C.text }]}>{cap.label}</Text>
                    <Text style={sc.capPlugin}>{cap.plugin}</Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        );
      }

      case 'Deep Linking': {
        const dl = (project as any).deepLinking || { scheme: '', prefixes: [] };
        const screens = project.navigation?.screens || [];
        return (
          <ScrollView contentContainerStyle={sc.inner}>
            <SectionTitle>Deep Linking</SectionTitle>
            <Field label="URL Scheme" value={dl.scheme || (project as any).slug || ''} onChange={v => upd('deepLinking', { ...dl, scheme: v })} placeholder="myapp" />
            <Field label="Universal Link Prefixes (comma-separated)" value={(dl.prefixes || []).join(', ')} onChange={v => upd('deepLinking', { ...dl, prefixes: v.split(',').map((s: string) => s.trim()).filter(Boolean) })} placeholder="https://myapp.com" />
            <SectionTitle mt={16}>Screen Routes & Transitions</SectionTitle>
            {screens.map((screen: any, i: number) => (
              <View key={screen.pageId + i} style={sc.routeRow}>
                <Text style={sc.routeName}>{screen.name}</Text>
                <TextInput style={sc.routeInput} value={(screen as any).route || '/' + screen.name.toLowerCase().replace(/[^a-z0-9]/g, '-')} onChangeText={v => { const next = [...screens]; (next[i] as any).route = v; upd('navigation', { ...project.navigation, screens: next }); }} placeholderTextColor={C.muted} />
                <View style={{ flexDirection: 'row', gap: 2, marginTop: 4 }}>
                  {TRANSITIONS.map(tr => {
                    const on = ((screen as any).transition || 'default') === tr;
                    return (
                      <Pressable key={tr} style={[sc.transBtn, on && sc.transBtnOn]} onPress={() => { const next = [...screens]; (next[i] as any).transition = tr; upd('navigation', { ...project.navigation, screens: next }); }}>
                        <Text style={[sc.transText, on && sc.transTextOn]}>{tr}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
        );
      }

      case 'Constants': {
        const constants: any[] = (project as any).constants || [];
        const envVars: any[] = (project as any).envVars || [];
        return (
          <ScrollView contentContainerStyle={sc.inner}>
            <SectionTitle>App Constants</SectionTitle>
            {constants.map((c: any, i: number) => (
              <View key={i} style={sc.kvRow}>
                <TextInput style={sc.kvInput} value={c.key} onChangeText={v => { const next = [...constants]; next[i] = { ...c, key: v }; upd('constants', next); }} placeholder="KEY" placeholderTextColor={C.muted} />
                <TextInput style={[sc.kvInput, { flex: 2 }]} value={c.value} onChangeText={v => { const next = [...constants]; next[i] = { ...c, value: v }; upd('constants', next); }} placeholder="value" placeholderTextColor={C.muted} />
                <Pressable onPress={() => upd('constants', constants.filter((_: any, j: number) => j !== i))} style={sc.actionBtn}><Feather name="x" size={12} color={C.error} /></Pressable>
              </View>
            ))}
            <Pressable style={sc.addBtn} onPress={() => upd('constants', [...constants, { key: '', value: '' }])}>
              <Feather name="plus" size={12} color={C.primary} /><Text style={sc.addBtnText}>Add Constant</Text>
            </Pressable>
            <SectionTitle mt={20}>Environment Variables</SectionTitle>
            {envVars.map((e: any, i: number) => (
              <View key={i} style={sc.kvRow}>
                <TextInput style={sc.kvInput} value={e.key} onChangeText={v => { const next = [...envVars]; next[i] = { ...e, key: v }; upd('envVars', next); }} placeholder="KEY" placeholderTextColor={C.muted} />
                <TextInput style={[sc.kvInput, { flex: 2 }]} value={e.value} onChangeText={v => { const next = [...envVars]; next[i] = { ...e, value: v }; upd('envVars', next); }} placeholder="value" placeholderTextColor={C.muted} />
                <Pressable onPress={() => upd('envVars', envVars.filter((_: any, j: number) => j !== i))} style={sc.actionBtn}><Feather name="x" size={12} color={C.error} /></Pressable>
              </View>
            ))}
            <Pressable style={sc.addBtn} onPress={() => upd('envVars', [...envVars, { key: '', value: '', secret: false }])}>
              <Feather name="plus" size={12} color={C.primary} /><Text style={sc.addBtnText}>Add Env Var</Text>
            </Pressable>
          </ScrollView>
        );
      }

      case 'Build':
        return (
          <ScrollView contentContainerStyle={sc.inner}>
            <SectionTitle>Build Configuration</SectionTitle>
            <Field label="Version" value={project.version} onChange={v => upd('version', v)} />
            <Field label="Bundle ID (iOS)" value={(project as any).bundleId || ''} onChange={v => upd('bundleId', v)} placeholder="com.example.app" />
            <Seg options={ORIENTATIONS.map(o => ({ value: o, label: o }))} value={(project as any).orientation || 'portrait'} onChange={v => upd('orientation', v)} />
          </ScrollView>
        );

      default:
        return <View style={sc.placeholder}><Text style={sc.placeholderText}>{section} coming soon</Text></View>;
    }
  };

  return (
    <ModalShell title="Project Settings" onClose={onClose} width="90%" height="85%">
      <View style={sc.body}>
        <View style={sc.sidebar}>
          {SECTIONS.map(sec => (
            <Pressable key={sec} style={[sc.sidebarItem, section === sec && sc.sidebarItemOn]} onPress={() => setSection(sec)}>
              <Text style={[sc.sidebarText, section === sec && sc.sidebarTextOn]}>{sec}</Text>
            </Pressable>
          ))}
        </View>
        <View style={{ flex: 1 }}>{renderContent()}</View>
      </View>
    </ModalShell>
  );
};

export default ProjectSettingsModal;

const sc = StyleSheet.create({
  body: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 160, backgroundColor: C.bg, borderRightWidth: 1, borderRightColor: C.border, paddingTop: 12 },
  sidebarItem: { paddingHorizontal: 14, paddingVertical: 9 },
  sidebarItemOn: { backgroundColor: C.s2, borderLeftWidth: 2, borderLeftColor: C.primary },
  sidebarText: { color: C.muted, fontSize: 12 },
  sidebarTextOn: { color: C.text, fontWeight: '600' },
  inner: { padding: 20 },
  hint: { color: C.muted, fontSize: 11, marginBottom: 12 },
  emptyHint: { color: C.muted, fontSize: 11, fontStyle: 'italic', marginBottom: 12 },
  // Navigation — group cards
  groupCard: { backgroundColor: C.s2, borderRadius: 8, borderWidth: 1, borderColor: C.border, marginBottom: 12, padding: 12, gap: 8 },
  groupCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  groupName: { flex: 1, color: C.text, fontSize: 12, fontWeight: '600' },
  groupScreenCount: { color: C.muted, fontSize: 10 },
  screenInGroup: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: C.border },
  screenInGroupName: { color: C.text, fontSize: 11, fontWeight: '500' },
  routeHint: { color: C.muted, fontSize: 9 },
  moveBtn: { padding: 4 },
  // Legacy styles kept for other sections
  screenRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border, gap: 8 },
  screenInput: { height: 30, backgroundColor: C.s2, borderRadius: 6, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 12, paddingHorizontal: 8 },
  groupBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  groupBadgeText: { fontSize: 9, fontWeight: '600' },
  groupRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  groupScreens: { color: C.muted, fontSize: 9, marginTop: 2 },
  actionBtn: { width: 26, height: 26, borderRadius: 4, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  addRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  addBtnText: { color: C.primary, fontSize: 11, fontWeight: '500' },
  // Permissions
  capRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: C.border, backgroundColor: C.s2, alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: C.primary, borderColor: C.primary },
  capLabel: { color: C.muted, fontSize: 12, fontWeight: '500' },
  capPlugin: { color: C.muted, fontSize: 9, opacity: 0.6 },
  // Deep linking
  routeRow: { marginBottom: 12 },
  routeName: { color: C.text, fontSize: 12, fontWeight: '500', marginBottom: 4 },
  routeInput: { height: 28, backgroundColor: C.s2, borderRadius: 6, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 11, paddingHorizontal: 8 },
  transBtn: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  transBtnOn: { backgroundColor: C.primary, borderColor: C.primary },
  transText: { color: C.muted, fontSize: 9, fontWeight: '500' },
  transTextOn: { color: '#fff' },
  // Constants
  kvRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  kvInput: { flex: 1, height: 28, backgroundColor: C.s2, borderRadius: 6, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 11, paddingHorizontal: 8 },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: C.muted, fontSize: 13 },
});
