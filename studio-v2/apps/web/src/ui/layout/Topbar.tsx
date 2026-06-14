/**
 * Topbar — 40px header bar.
 * Palette: #000000 · #ffffff · #000091  |  Police: Lexend
 */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, FlatList, ScrollView, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStudio } from '../useStudio';
import Tooltip from '../shared/Tooltip';
import ConfirmModal from '../shared/ConfirmModal';
import { useWindowSize } from '../shared/useWindowSize';
import { TOPBAR_RESPONSIVE } from './topbarResponsive';
import { colors, font, radius, height, space, zIndex } from '../ds';

export { TOPBAR_RESPONSIVE };

const DEVICES = ['iPhone 14 Pro', 'Pixel 7', 'iPhone SE', 'iPad Air', 'Desktop/Web'];
const DEVICE_ICONS: Record<string, React.ComponentProps<typeof Feather>['name']> = {
  'iPhone 14 Pro': 'smartphone',
  'Pixel 7':       'smartphone',
  'iPhone SE':     'smartphone',
  'iPad Air':      'tablet',
  'Desktop/Web':   'monitor',
};

// ─── Spinner ─────────────────────────────────────────────────────────────────
const Spinner: React.FC<{ size?: number; color?: string }> = ({ size = 11, color = '#fff' }) => {
  const rot = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a = Animated.loop(Animated.timing(rot, { toValue: 1, duration: 700, useNativeDriver: true }));
    a.start();
    return () => a.stop();
  }, []);
  const rotate = rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return <Animated.View style={{ transform: [{ rotate }] }}><Feather name="loader" size={size} color={color} /></Animated.View>;
};

// ─── Separator ───────────────────────────────────────────────────────────────
const Div: React.FC = () => <View style={s.divider} />;

