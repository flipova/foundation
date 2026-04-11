/** Topbar — modern 48px header with logo, device selector, zoom, actions, generate. */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, FlatList, ScrollView, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStudio } from '../store/StudioProvider';
import Tooltip from './shared/Tooltip';
import ConfirmModal from './shared/ConfirmModal';
import { useWindowSize } from './shared/useWindowSize';
import { TOPBAR_RESPONSIVE } from './topbarResponsive';

export { TOPBAR_RESPONSIVE };

const C = {
  bg: '#07090f',
  surface: '#0d1220',
  surface2: '#131a2e',
  border: '#1a2240',
  text: '#d0d8f0',
  muted: '#4a5470',
  primary: '#3b82f6',
  success: '#22c55e',
  error: '#ef4444',
  purple: '#a78bfa',
  accent: '#06b6d4',
};

const DEVICES = ['iPhone 14 Pro', 'Pixel 7', 'iPhone SE', 'iPad Air', 'Desktop/Web'];
const DEVICE_ICONS: Record<string, React.ComponentProps<typeof Feather>['name']> = {
  'iPhone 14 Pro': 'smartphone', 'Pixel 7': 'smartphone', 'iPhone SE': 'smartphone',
  'iPad Air': 'tablet', 'Desktop/Web': 'monitor',
};

// ─── Spinner ─────────────────────────────────────────────────────────────────
const Spinner: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#fff' }) => {
  const rotation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(Animated.timing(rotation, { toValue: 1, duration: 700, useNativeDriver: true }));
    anim.start();
    return () => anim.stop();
  }, []);
  const rotate = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return <Animated.View style={{ transform: [{ rotate }] }}><Feather name="loader" size={size} color={color} /></Animated.View>;
};

// ─── Divider ─────────────────────────────────────────────────────────────────
const Div: React.FC = () => <View style={s.divider} />;

