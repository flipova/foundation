/** LibraryPanel — Left sidebar top: search, tabs, categorized item list. */
import React, { useState, useMemo, useCallback } from 'react';
import { TextInput, Pressable, FlatList, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Box, Stack, Inline, Center, Text } from '@flipova/foundation/web';
import { useStudio } from '../store/StudioProvider';

const C = { bg: '#080c18', border: '#1a2240', text: '#d0d8f0', muted: '#6a7494', success: '#22c55e', primary: '#3b82f6', surface: '#131a2e' };
import Tooltip from './shared/Tooltip';
import { usePanelWidth } from './shared/usePanelWidth';
import { LIBRARY_RESPONSIVE } from './libraryResponsive';

// ---------------------------------------------------------------------------
// Constants — exported for unit tests
// ---------------------------------------------------------------------------

export const LIBRARY_TEXTS = {
  searchPlaceholder: 'Rechercher un composant…',
  libraryDescription: "Glissez ou cliquez un composant pour l'ajouter à l'écran sélectionné.",
  customEmpty: 'Aucun template personnalisé. Sélectionnez un composant sur le canvas et sauvegardez-le comme template.',
  noResults: (term: string) => `Aucun composant trouvé pour « ${term} ».`,
  tooltipText: (label: string, category: string) => `${label} — ${category}`,
} as const;

const KIND_COLORS: Record<string, string> = { layout: '#a78bfa', component: '#3b82f6', block: '#f59e0b', primitive: '#22c55e' };
const KIND_ICONS: Record<string, React.ComponentProps<typeof Feather>['name']> = { layout: 'layout', component: 'box', block: 'package', primitive: 'grid' };

