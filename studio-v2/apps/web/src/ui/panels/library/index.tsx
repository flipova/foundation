/**
 * LibraryPanel — Left sidebar: search, type tabs, component list.
 * Palette: #000000 · #ffffff · #000091  |  Police: Lexend
 */
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, Pressable, FlatList, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStudio } from '../../useStudio';
import Tooltip from '../../shared/Tooltip';
import { LIBRARY_RESPONSIVE } from './libraryResponsive';
import { usePanelWidth } from '../../shared/usePanelWidth';
import { colors, font, radius, space } from '../../ds';

export const LIBRARY_TEXTS = {
  searchPlaceholder: 'Search…',
  libraryDescription: 'Click or drag to add to canvas.',
  customEmpty: 'No templates yet. Select a node and save it as a template.',
  noResults: (term: string) => `No results for "${term}"`,
  tooltipText: (label: string, category: string) => `${label} — ${category}`,
} as const;

const KIND_COLORS: Record<string, string> = {
  layout:    colors.white,
  component: colors.primary,
  block:     colors.muted,
  primitive: colors.white,
};
const KIND_ICONS: Record<string, React.ComponentProps<typeof Feather>['name']> = {
  layout:    'layout',
  component: 'box',
  block:     'package',
  primitive: 'grid',
};

const TypeTab: React.FC<{ label: string; active: boolean; onPress: () => void }> = ({ label, active, onPress }) => (
  <Pressable style={[s.typeTab, active && s.typeTabActive]} onPress={onPress}>
    <Text style={[s.typeTabText, active && s.typeTabTextActive]}>{label}</Text>
  </Pressable>
);

const MainTab: React.FC<{ label: string; active: boolean; onPress: () => void }> = ({ label, active, onPress }) => (
  <Pressable style={[s.mainTab, active && s.mainTabActive]} onPress={onPress}>
    <Text style={[s.mainTabText, active && s.mainTabTextActive]}>{label.toUpperCase()}</Text>
  </Pressable>
);