// ─── Icon button ─────────────────────────────────────────────────────────────
const IconBtn: React.FC<{
  icon: React.ComponentProps<typeof Feather>['name'];
  onPress: () => void;
  tooltip: string;
  color?: string;
  bg?: string;
  active?: boolean;
  activeBg?: string;
  disabled?: boolean;
  size?: number;
}> = ({ icon, onPress, tooltip, color, bg, active, activeBg, disabled, size = 15 }) => (
  <Tooltip text={tooltip}>
    <Pressable
      style={[s.iconBtn, bg && { backgroundColor: bg }, active && activeBg && { backgroundColor: activeBg }, disabled && { opacity: 0.35 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Feather name={icon} size={size} color={active ? '#fff' : (color || C.text)} />
    </Pressable>
  </Tooltip>
);

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

const Topbar: React.FC<Props> = ({ onOpenTheme, onOpenSettings, onOpenServices, onOpenQueries, onToggleCode, showCode, onOpenCustomFn, onOpenSnack }) => {
  const { zoom, setZoom, device, setDevice, generate, resetProject, undo, redo, canUndo, canRedo, previewMode, setPreviewMode, project, updateProject } = useStudio();
  const [showDevices, setShowDevices] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { width: windowWidth } = useWindowSize();
  const compact = TOPBAR_RESPONSIVE.isCompact(windowWidth);
  const minimal = TOPBAR_RESPONSIVE.isMinimal(windowWidth);

  const onGenerate = async () => { setGenerating(true); try { await generate(); } finally { setGenerating(false); } };
  const onReset = async () => { setShowResetConfirm(false); await resetProject(); };

  const onImport = () => {
    if (typeof document === 'undefined') return;
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0]; if (!file) return;
      try { const data = JSON.parse(await file.text()); if (data.pages && data.navigation) await updateProject(data); } catch {}
    };
    input.click();
  };

  const onExport = () => {
    if (typeof document === 'undefined' || !project) return;
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${project.slug || 'project'}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <View style={s.bar}>
      <ConfirmModal
        visible={showResetConfirm}
        title="Réinitialiser le projet"
        message="Cette action supprimera tout le contenu du projet de manière irréversible."
        confirmLabel="Réinitialiser"
        cancelLabel="Annuler"
        destructive
        onConfirm={onReset}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* ── Logo ── */}
      <View style={s.left}>
        <View style={s.logoRow}>
          <View style={s.logoIcon}>
            <Feather name="zap" size={13} color="#fff" />
          </View>
          {!minimal && <Text style={s.logo}>Flipova</Text>}
        </View>
      </View>

      {/* ── Device selector ── */}
      <View style={s.center}>
        <Pressable style={s.deviceBtn} onPress={() => setShowDevices(true)}>
          <Feather name={DEVICE_ICONS[device] || 'smartphone'} size={13} color={C.muted} />
          <Text style={s.deviceText} numberOfLines={1}>{device}</Text>
          <Feather name="chevron-down" size={11} color={C.muted} />
        </Pressable>
        <Modal visible={showDevices} transparent animationType="fade" onRequestClose={() => setShowDevices(false)}>
          <Pressable style={s.overlay} onPress={() => setShowDevices(false)}>
            <View style={s.dropdown}>
              <FlatList data={DEVICES} keyExtractor={i => i} renderItem={({ item }) => (
                <Pressable style={[s.dropItem, item === device && s.dropItemActive]} onPress={() => { setDevice(item); setShowDevices(false); }}>
                  <Feather name={DEVICE_ICONS[item] || 'smartphone'} size={12} color={item === device ? C.primary : C.muted} />
                  <Text style={[s.dropText, item === device && s.dropTextActive]}>{item}</Text>
                </Pressable>
              )} />
            </View>
          </Pressable>
        </Modal>
      </View>

      {/* ── Right actions ── */}
      <View style={s.rightWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.rightContent} style={s.rightScroll}>

          {/* Zoom */}
          <View style={s.zoomRow}>
            <Pressable style={s.zoomBtn} onPress={() => setZoom(Math.max(25, zoom - 10))}>
              <Feather name="minus" size={11} color={C.muted} />
            </Pressable>
            <Text style={s.zoomText}>{zoom}%</Text>
            <Pressable style={s.zoomBtn} onPress={() => setZoom(Math.min(200, zoom + 10))}>
              <Feather name="plus" size={11} color={C.muted} />
            </Pressable>
          </View>

          <Div />

          {/* Undo / Redo */}
          <IconBtn icon="corner-up-left" tooltip="Annuler" onPress={undo} disabled={!canUndo} />
          <IconBtn icon="corner-up-right" tooltip="Rétablir" onPress={redo} disabled={!canRedo} />

          <Div />

          {/* Preview / Code */}
          <IconBtn icon="play" tooltip="Prévisualisation interactive" onPress={() => setPreviewMode(!previewMode)} active={previewMode} activeBg={C.success} />
          <IconBtn icon="terminal" tooltip="Panneau de code" onPress={onToggleCode} active={showCode} activeBg={C.purple} color={C.purple} />

          <Div />

          {/* Tools */}
          <IconBtn icon="layers" tooltip="Services API" onPress={onOpenServices} />
          <IconBtn icon="activity" tooltip="Requêtes de données" onPress={onOpenQueries} />
          <IconBtn icon="cpu" tooltip="Fonctions personnalisées" onPress={onOpenCustomFn} color={C.purple} />
          <IconBtn icon="smartphone" tooltip="Expo Snack — tester sur appareil" onPress={onOpenSnack} color={C.accent} />

          <Div />

          {/* Settings / Theme */}
          <IconBtn icon="sliders" tooltip="Paramètres du projet" onPress={onOpenSettings} />
          <IconBtn icon="feather" tooltip="Thème & couleurs" onPress={onOpenTheme} color="#f59e0b" />

          {/* Import / Export / Reset — compact = dropdown */}
          {compact ? (
            <>
              <Pressable style={s.iconBtn} onPress={() => setShowMoreMenu(true)}>
                <Feather name="more-horizontal" size={15} color={C.text} />
              </Pressable>
              <Modal visible={showMoreMenu} transparent animationType="fade" onRequestClose={() => setShowMoreMenu(false)}>
                <Pressable style={s.overlay} onPress={() => setShowMoreMenu(false)}>
                  <View style={s.moreDropdown}>
                    <Pressable style={s.moreItem} onPress={() => { onImport(); setShowMoreMenu(false); }}>
                      <Feather name="upload-cloud" size={13} color={C.text} /><Text style={s.moreItemText}>Importer</Text>
                    </Pressable>
                    <Pressable style={s.moreItem} onPress={() => { onExport(); setShowMoreMenu(false); }}>
                      <Feather name="download-cloud" size={13} color={C.text} /><Text style={s.moreItemText}>Exporter</Text>
                    </Pressable>
                    <View style={s.moreDivider} />
                    <Pressable style={s.moreItem} onPress={() => { setShowResetConfirm(true); setShowMoreMenu(false); }}>
                      <Feather name="trash-2" size={13} color={C.error} /><Text style={[s.moreItemText, { color: C.error }]}>Réinitialiser</Text>
                    </Pressable>
                  </View>
                </Pressable>
              </Modal>
            </>
          ) : (
            <>
              <Div />
              <IconBtn icon="upload-cloud" tooltip="Importer un projet JSON" onPress={onImport} />
              <IconBtn icon="download-cloud" tooltip="Exporter le projet JSON" onPress={onExport} />
              <IconBtn icon="trash-2" tooltip="Réinitialiser le projet" onPress={() => setShowResetConfirm(true)} color={C.error} bg="rgba(239,68,68,0.08)" />
            </>
          )}

          <Div />

          {/* Generate */}
          <Pressable style={[s.genBtn, generating && { opacity: 0.75 }]} onPress={onGenerate} disabled={generating}>
            {generating ? (
              <View style={s.genInner}><Spinner size={12} color="#fff" /><Text style={s.genText}>Génération…</Text></View>
            ) : (
              <View style={s.genInner}>
                <Feather name="zap" size={13} color="#fff" />
                <Text style={s.genText}>Generate</Text>
              </View>
            )}
          </Pressable>

        </ScrollView>
      </View>
    </View>
  );
};

