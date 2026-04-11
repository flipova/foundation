/** ThemeEditorModal — Theme selection, color role overrides, token browser. */
import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStudio, TOKENS, AVAILABLE_THEMES, getThemeColors } from '../../store/StudioProvider';
import ModalShell from './shared/ModalShell';
import { C } from './shared/colors';

const SECTIONS = [
  { key: 'theme',      label: 'Theme',      icon: 'sun'       as const },
  { key: 'colors',     label: 'Colors',     icon: 'droplet'   as const },
  { key: 'spacing',    label: 'Spacing',    icon: 'maximize'  as const },
  { key: 'radii',      label: 'Radii',      icon: 'square'    as const },
  { key: 'typography', label: 'Typography', icon: 'type'      as const },
  { key: 'shadows',    label: 'Shadows',    icon: 'layers'    as const },
  { key: 'opacity',    label: 'Opacity',    icon: 'eye'       as const },
  { key: 'motion',     label: 'Motion',     icon: 'zap'       as const },
  { key: 'zIndex',     label: 'Z-Index',    icon: 'git-merge' as const },
  { key: 'overrides',  label: 'Overrides',  icon: 'edit-3'    as const },
];

interface Props { onClose: () => void; }

const TokenGrid: React.FC<{ entries: [string, any][]; prefix: string; unit?: string }> = ({ entries, prefix, unit }) => (
  <View style={s.tokenGrid}>
    {entries.map(([k, v]) => (
      <View key={k} style={s.tokenItem}>
        <Text style={s.tokenKey}>{k}</Text>
        <Text style={s.tokenVal}>{v}{unit || ''}</Text>
        <Text style={s.tokenPath}>${prefix}.{k}</Text>
      </View>
    ))}
  </View>
);