// ─── Icon button ─────────────────────────────────────────────────────────────
const IconBtn: React.FC<{
  icon: React.ComponentProps<typeof Feather>['name'];
  onPress: () => void;
  tooltip: string;
  color?: string;
  active?: boolean;
  activeBg?: string;
  disabled?: boolean;
  size?: number;
}> = ({ icon, onPress, tooltip, color, active, activeBg, disabled, size = 13 }) => (
  <Tooltip text={tooltip}>
    <Pressable
      style={({ pressed }) => [
        s.iconBtn,
        active && activeBg ? { backgroundColor: activeBg } : undefined,
        pressed && !disabled ? s.iconBtnPressed : undefined,
        disabled ? s.disabled : undefined,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Feather name={icon} size={size} color={active ? '#fff' : (color || colors.muted)} />
      <Text style={[s.iconBtnText, active && { color: '#fff' }]}>{tooltip}</Text>
    </Pressable>
  </Tooltip>
);

// ─── Zoom control ────────────────────────────────────────────────────────────
const ZoomControl: React.FC<{ zoom: number; onDec: () => void; onInc: () => void }> = ({ zoom, onDec, onInc }) => (
  <View style={s.zoomWrap}>
    <Pressable style={s.zoomBtn} onPress={onDec}>
      <Feather name="minus" size={9} color={colors.muted} />
    </Pressable>
    <Text style={s.zoomText}>{zoom}%</Text>
    <Pressable style={s.zoomBtn} onPress={onInc}>
      <Feather name="plus" size={9} color={colors.muted} />
    </Pressable>
  </View>
);

// ─── Device selector ─────────────────────────────────────────────────────────
const DeviceSelector: React.FC<{ device: string; onOpen: () => void }> = ({ device, onOpen }) => (
  <Pressable style={s.deviceBtn} onPress={onOpen}>
    <Feather name={DEVICE_ICONS[device] || 'smartphone'} size={11} color={colors.muted} />
    <Text style={s.deviceLabel} numberOfLines={1}>{device}</Text>
    <Feather name="chevron-down" size={9} color={colors.muted} />
  </Pressable>
);

// ─── Generate button ─────────────────────────────────────────────────────────
const GenerateBtn: React.FC<{ generating: boolean; onPress: () => void }> = ({ generating, onPress }) => (
  <Pressable style={[s.genBtn, generating && s.genBtnLoading]} onPress={onPress} disabled={generating}>
    <View style={s.genBtnInner}>
      {generating ? <Spinner size={11} color="#fff" /> : <Feather name="zap" size={11} color="#fff" />}
      <Text style={s.genBtnText}>{generating ? 'Generating…' : 'Generate'}</Text>
    </View>
  </Pressable>
);

// ─── Props ───────────────────────────────────────────────────────────────────
interface Props {
  onOpenTheme: () => void;
  onOpenSettings: () => void;
  onOpenServices: () => void;
  onOpenQueries: () => void;
  onToggleCode: () => void;
  showCode: boolean;
  onOpenCustomFn: () => void;
  onOpenSnack: () => void;
}

const Topbar: React.FC<Props> = ({
  onOpenTheme, onOpenSettings, onOpenServices, onOpenQueries,
  onToggleCode, showCode, onOpenCustomFn, onOpenSnack,
}) => {
  const {
    zoom, setZoom, device, setDevice, generate, resetProject,
    undo, redo, canUndo, canRedo, previewMode, setPreviewMode,
    project, updateProject,
  } = useStudio();

  const [showDevices,      setShowDevices]      = useState(false);
  const [generating,       setGenerating]       = useState(false);
  const [showMoreMenu,     setShowMoreMenu]      = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { width: winW } = useWindowSize();

  const onGenerate = async () => {
    setGenerating(true);
    try { await generate(); } finally { setGenerating(false); }
  };
  const onReset = async () => {
    setShowResetConfirm(false);
    await resetProject();
  };
  const onImport = () => {
    if (typeof document === 'undefined') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        if (data.pages && data.navigation) await updateProject(data);
      } catch {}
    };
    input.click();
  };
  const onExport = () => {
    if (typeof document === 'undefined' || !project) return;
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.slug || 'project'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <View style={s.root}>
      <ConfirmModal
        visible={showResetConfirm}
        title="Reset project"
        message="This will permanently delete all project content."
        confirmLabel="Reset"
        cancelLabel="Cancel"
        destructive
        onConfirm={onReset}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* Logo */}
      <View style={s.logo}>
        <Text style={s.logoText}>Flipova - Foundation Studio 2</Text>
      </View>

      <View style={s.sep} />

      {/* Device selector */}
      <DeviceSelector device={device} onOpen={() => setShowDevices(true)} />
      <Modal visible={showDevices} transparent animationType="fade" onRequestClose={() => setShowDevices(false)}>
        <Pressable style={s.overlay} onPress={() => setShowDevices(false)}>
          <View style={s.dropdown}>
            <FlatList
              data={DEVICES}
              keyExtractor={i => i}
              renderItem={({ item }) => (
                <Pressable
                  style={[s.dropItem, item === device && s.dropItemActive]}
                  onPress={() => { setDevice(item); setShowDevices(false); }}
                >
                  <Feather name={DEVICE_ICONS[item] || 'smartphone'} size={12} color={item === device ? colors.primary : colors.muted} />
                  <Text style={[s.dropText, item === device && s.dropTextActive]}>{item}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      <View style={{ flex: 1 }} />

      {/* Right actions */}
      <View style={s.actions}>
        {/* Zoom */}
        <ZoomControl zoom={zoom} onDec={() => setZoom(Math.max(25, zoom - 10))} onInc={() => setZoom(Math.min(200, zoom + 10))} />

        <Div />

        {/* Undo / Redo */}
        <IconBtn icon="corner-up-left"  tooltip="Undo" onPress={undo} disabled={!canUndo} />
        <IconBtn icon="corner-up-right" tooltip="Redo" onPress={redo} disabled={!canRedo} />

        <Div />

        {/* Preview / Code */}
        <IconBtn icon="play"     tooltip="Preview"    onPress={() => setPreviewMode(!previewMode)} active={previewMode} activeBg={colors.primary} />
        <IconBtn icon="terminal" tooltip="Code panel" onPress={onToggleCode}                       active={showCode}    activeBg={colors.primary} />

        <Div />
        {/* Settings / Expo Snack */}
        <IconBtn icon="smartphone" tooltip="Expo Snack" onPress={onOpenSnack} />
        <IconBtn icon="sliders"    tooltip="Settings"   onPress={onOpenSettings} />
        <Div />
        {/* Reset */}
        <IconBtn icon="trash-2"    tooltip="Reset"      onPress={() => setShowResetConfirm(true)} color={colors.error} />

        <View style={s.sep} />
        <Pressable style={s.iconBtn} onPress={() => setShowMoreMenu(true)}>
          <Feather name="more-horizontal" size={13} color={colors.muted} />
        </Pressable>
        <Modal visible={showMoreMenu} transparent animationType="fade" onRequestClose={() => setShowMoreMenu(false)}>
          <Pressable style={s.overlay} onPress={() => setShowMoreMenu(false)}>
            <View style={[s.moreDropdown, { width: 180 }]}>
              <Pressable style={s.moreItem} onPress={() => { onOpenServices(); setShowMoreMenu(false); }}>
                <Feather name="layers" size={12} color={colors.text} />
                <Text style={s.moreItemText}>API services</Text>
              </Pressable>
              <Pressable style={s.moreItem} onPress={() => { onOpenQueries(); setShowMoreMenu(false); }}>
                <Feather name="activity" size={12} color={colors.text} />
                <Text style={s.moreItemText}>Data queries</Text>
              </Pressable>
              <Pressable style={s.moreItem} onPress={() => { onOpenCustomFn(); setShowMoreMenu(false); }}>
                <Feather name="cpu" size={12} color={colors.text} />
                <Text style={s.moreItemText}>Custom functions</Text>
              </Pressable>
              <View style={s.moreDivider} />
              <Pressable style={s.moreItem} onPress={() => { onOpenTheme(); setShowMoreMenu(false); }}>
                <Feather name="feather" size={12} color={colors.text} />
                <Text style={s.moreItemText}>Theme</Text>
              </Pressable>
              <View style={s.moreDivider} />
              <Pressable style={s.moreItem} onPress={() => { onImport(); setShowMoreMenu(false); }}>
                <Feather name="upload-cloud" size={12} color={colors.text} />
                <Text style={s.moreItemText}>Import</Text>
              </Pressable>
              <Pressable style={s.moreItem} onPress={() => { onExport(); setShowMoreMenu(false); }}>
                <Feather name="download-cloud" size={12} color={colors.text} />
                <Text style={s.moreItemText}>Export</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>

        <View style={s.sep} />
        <GenerateBtn generating={generating} onPress={onGenerate} />
      </View>
    </View>
  );
};

export default Topbar;

const s = StyleSheet.create({
  root: {
    height: (height?.topbar || 40),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: (space?.[6] || 12),
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: (space?.[2] || 4),
  },

  // Logo
  logo: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 },
  logoMark: {
    width: 20, height: 20, borderRadius: (radius?.sm || 3),
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  logoText: {
    color: colors.text,
    fontSize: (font?.size?.md || 12),
    fontWeight: (font?.weight?.bold || '600'),
    fontFamily: (font?.family || 'Lexend'),
    letterSpacing: -0.2,
  },

  sep: { width: 1, height: 16, backgroundColor: colors.border, marginHorizontal: (space?.[1] || 2) },

  // Device selector
  deviceBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: (space?.[3] || 6), paddingVertical: 4,
    borderRadius: (radius?.sm || 3),
    borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  deviceLabel: {
    color: colors.textSub,
    fontSize: (font?.size?.xs || 10),
    fontWeight: (font?.weight?.medium || '400'),
    fontFamily: (font?.family || 'Lexend'),
    maxWidth: 100,
  },

  // Overlay + dropdown
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  dropdown: {
    width: 200, maxHeight: 260,
    backgroundColor: colors.elevated, borderRadius: (radius?.md || 4),
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
    boxShadow: '0px 8px 20px rgba(0,0,0,0.6)' as any,
  },
  dropItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10 },
  dropItemActive: { backgroundColor: colors.primary + '22' },
  dropText: {
    color: colors.textSub,
    fontSize: (font?.size?.sm || 11),
    fontFamily: (font?.family || 'Lexend'),
  },
  dropTextActive: { color: colors.text, fontWeight: (font?.weight?.semi || '500') },

  // Actions
  actions: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  divider: { width: 1, height: 16, backgroundColor: colors.border, marginHorizontal: (space?.[2] || 4) },

  // Zoom
  zoomWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: (radius?.sm || 3), borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface, overflow: 'hidden',
  },
  zoomBtn: { paddingHorizontal: 7, paddingVertical: 5 },
  zoomText: {
    color: colors.muted,
    fontSize: (font?.size?.xs || 10),
    fontFamily: (font?.family || 'Lexend'),
    minWidth: 32, textAlign: 'center',
    fontVariant: ['tabular-nums'] as any,
  },

  // Icon button
  iconBtn: {
    height: 28, borderRadius: (radius?.sm || 3),
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 10, gap: 5,
  },
  iconBtnText: {
    color: colors.muted,
    fontSize: (font?.size?.sm || 11),
    fontFamily: (font?.family || 'Lexend'),
    fontWeight: (font?.weight?.semi || '500'),
  },
  iconBtnPressed: { backgroundColor: colors.surface2 },
  disabled: { opacity: 0.25 },

  // Generate
  genBtn: {
    borderRadius: (radius?.sm || 3),
    paddingHorizontal: 10, paddingVertical: 5,
    backgroundColor: colors.primary,
  },
  genBtnLoading: { opacity: 0.6 },
  genBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  genBtnText: {
    color: '#fff',
    fontSize: (font?.size?.xs || 10),
    fontWeight: (font?.weight?.bold || '600'),
    fontFamily: (font?.family || 'Lexend'),
    letterSpacing: 0.2,
  },

  // More dropdown
  moreDropdown: {
    position: 'absolute', top: (height?.topbar || 40), right: 12,
    width: 160, borderRadius: (radius?.md || 4),
    backgroundColor: colors.elevated,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.5)',
    zIndex: (zIndex?.modal || 200),
  },
  moreItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10 },
  moreItemText: {
    color: colors.text,
    fontSize: (font?.size?.sm || 11),
    fontFamily: (font?.family || 'Lexend'),
  },
  moreDivider: { height: 1, backgroundColor: colors.border, marginHorizontal: 8 },
});