const LibraryPanel: React.FC = () => {
  const { reg, libTab, setLibTab, selId, addNode, page, templates, addFromTemplate } = useStudio();
  const [search, setSearch] = useState('');
  const [mainTab, setMainTab] = useState<'library' | 'custom'>('library');
  const { width } = usePanelWidth(240, LIBRARY_RESPONSIVE.MIN_WIDTH, LIBRARY_RESPONSIVE.MAX_WIDTH);
  const hideSubtitle = LIBRARY_RESPONSIVE.shouldHideSubtitle(width);

  const items = useMemo(() => {
    const list = libTab === 'layouts' ? reg.layouts : libTab === 'components' ? reg.components : libTab === 'primitives' ? reg.primitives : reg.blocks;
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter(i => i.label.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
  }, [reg, libTab, search]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof items> = {};
    items.forEach(i => { (map[i.category] ??= []).push(i); });
    const sections: { key: string; title: string; data: typeof items }[] = [];
    Object.keys(map).sort().forEach(k => sections.push({ key: k, title: k, data: map[k] }));
    return sections;
  }, [items]);

  const flat = useMemo(() => {
    const arr: ({ type: 'header'; title: string } | { type: 'item'; item: typeof items[0] })[] = [];
    grouped.forEach(g => { arr.push({ type: 'header', title: g.title }); g.data.forEach(item => arr.push({ type: 'item', item })); });
    return arr;
  }, [grouped]);

  const onAdd = useCallback((item: typeof items[0]) => {
    const kind = libTab === 'layouts' ? 'layout' : libTab === 'components' ? 'component' : libTab === 'primitives' ? 'primitive' : 'block';
    const parentId = selId || page()?.root.id;
    if (parentId) addNode(parentId, kind, item.id);
  }, [libTab, selId, page, addNode]);

  const renderItem = useCallback(({ item: row }: { item: typeof flat[0] }) => {
    if (row.type === 'header') return <Text fontSize={9} fontWeight="700" color={C.muted} style={s.sectionHeader}>{row.title}</Text>;
    const it = row.item;
    const kind = libTab === 'layouts' ? 'layout' : libTab === 'components' ? 'component' : libTab === 'primitives' ? 'primitive' : 'block';
    const iconName = KIND_ICONS[kind] || 'circle';
    const iconColor = KIND_COLORS[kind] || '#3b82f6';
    return (
      <Tooltip text={LIBRARY_TEXTS.tooltipText(it.label, it.category)}>
        <Pressable onPress={() => onAdd(it)}>
          <Inline align="center" px={3} py={1}>
            <Center style={s.itemIconWrap}><Feather name={iconName} size={14} color={iconColor} /></Center>
            <Box flex={1} style={{ marginLeft: 6 }}>
              <Text fontSize={13} fontWeight="500" color={C.text} numberOfLines={1}>{it.label}</Text>
              {!hideSubtitle && <Text fontSize={11} color={C.muted} numberOfLines={1}>{it.id}</Text>}
            </Box>
          </Inline>
        </Pressable>
      </Tooltip>
    );
  }, [libTab, onAdd, hideSubtitle]);

  return (
    <Box flex={1} bg={C.surface}>
      <TextInput style={s.search} placeholder={LIBRARY_TEXTS.searchPlaceholder} placeholderTextColor="#6a7494" value={search} onChangeText={setSearch} />
      <Inline style={{ borderBottomWidth: 1, borderBottomColor: C.border }}>
        {(['library', 'custom'] as const).map(t => (
          <Pressable key={t} style={[s.mainTab, mainTab === t && s.mainTabActive]} onPress={() => setMainTab(t)}>
            <Text fontSize={11} color={mainTab === t ? C.primary : C.muted} fontWeight="600" style={{ letterSpacing: 0.5 }}>{t.toUpperCase()}</Text>
          </Pressable>
        ))}
      </Inline>
      {mainTab === 'library' && (
        <Text fontSize={11} color={C.muted} style={s.tabDescription}>{LIBRARY_TEXTS.libraryDescription}</Text>
      )}
      {mainTab === 'library' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 30, flexGrow: 0 }} contentContainerStyle={s.subTabs}>
          {(['layouts', 'components', 'blocks', 'primitives'] as const).map(t => (
            <Pressable key={t} style={[s.subTab, libTab === t && s.subTabActive]} onPress={() => setLibTab(t)}>
              <Text fontSize={11} color={libTab === t ? C.bg : C.muted} fontWeight="600">{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
      {mainTab === 'library' ? (
        items.length === 0 && search ? (
          <Center p={6}>
            <Text fontSize={11} color={C.muted} textAlign="center">{LIBRARY_TEXTS.noResults(search)}</Text>
          </Center>
        ) : (
          <FlatList data={flat} keyExtractor={(_, i) => String(i)} renderItem={renderItem} style={s.list} />
        )
      ) : (
        <ScrollView style={s.list}>
          {templates.length === 0 ? (
            <Center p={6}>
              <Feather name="package" size={24} color="#6a7494" />
              <Text fontSize={11} color={C.muted} textAlign="center" style={{ marginTop: 8 }}>{LIBRARY_TEXTS.customEmpty}</Text>
            </Center>
          ) : (
            templates.map(tpl => (
              <Pressable key={tpl.id} onPress={() => {
                const parentId = selId || page()?.root.id;
                if (parentId) addFromTemplate(parentId, tpl.id);
              }}>
                <Inline align="center" px={3} py={1}>
                  <Center style={s.itemIconWrap}><Feather name="copy" size={14} color="#f59e0b" /></Center>
                  <Box flex={1} style={{ marginLeft: 6 }}>
                    <Text fontSize={13} fontWeight="500" color={C.text} numberOfLines={1}>{tpl.name}</Text>
                    {!hideSubtitle && <Text fontSize={11} color={C.muted} numberOfLines={1}>{tpl.tree.registryId} · {tpl.category}</Text>}
                  </Box>
                </Inline>
              </Pressable>
            ))
          )}
        </ScrollView>
      )}
    </Box>
  );
};

export default LibraryPanel;

const s = StyleSheet.create({
  search: { height: 32, backgroundColor: '#131a2e', borderRadius: 6, borderWidth: 1, borderColor: '#1a2240', marginHorizontal: 8, marginTop: 8, marginBottom: 6, paddingHorizontal: 10, color: '#d0d8f0', fontSize: 12 },
  mainTab: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  mainTabActive: { borderBottomWidth: 2, borderBottomColor: '#3b82f6' },
  tabDescription: { paddingHorizontal: 10, paddingVertical: 6, lineHeight: 14 },
  subTabs: { flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 4, gap: 3 },
  subTab: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, backgroundColor: '#131a2e' },
  subTabActive: { backgroundColor: '#3b82f6' },
  list: { flex: 1 },
  sectionHeader: { fontSize: 9, letterSpacing: 1, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 4, textTransform: 'uppercase' },
  itemIconWrap: { width: 24 },
});