const ThemeEditorModal: React.FC<Props> = ({ onClose }) => {
  const { project, updateProject } = useStudio();
  const [section, setSection] = useState('theme');
  const theme = project?.theme || 'light';
  const themeColors = getThemeColors(theme);
  const overrides: Record<string, string> = (project as any)?.themeOverrides?.[theme] ?? {};

  const setTheme = useCallback((t: string) => updateProject({ theme: t } as any), [updateProject]);

  const setOverride = useCallback((key: string, val: string) => {
    if (!project) return;
    const prev = (project as any).themeOverrides ?? {};
    updateProject({ themeOverrides: { ...prev, [theme]: { ...(prev[theme] ?? {}), [key]: val } } });
  }, [project, theme, updateProject]);

  const renderContent = () => {
    switch (section) {
      case 'theme':
        return (
          <>
            <Text style={s.title}>Select Theme</Text>
            <Text style={s.hint}>Colors adapt automatically across all components.</Text>
            <View style={s.themeGrid}>
              {AVAILABLE_THEMES.map(t => {
                const tc = getThemeColors(t);
                const on = theme === t;
                return (
                  <Pressable key={t} style={[s.themeCard, on && s.themeCardOn]} onPress={() => setTheme(t)}>
                    <View style={s.themeSwatches}>
                      {(['primary', 'secondary', 'background'] as const).map(role => (
                        <View key={role} style={[s.themeSwatch, { backgroundColor: (tc as any)[role] || '#333' }]} />
                      ))}
                    </View>
                    <Text style={[s.themeName, on && s.themeNameOn]}>{t}</Text>
                    {on && <Feather name="check-circle" size={12} color={C.primary} />}
                  </Pressable>
                );
              })}
            </View>
          </>
        );

      case 'colors':
        return (
          <>
            <Text style={s.title}>Color Roles — {theme}</Text>
            <View style={s.colorGrid}>
              {Object.entries(themeColors).map(([role, color]) => (
                <View key={role} style={s.colorItem}>
                  <View style={[s.colorSwatch, { backgroundColor: overrides[role] || color }]} />
                  <Text style={s.colorLabel}>{role}</Text>
                  <TextInput style={s.colorInput} value={overrides[role] || color} onChangeText={v => setOverride(role, v)} placeholderTextColor={C.muted} />
                </View>
              ))}
            </View>
          </>
        );

      case 'spacing':    return <><Text style={s.title}>Spacing</Text><TokenGrid entries={Object.entries(TOKENS.spacing)} prefix="spacing" unit="px" /></>;
      case 'radii':      return <><Text style={s.title}>Border Radii</Text><TokenGrid entries={Object.entries(TOKENS.radii)} prefix="radii" /></>;
      case 'typography': return (
        <>
          <Text style={s.title}>Font Sizes</Text><TokenGrid entries={Object.entries(TOKENS.fontSizes)} prefix="fontSize" unit="px" />
          <Text style={[s.title, { marginTop: 16 }]}>Font Weights</Text><TokenGrid entries={Object.entries(TOKENS.fontWeights)} prefix="fontWeight" />
          <Text style={[s.title, { marginTop: 16 }]}>Line Heights</Text><TokenGrid entries={Object.entries(TOKENS.lineHeights)} prefix="lineHeight" />
        </>
      );
      case 'shadows':    return <><Text style={s.title}>Shadows</Text><TokenGrid entries={Object.entries(TOKENS.shadows).map(([k]) => [k, '●'])} prefix="shadow" /></>;
      case 'opacity':    return <><Text style={s.title}>Opacity</Text><TokenGrid entries={Object.entries(TOKENS.opacity)} prefix="opacity" /></>;
      case 'motion':     return <><Text style={s.title}>Durations</Text><TokenGrid entries={Object.entries(TOKENS.durations)} prefix="duration" unit="ms" /></>;
      case 'zIndex':     return <><Text style={s.title}>Z-Index</Text><TokenGrid entries={Object.entries(TOKENS.zIndices)} prefix="zIndex" /></>;
      case 'overrides':
        return (
          <>
            <Text style={s.title}>Overrides — {theme}</Text>
            {Object.keys(overrides).length > 0 ? (
              <View style={s.tokenGrid}>
                {Object.entries(overrides).map(([k, v]) => (
                  <View key={k} style={s.tokenItem}>
                    <View style={[s.miniSwatch, { backgroundColor: v }]} />
                    <Text style={s.tokenKey}>{k}</Text>
                    <Text style={s.tokenVal}>{v}</Text>
                  </View>
                ))}
              </View>
            ) : <Text style={s.hint}>No overrides. Edit colors in the Colors section.</Text>}
          </>
        );
      default: return null;
    }
  };

  return (
    <ModalShell
      title="Design Tokens & Theme"
      icon="droplet"
      onClose={onClose}
      width="92%"
      height="88%"
      headerRight={<View style={s.themeBadge}><Text style={s.themeBadgeText}>{theme}</Text></View>}
    >
      <View style={s.body}>
        <ScrollView style={s.sidebar}>
          {SECTIONS.map(sec => (
            <Pressable key={sec.key} style={[s.sidebarItem, section === sec.key && s.sidebarItemOn]} onPress={() => setSection(sec.key)}>
              <Feather name={sec.icon} size={12} color={section === sec.key ? C.primary : C.muted} />
              <Text style={[s.sidebarText, section === sec.key && s.sidebarTextOn]}>{sec.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <ScrollView style={s.content} contentContainerStyle={{ padding: 20 }}>
          {renderContent()}
        </ScrollView>
      </View>
    </ModalShell>
  );
};

export default ThemeEditorModal;

const s = StyleSheet.create({
  body: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 160, backgroundColor: C.bg, borderRightWidth: 1, borderRightColor: C.border, paddingTop: 8 },
  sidebarItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 9 },
  sidebarItemOn: { backgroundColor: C.s2, borderLeftWidth: 2, borderLeftColor: C.primary },
  sidebarText: { color: C.muted, fontSize: 11 },
  sidebarTextOn: { color: C.text, fontWeight: '600' },
  content: { flex: 1 },
  title: { color: C.text, fontSize: 14, fontWeight: '600', marginBottom: 12 },
  hint: { color: C.muted, fontSize: 11, marginBottom: 12 },
  themeBadge: { backgroundColor: C.primary, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  themeBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  // Theme grid
  themeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  themeCard: { width: 120, backgroundColor: C.s2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 10, alignItems: 'center', gap: 6 },
  themeCardOn: { borderColor: C.primary, borderWidth: 2 },
  themeSwatches: { flexDirection: 'row', gap: 4 },
  themeSwatch: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: C.border },
  themeName: { color: C.muted, fontSize: 11, fontWeight: '500', textTransform: 'capitalize' as any },
  themeNameOn: { color: C.primary, fontWeight: '700' },
  // Color grid
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorItem: { width: 95, alignItems: 'center', gap: 3 },
  colorSwatch: { width: 40, height: 40, borderRadius: 8, borderWidth: 1, borderColor: C.border },
  colorLabel: { color: C.muted, fontSize: 9, textAlign: 'center' },
  colorInput: { width: 85, height: 22, backgroundColor: C.s2, borderRadius: 4, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 9, textAlign: 'center', paddingHorizontal: 4 },
  // Token grid
  tokenGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tokenItem: { width: 110, backgroundColor: C.s2, borderRadius: 6, borderWidth: 1, borderColor: C.border, padding: 8, gap: 2 },
  tokenKey: { color: C.text, fontSize: 10, fontWeight: '600' },
  tokenVal: { color: C.primary, fontSize: 12, fontWeight: '700' },
  tokenPath: { color: C.muted, fontSize: 8, opacity: 0.7 },
  miniSwatch: { width: 16, height: 16, borderRadius: 4, borderWidth: 1, borderColor: C.border },
});
