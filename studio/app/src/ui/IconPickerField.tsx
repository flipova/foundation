/**
 * IconPickerField — Visual Ionicons picker with search and preview.
 */
import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const C = {
  bg: '#080c18', s1: '#0d1220', s2: '#131a2e',
  border: '#1a2240', text: '#d0d8f0', muted: '#6a7494',
  primary: '#3b82f6',
};

// Feather icons only — no variants, all distinct names
const ICONS: string[] = [
  // Navigation & UI
  'home','search','settings','menu','x','plus','minus','check',
  'arrow-left','arrow-right','arrow-up','arrow-down',
  'chevron-left','chevron-right','chevron-up','chevron-down',
  'refresh-cw','refresh-ccw','rotate-cw','rotate-ccw',
  'grid','list','layers','sidebar','layout','columns',
  'filter','sliders','toggle-left','toggle-right',
  'more-horizontal','more-vertical','maximize','minimize',
  'zoom-in','zoom-out','move','crop','scissors',
  // People & Social
  'user','users','user-plus','user-minus','user-check','user-x',
  'heart','thumbs-up','thumbs-down','smile','frown','meh',
  'message-circle','message-square','mail','send','inbox','at-sign',
  'phone','phone-call','phone-missed','phone-off','voicemail',
  'share','share-2','link','link-2','external-link',
  'twitter','facebook','instagram','github','gitlab','linkedin','youtube',
  // Media & Files
  'image','images','camera','video','film','music','headphones',
  'play','pause','stop-circle','skip-back','skip-forward',
  'volume','volume-1','volume-2','volume-x','mic','mic-off',
  'file','file-text','file-plus','file-minus','folder','folder-plus','folder-minus',
  'upload','download','upload-cloud','download-cloud','cloud','cloud-off',
  'copy','clipboard','archive','trash','trash-2',
  'paperclip','bookmark','tag','flag',
  // Commerce & Finance
  'shopping-cart','shopping-bag','credit-card','dollar-sign','percent',
  'trending-up','trending-down','bar-chart','bar-chart-2','pie-chart','activity',
  'package','gift','award','star','zap',
  // Location & Maps
  'map','map-pin','navigation','navigation-2','compass','globe',
  'truck','car','anchor','wind',
  // Tech & Devices
  'smartphone','tablet','monitor','tv','printer','server','database',
  'wifi','wifi-off','bluetooth','battery','battery-charging',
  'cpu','hard-drive','terminal','code','git-branch','git-commit','git-merge',
  'lock','unlock','key','shield','eye','eye-off','alert-circle','alert-triangle',
  'info','help-circle','check-circle','x-circle',
  // Time & Calendar
  'clock','calendar','watch','timer',
  // Nature & Misc
  'sun','moon','cloud-rain','cloud-snow','umbrella','droplet',
  'feather','leaf','aperture','target','crosshair',
  'tool','wrench','hammer','edit','edit-2','edit-3',
  'pen-tool','type','bold','italic','underline',
  'align-left','align-center','align-right','align-justify',
  'save','printer','rss','radio','cast',
  'bell','bell-off','flag','bookmark','hash','at-sign',
];

interface IconPickerFieldProps {
  value: string;
  onChange: (icon: string) => void;
  placeholder?: string;
}

const IconPickerField: React.FC<IconPickerFieldProps> = ({ value, onChange, placeholder = 'ellipse' }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() =>
    query.trim() ? ICONS.filter(n => n.includes(query.toLowerCase().trim())) : ICONS,
    [query]
  );

  const select = (name: string) => { onChange(name); setOpen(false); setQuery(''); };
  const clear = () => { onChange(''); setOpen(false); setQuery(''); };

  // All icons in the list are valid Feather names — render directly
  const renderIcon = (name: string, size: number, color: string) => {
    const featherName = ICONS.includes(name) ? name : 'circle';
    return <Feather name={featherName as React.ComponentProps<typeof Feather>['name']} size={size} color={color} />;
  };

  return (
    <>
      <Pressable style={s.trigger} onPress={() => setOpen(true)}>
        <View style={s.iconPreview}>
          {renderIcon(value || placeholder, 14, value ? C.text : C.muted)}
        </View>
        <Text style={[s.triggerText, !value && { color: C.muted }]} numberOfLines={1}>
          {value || 'Pick icon…'}
        </Text>
        <Feather name="chevron-down" size={11} color={C.muted} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={s.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={s.sheet} onPress={e => e.stopPropagation()}>
            <View style={s.header}>
              <Text style={s.title}>Pick an icon</Text>
              <Pressable onPress={() => setOpen(false)}>
                <Feather name="x" size={16} color={C.muted} />
              </Pressable>
            </View>

            <View style={s.searchRow}>
              <Feather name="search" size={13} color={C.muted} style={{ marginRight: 6 }} />
              <TextInput
                style={s.searchInput}
                value={query}
                onChangeText={setQuery}
                placeholder="Search icons…"
                placeholderTextColor={C.muted}
                autoFocus
              />
              {query.length > 0 && (
                <Pressable onPress={() => setQuery('')}>
                  <Feather name="x-circle" size={13} color={C.muted} />
                </Pressable>
              )}
            </View>

            <Text style={s.count}>{filtered.length} icons</Text>

            <ScrollView contentContainerStyle={s.grid} showsVerticalScrollIndicator={false}>
              <Pressable style={[s.cell, !value && s.cellSelected]} onPress={clear}>
                <Feather name="x" size={18} color={C.muted} />
                <Text style={s.cellLabel} numberOfLines={1}>none</Text>
              </Pressable>
              {filtered.map(name => (
                <Pressable key={name} style={[s.cell, value === name && s.cellSelected]} onPress={() => select(name)}>
                  {renderIcon(name, 18, value === name ? C.primary : C.text)}
                  <Text style={[s.cellLabel, value === name && { color: C.primary }]} numberOfLines={1}>{name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default IconPickerField;

const s = StyleSheet.create({
  trigger: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    height: 32, paddingHorizontal: 8, borderRadius: 6,
    backgroundColor: C.s2, borderWidth: 1, borderColor: C.border,
  },
  iconPreview: {
    width: 22, height: 22, borderRadius: 4,
    backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center',
  },
  triggerText: { flex: 1, color: C.text, fontSize: 11 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  sheet: {
    width: 460, maxHeight: '80%', backgroundColor: C.s1,
    borderRadius: 12, borderWidth: 1, borderColor: C.border, overflow: 'hidden',
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  title: { color: C.text, fontSize: 14, fontWeight: '600' },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    margin: 12, paddingHorizontal: 10, height: 34,
    backgroundColor: C.bg, borderRadius: 8, borderWidth: 1, borderColor: C.border,
  },
  searchInput: { flex: 1, color: C.text, fontSize: 12 },
  count: { color: C.muted, fontSize: 10, paddingHorizontal: 14, marginBottom: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, paddingBottom: 16, gap: 4 },
  cell: {
    width: 70, alignItems: 'center', gap: 4,
    paddingVertical: 8, paddingHorizontal: 4, borderRadius: 8,
    backgroundColor: C.bg, borderWidth: 1, borderColor: C.border,
  },
  cellSelected: { borderColor: C.primary, backgroundColor: 'rgba(59,130,246,0.1)' },
  cellLabel: { color: C.muted, fontSize: 8, textAlign: 'center' },
});