export default Topbar;

const s = StyleSheet.create({
  bar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingHorizontal: 14,
    gap: 8,
  },
  // Logo
  left: { flexShrink: 0 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIcon: {
    width: 26, height: 26, borderRadius: 7,
    backgroundColor: C.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  logo: { color: C.text, fontSize: 14, fontWeight: '700', letterSpacing: -0.3 },
  // Device
  center: { flex: 1, alignItems: 'center' },
  deviceBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.surface2, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: C.border,
  },
  deviceText: { color: C.text, fontSize: 12, fontWeight: '500' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  dropdown: {
    backgroundColor: C.surface, borderRadius: 10, borderWidth: 1, borderColor: C.border,
    width: 220, maxHeight: 300, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16,
  },
  dropItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 11 },
  dropItemActive: { backgroundColor: 'rgba(59,130,246,0.1)' },
  dropText: { color: C.text, fontSize: 13 },
  dropTextActive: { color: C.primary, fontWeight: '600' },
  // Right
  rightWrapper: { flexShrink: 0, maxWidth: '62%' },
  rightScroll: { flexGrow: 0 },
  rightContent: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  divider: { width: 1, height: 20, backgroundColor: C.border, marginHorizontal: 4 },
  // Zoom
  zoomRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.surface2, borderRadius: 7,
    borderWidth: 1, borderColor: C.border,
    overflow: 'hidden',
  },
  zoomBtn: { paddingHorizontal: 8, paddingVertical: 6 },
  zoomText: { color: C.muted, fontSize: 11, minWidth: 34, textAlign: 'center', fontVariant: ['tabular-nums'] as any },
  // Icon button
  iconBtn: {
    width: 30, height: 30, borderRadius: 7,
    alignItems: 'center', justifyContent: 'center',
  },
  // Generate
  genBtn: {
    backgroundColor: C.primary, borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 7,
    marginLeft: 2,
  },
  genInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  genText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  // More dropdown
  moreDropdown: {
    backgroundColor: C.surface, borderRadius: 10, borderWidth: 1, borderColor: C.border,
    minWidth: 180, overflow: 'hidden',
    position: 'absolute', top: 48, right: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16,
  },
  moreItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 11 },
  moreItemText: { color: C.text, fontSize: 13 },
  moreDivider: { height: 1, backgroundColor: C.border, marginHorizontal: 10 },
});