const LibraryPanel: React.FC = () => {
  const { reg, libTab, setLibTab, selId, addNode, page, templates, addFromTemplate } = useStudio();
  const [search,  setSearch]  = useState('');
  const [mainTab, setMainTab] = useState<'library' | 'custom'>('library');
  const { width } = usePanelWidth(240, LIBRARY_RESPONSIVE.MIN_WIDTH, LIBRARY_RESPONSIVE.MAX_WIDTH);
  const hideSubtitle = LIBRARY_RESPONSIVE.shouldHideSubtitle(width);

  const items = useMemo(() => {
    const list =
      libTab === 'layouts'    ? reg.layouts    :
      libTab === 'components' ? reg.components :
      libTab === 'primitives' ? reg.primitives :
      reg.blocks;
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter(i => i.label.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
  }, [reg, libTab, search]);

  const flat = useMemo(() => {
    const map: Record<string, typeof items> = {};
    items.forEach(i => { (map[i.category] ??= []).push(i); });
    const rows: ({ type: 'header'; title: string } | { type: 'item'; item: typeof items[0] })[] = [];
    Object.keys(map).sort().forEach(k => {
      rows.push({ type: 'header', title: k });
      map[k].forEach(item => rows.push({ type: 'item', item }));
    });
    return rows;
  }, [items]);

  const onAdd = useCallback((item: typeof items[0]) => {
    const kind =
      libTab === 'layouts'    ? 'layout'    :
      libTab === 'components' ? 'component' :
      libTab === 'primitives' ? 'primitive' :
      'block';
    const parentId = selId || page()?.root.id;
    if (parentId) addNode(parentId, kind, item.id);
  }, [libTab, selId, page, addNode]);

  const kind = libTab === 'layouts' ? 'layout' : libTab === 'components' ? 'component' : libTab === 'primitives' ? 'primitive' : 'block';

  const renderItem = useCallback(({ item: row }: { item: typeof flat[0] }) => {
    if (row.type === 'header') {
      return <Text style={s.sectionHeader}>{row.title.toUpperCase()}</Text>;
    }
    const it = row.item;
    const iconName  = KIND_ICONS[kind]  || 'circle';
    const iconColor = KIND_COLORS[kind] || colors.muted;
    return (
      <Tooltip text={LIBRARY_TEXTS.tooltipText(it.label, it.category)}>
        <Pressable
          style={({ pressed }) => [s.itemRow, pressed && s.itemRowPressed]}
          onPress={() => onAdd(it)}
        >
          <View style={[s.itemIcon, { backgroundColor: iconColor === colors.white ? '#ffffff14' : iconColor + '16' }]}>
            <Feather name={iconName} size={12} color={iconColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.itemLabel} numberOfLines={1}>{it.label}</Text>
            {!hideSubtitle && <Text style={s.itemSub} numberOfLines={1}>{it.id}</Text>}
          </View>
        </Pressable>
      </Tooltip>
    );
  }, [kind, onAdd, hideSubtitle]);

  return (
    <View style={s.root}>
      {/* Search */}
      <View style={s.searchWrap}>
        <Feather name="search" size={11} color={colors.muted} />
        <TextInput
          style={s.search}
          placeholder={LIBRARY_TEXTS.searchPlaceholder}
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')} hitSlop={6}>
            <Feather name="x" size={10} color={colors.muted} />
          </Pressable>
        )}
      </View>

      {/* Main tabs */}
      <View style={s.mainTabs}>
        <MainTab label="Library" active={mainTab === 'library'} onPress={() => setMainTab('library')} />
        <MainTab label="Custom"  active={mainTab === 'custom'}  onPress={() => setMainTab('custom')}  />
      </View>

      {mainTab === 'library' && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.typeTabsScroll} contentContainerStyle={s.typeTabs}>
            {(['layouts', 'components', 'blocks', 'primitives'] as const).map(t => (
              <TypeTab
                key={t}
                label={t.charAt(0).toUpperCase() + t.slice(1)}
                active={libTab === t}
                onPress={() => setLibTab(t)}
              />
            ))}
          </ScrollView>

          {items.length === 0 && search ? (
            <View style={s.empty}>
              <Text style={s.emptyText}>{LIBRARY_TEXTS.noResults(search)}</Text>
            </View>
          ) : (
            <FlatList
              data={flat}
              keyExtractor={(_, i) => String(i)}
              renderItem={renderItem}
              style={s.list}
            />
          )}
        </>
      )}

      {mainTab === 'custom' && (
        <ScrollView style={s.list}>
          {templates.length === 0 ? (
            <View style={s.empty}>
              <Feather name="package" size={20} color={colors.muted} />
              <Text style={[s.emptyText, { marginTop: 8, textAlign: 'center' }]}>{LIBRARY_TEXTS.customEmpty}</Text>
            </View>
          ) : (
            templates.map(tpl => (
              <Pressable
                key={tpl.id}
                style={({ pressed }) => [s.itemRow, pressed && s.itemRowPressed]}
                onPress={() => {
                  const parentId = selId || page()?.root.id;
                  if (parentId) addFromTemplate(parentId, tpl.id);
                }}
              >
                <View style={s.itemIcon}>
                  <Feather name="copy" size={12} color={colors.muted} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.itemLabel} numberOfLines={1}>{tpl.name}</Text>
                  {!hideSubtitle && <Text style={s.itemSub} numberOfLines={1}>{tpl.tree?.registryId}</Text>}
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
  root: { flex: 1, backgroundColor: colors.surface },

  // Search
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: (space?.[3] || 6), marginTop: (space?.[3] || 6), marginBottom: (space?.[2] || 4),
    paddingHorizontal: (space?.[3] || 6), paddingVertical: 5,
    backgroundColor: colors.surface2,
    borderRadius: (radius?.sm || 3),
    borderWidth: 1, borderColor: colors.border,
    gap: (space?.[2] || 4),
  },
  search: {
    flex: 1,
    color: colors.text,
    fontSize: (font?.size?.sm || 11),
    fontFamily: (font?.family || 'Lexend'),
    padding: 0,
  },

  // Main tabs
  mainTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1, borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  mainTab: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  mainTabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  mainTabText: {
    color: colors.muted,
    fontSize: (font?.size?.xs || 10),
    fontWeight: (font?.weight?.medium || '400'),
    fontFamily: (font?.family || 'Lexend'),
  },
  mainTabTextActive: { color: colors.text, fontWeight: (font?.weight?.semi || '500') },

  // Type sub-tabs
  typeTabsScroll: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: colors.border },
  typeTabs: { flexDirection: 'row', paddingHorizontal: (space?.[3] || 6), paddingVertical: (space?.[2] || 4), gap: (space?.[2] || 4) },
  typeTab: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: (radius?.md || 4),
    backgroundColor: 'transparent',
  },
  typeTabActive: { backgroundColor: colors.surface3, borderWidth: 1, borderColor: colors.border },
  typeTabText: {
    color: colors.muted,
    fontSize: (font?.size?.xs || 10),
    fontFamily: (font?.family || 'Lexend'),
    fontWeight: (font?.weight?.medium || '400'),
  },
  typeTabTextActive: { color: colors.text },

  // List
  list: { flex: 1 },
  sectionHeader: {
    color: colors.muted,
    fontSize: (font?.size?.xxs || 8),
    fontWeight: (font?.weight?.bold || '600'),
    fontFamily: (font?.family || 'Lexend'),
    letterSpacing: 1,
    paddingHorizontal: (space?.[4] || 8), paddingTop: (space?.[4] || 8), paddingBottom: (space?.[1] || 2),
    textTransform: 'uppercase',
  },
  itemRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: (space?.[3] || 6), paddingVertical: 8,
    gap: (space?.[3] || 6),
  },
  itemRowPressed: { backgroundColor: colors.surface2 },
  itemIcon: {
    width: 24, height: 24, borderRadius: (radius?.xs || 2),
    backgroundColor: colors.surface2,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  itemLabel: {
    color: colors.text,
    fontSize: (font?.size?.sm || 11),
    fontWeight: (font?.weight?.medium || '400'),
    fontFamily: (font?.family || 'Lexend'),
  },
  itemSub: {
    color: colors.muted,
    fontSize: (font?.size?.xxs || 8),
    fontFamily: (font?.family || 'Lexend'),
  },

  // Empty
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, gap: 6 },
  emptyText: {
    color: colors.muted,
    fontSize: (font?.size?.sm || 11),
    fontFamily: (font?.family || 'Lexend'),
  },
});
