/** LibraryPanel — Left sidebar top: search, tabs, categorized item list. */
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, Pressable, FlatList, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStudio } from '../store/StudioProvider';
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

const C = { bg: '#080c18', surface: '#0d1220', surface2: '#131a2e', border: '#1a2240', text: '#d0d8f0', muted: '#6a7494', primary: '#3b82f6' };
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
    if (row.type === 'header') return <Text style={s.sectionHeader}>{row.title}</Text>;
    const it = row.item;
    const kind = libTab === 'layouts' ? 'layout' : libTab === 'components' ? 'component' : libTab === 'primitives' ? 'primitive' : 'block';
    const iconName = KIND_ICONS[kind] || 'circle';
    const iconColor = KIND_COLORS[kind] || C.primary;
    return (
      <Tooltip text={LIBRARY_TEXTS.tooltipText(it.label, it.category)}>
        <Pressable style={s.item} onPress={() => onAdd(it)}>
          <View style={s.itemIconWrap}><Feather name={iconName} size={14} color={iconColor} /></View>
          <View style={s.itemText}>
            <Text style={s.itemLabel} numberOfLines={1} ellipsizeMode="tail">{it.label}</Text>
            {!hideSubtitle && <Text style={s.itemSub} numberOfLines={1} ellipsizeMode="tail">{it.id}</Text>}
          </View>
        </Pressable>
      </Tooltip>
    );
  }, [libTab, onAdd, hideSubtitle]);

  return (
    <View style={s.root}>
      <TextInput style={s.search} placeholder={LIBRARY_TEXTS.searchPlaceholder} placeholderTextColor={C.muted} value={search} onChangeText={setSearch} />
      <View style={s.mainTabs}>
        {(['library', 'custom'] as const).map(t => (
          <Pressable key={t} style={[s.mainTab, mainTab === t && s.mainTabActive]} onPress={() => setMainTab(t)}>
            <Text style={[s.mainTabText, mainTab === t && s.mainTabTextActive]}>{t.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
      {mainTab === 'library' && (
        <Text style={s.tabDescription}>{LIBRARY_TEXTS.libraryDescription}</Text>
      )}
      {mainTab === 'library' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 30, flexGrow: 0 }} contentContainerStyle={s.subTabs}>
          {(['layouts', 'components', 'blocks', 'primitives'] as const).map(t => (
            <Pressable key={t} style={[s.subTab, libTab === t && s.subTabActive]} onPress={() => setLibTab(t)}>
              <Text style={[s.subTabText, libTab === t && s.subTabTextActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
      {mainTab === 'library' ? (
        items.length === 0 && search ? (
          <View style={s.emptyState}>
            <Text style={s.emptyText}>{LIBRARY_TEXTS.noResults(search)}</Text>
          </View>
        ) : (
          <FlatList data={flat} keyExtractor={(_, i) => String(i)} renderItem={renderItem} style={s.list} />
        )
      ) : (
        <ScrollView style={s.list}>
          {templates.length === 0 ? (
            <View style={s.emptyState}>
              <Feather name="package" size={24} color={C.muted} />
              <Text style={s.emptyText}>{LIBRARY_TEXTS.customEmpty}</Text>
            </View>
          ) : (
            templates.map(tpl => (
              <Pressable key={tpl.id} style={s.item} onPress={() => {
                const parentId = selId || page()?.root.id;
                if (parentId) addFromTemplate(parentId, tpl.id);
              }}>
                <View style={s.itemIconWrap}><Feather name="copy" size={14} color="#f59e0b" /></View>
                <View style={s.itemText}>
                  <Text style={s.itemLabel} numberOfLines={1} ellipsizeMode="tail">{tpl.name}</Text>
                  {!hideSubtitle && <Text style={s.itemSub} numberOfLines={1} ellipsizeMode="tail">{tpl.tree.registryId} · {tpl.category}</Text>}
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default LibraryPanel;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  search: { height: 32, backgroundColor: C.surface2, borderRadius: 6, borderWidth: 1, borderColor: C.border, marginHorizontal: 8, marginTop: 8, marginBottom: 6, paddingHorizontal: 10, color: C.text, fontSize: 12 },
  mainTabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border },
  mainTab: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  mainTabActive: { borderBottomWidth: 2, borderBottomColor: C.primary },
  mainTabText: { color: C.muted, fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  mainTabTextActive: { color: C.primary },
  tabDescription: { color: C.muted, fontSize: 10, paddingHorizontal: 10, paddingVertical: 6, lineHeight: 14 },
  subTabs: { flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 4, gap: 3 },
  subTab: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, backgroundColor: C.surface2 },
  subTabActive: { backgroundColor: C.primary },
  subTabText: { color: C.muted, fontSize: 10, fontWeight: '600' },
  subTabTextActive: { color: '#fff' },
  list: { flex: 1 },
  emptyState: { padding: 20, alignItems: 'center' },
  emptyText: { color: C.muted, fontSize: 11, marginTop: 8, textAlign: 'center', lineHeight: 16 },
  sectionHeader: { color: C.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 4, textTransform: 'uppercase' },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6 },
  itemIconWrap: { width: 24, alignItems: 'center' },
  itemText: { flex: 1, marginLeft: 6 },
  itemLabel: { color: C.text, fontSize: 12, fontWeight: '500' },
  itemSub: { color: C.muted, fontSize: 10 },
});
