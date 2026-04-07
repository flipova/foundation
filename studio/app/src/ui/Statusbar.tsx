/** Statusbar — 24px bottom bar: status dot, page/component counts, theme name. */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStudio } from '../store/StudioProvider';

const C = { bg: '#080c18', border: '#1a2240', text: '#d0d8f0', muted: '#6a7494', success: '#22c55e' };

const Statusbar: React.FC = () => {
  const { project, reg, clipboard, selId, node } = useStudio();
  const pageCount = project?.pages.length ?? 0;
  const compCount = reg.components.length + reg.blocks.length;
  const svcCount = project?.services?.length ?? 0;
  const queryCount = project?.queries?.length ?? 0;
  const sel = selId ? node(selId) : null;
  return (
    <View style={s.bar}>
      <Feather name="check-circle" size={10} color="#22c55e" style={{ marginRight: 6 }} />
      <Text style={s.text}>Auto-saved</Text>
      <View style={s.sep} />
      <Text style={s.info}>{pageCount} page{pageCount !== 1 ? 's' : ''}</Text>
      <View style={s.sep} />
      <Text style={s.info}>{compCount} in registry</Text>
      {svcCount > 0 && <><View style={s.sep} /><Text style={s.info}>{svcCount} svc</Text></>}
      {queryCount > 0 && <><View style={s.sep} /><Text style={s.info}>{queryCount} query</Text></>}
      {clipboard && <><View style={s.sep} /><Feather name="clipboard" size={9} color={C.muted} /></>}
      <View style={{ flex: 1 }} />
      {sel && <Text style={s.selInfo}>{sel.registryId}{sel.variant ? ` · ${sel.variant}` : ''}</Text>}
      {sel && <View style={s.sep} />}
      <Text style={s.hint}>⌘Z undo · ⌘D dup · Del · Esc</Text>
      <View style={s.sep} />
      <View style={[s.themeDot, { backgroundColor: project?.theme === 'dark' ? '#1a1a2e' : project?.theme === 'neon' ? '#39ff14' : '#fff' }]} />
      <Text style={s.info}>{project?.theme ?? 'light'}</Text>
    </View>
  );
};

export default Statusbar;

const s = StyleSheet.create({
  bar: { height: 24, flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.border, paddingHorizontal: 10 },
  text: { color: C.text, fontSize: 11, fontWeight: '500' },
  sep: { width: 1, height: 12, backgroundColor: C.border, marginHorizontal: 8 },
  info: { color: C.muted, fontSize: 10 },
  hint: { color: C.muted, fontSize: 9, opacity: 0.6 },
  selInfo: { color: '#3b82f6', fontSize: 10, fontWeight: '500' },
  themeDot: { width: 8, height: 8, borderRadius: 4, borderWidth: 1, borderColor: C.border, marginRight: 4 },
});
