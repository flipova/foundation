/**
 * Statusbar — 20px bottom bar.
 * Palette: #000000 · #ffffff · #000091  |  Police: Lexend
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStudio } from '../useStudio';
import { colors, font, height, space } from '../ds';

const Sep: React.FC = () => <View style={s.sep} />;

const Statusbar: React.FC = () => {
  const { project, reg, clipboard, selId, node } = useStudio();

  const pageCount  = project?.pages.length ?? 0;
  const compCount  = reg.components.length + reg.blocks.length;
  const svcCount   = project?.services?.length ?? 0;
  const queryCount = project?.queries?.length ?? 0;
  const sel        = selId ? node(selId) : null;

  return (
    <View style={s.root}>
      {/* Left */}
      <View style={s.group}>
        <View style={s.dot} />
        <Text style={s.dim}>{pageCount} screen{pageCount !== 1 ? 's' : ''}</Text>
        <Sep />
        <Text style={s.dim}>{compCount} components</Text>
        {svcCount > 0  && <><Sep /><Text style={s.dim}>{svcCount} services</Text></>}
        {queryCount > 0 && <><Sep /><Text style={s.dim}>{queryCount} queries</Text></>}
        {clipboard && <><Sep /><Feather name="clipboard" size={8} color={colors.muted} /></>}
      </View>

      {/* Right */}
      <View style={s.group}>
        {sel && (
          <>
            <Text style={s.selText}>{sel.registryId}{sel.variant ? ` · ${sel.variant}` : ''}</Text>
            <Sep />
          </>
        )}
        <Text style={s.hint}>⌘Z  ⌘D  Del  Esc</Text>
        <Sep />
        <Text style={s.dim}>{project?.theme ?? 'light'}</Text>
      </View>
    </View>
  );
};

export default Statusbar;

const s = StyleSheet.create({
  root: {
    height: (height?.statusbar || 20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: (space?.[6] || 12),
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  group:   { flexDirection: 'row', alignItems: 'center', gap: (space?.[2] || 4) },
  sep:     { width: 1, height: 8, backgroundColor: colors.border },
  dot:     { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.accent },
  selText: {
    fontSize: (font?.size?.xxs || 8),
    fontWeight: (font?.weight?.semi || '500'),
    fontFamily: (font?.family || 'Lexend'),
    color: colors.accent,
  },
  dim: {
    fontSize: (font?.size?.xxs || 8),
    fontFamily: (font?.family || 'Lexend'),
    color: colors.muted,
  },
  hint: {
    fontSize: (font?.size?.xxs || 8),
    fontFamily: (font?.family || 'Lexend'),
    color: colors.muted,
    opacity: 0.5,
  },
});
