/** Statusbar — 24px bottom bar: status dot, page/component counts, theme name. */
import React from 'react';
import { StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Box, Inline, Center, Text } from '@flipova/foundation/web';
import { useStudio } from '../store/StudioProvider';

const C = { bg: '#080c18', border: '#1a2240', text: '#d0d8f0', muted: '#6a7494', success: '#22c55e', primary: '#3b82f6' };

const Statusbar: React.FC = () => {
  const { project, reg, clipboard, selId, node } = useStudio();
  const pageCount = project?.pages.length ?? 0;
  const compCount = reg.components.length + reg.blocks.length;
  const svcCount = project?.services?.length ?? 0;
  const queryCount = project?.queries?.length ?? 0;
  const sel = selId ? node(selId) : null;
  return (
    <Inline align="center" px={2} spacing={2} bg={C.bg} style={{ height: 24, borderTopWidth: 1, borderTopColor: C.border }}>
      <Feather name="check-circle" size={10} color="#22c55e" style={{ marginRight: 2 }} />
      <Text fontSize={11} fontWeight="500" color={C.text}>Auto-saved</Text>
      <Box style={s.sep} bg={C.border} />
      <Text fontSize={10} color={C.muted}>{pageCount} page{pageCount !== 1 ? 's' : ''}</Text>
      <Box style={s.sep} bg={C.border} />
      <Text fontSize={10} color={C.muted}>{compCount} in registry</Text>
      {svcCount > 0 && <><Box style={s.sep} bg={C.border} /><Text fontSize={10} color={C.muted}>{svcCount} svc</Text></>}
      {queryCount > 0 && <><Box style={s.sep} bg={C.border} /><Text fontSize={10} color={C.muted}>{queryCount} query</Text></>}
      {clipboard && <><Box style={s.sep} bg={C.border} /><Feather name="clipboard" size={9} color="#6a7494" /></>}
      <Box flex={1} />
      {sel && <Text fontSize={10} color={C.primary} fontWeight="500">{sel.registryId}{sel.variant ? ` · ${sel.variant}` : ''}</Text>}
      {sel && <Box style={s.sep} bg={C.border} />}
      <Text fontSize={10} color={C.muted} style={{ opacity: 0.6 }}>⌘Z undo · ⌘D dup · Del · Esc</Text>
      <Box style={s.sep} bg={C.border} />
      <Box style={{ ...s.themeDot as any, backgroundColor: project?.theme === 'dark' ? '#1a1a2e' : project?.theme === 'neon' ? '#39ff14' : '#fff', borderColor: C.border }} />
      <Text fontSize={10} color={C.muted}>{project?.theme ?? 'light'}</Text>
    </Inline>
  );
};

export default Statusbar;

const s = StyleSheet.create({
  sep: { width: 1, height: 12, marginHorizontal: 4 },
  themeDot: { width: 8, height: 8, borderRadius: 4, borderWidth: 1, marginRight: 2 },
});
