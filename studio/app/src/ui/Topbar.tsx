/** Topbar — modern 48px header with logo, device selector, zoom, actions, generate. */
import React, { useState, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Modal, FlatList, ScrollView, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Box, Inline, Center, Text, useTheme } from '@flipova/foundation/web';
import { useStudio } from '../store/StudioProvider';
import Tooltip from './shared/Tooltip';
import ConfirmModal from './shared/ConfirmModal';
import { useWindowSize } from './shared/useWindowSize';
import { TOPBAR_RESPONSIVE } from './topbarResponsive';

export { TOPBAR_RESPONSIVE };

// Elegant fallback colors if theme lacks them
const FALLBACK = {
  bg: '#0e1015',
  surface: '#15171e',
  surface2: '#1b1d24',
  border: '#272a31',
  text: '#e2e4e9',
  muted: '#8b949e',
  primary: '#3b82f6',
  success: '#238636',
  error: '#da3633',
  purple: '#8957e5',
  accent: '#2f81f7',
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
const Div: React.FC = () => <Box style={s.divider} bg="border" />;

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
      <Feather name={icon} size={size} color={active ? '#fff' : (color || FALLBACK.text)} />
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
  const { theme } = useTheme();
  
  const C = {
    bg: theme.background || FALLBACK.bg,
    surface: theme.card || FALLBACK.surface,
    surface2: FALLBACK.surface2,
    border: theme.border || FALLBACK.border,
    text: theme.foreground || FALLBACK.text,
    muted: theme.mutedForeground || FALLBACK.muted,
    primary: theme.primary || FALLBACK.primary,
    success: theme.success || FALLBACK.success,
    error: theme.error || FALLBACK.error,
    purple: FALLBACK.purple,
    accent: FALLBACK.accent,
  };

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
    <Inline align="center" px={3} spacing={2} bg={C.bg} style={{ height: 48, borderBottomWidth: 1, borderBottomColor: C.border }}>
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
      <Box style={s.left}>
        <Inline align="center" spacing={2}>
          <Center style={s.logoIcon}>
            <Feather name="zap" size={13} color="#fff" />
          </Center>
          {!minimal && <Text fontSize={13} fontWeight="700" color={C.text} style={{ letterSpacing: -0.3 }}>Flipova</Text>}
        </Inline>
      </Box>

      {/* ── Device selector ── */}
      <Center flex={1}>
        <Pressable style={s.deviceBtn} onPress={() => setShowDevices(true)}>
          <Feather name={DEVICE_ICONS[device] || 'smartphone'} size={13} color={C.muted} />
          <Text style={s.deviceText} numberOfLines={1}>{device}</Text>
          <Feather name="chevron-down" size={11} color={C.muted} />
        </Pressable>
        <Modal visible={showDevices} transparent animationType="fade" onRequestClose={() => setShowDevices(false)}>
          <Pressable style={s.overlay} onPress={() => setShowDevices(false)}>
            <Box style={{ ...s.dropdown as any, borderColor: C.border }} bg={C.surface}>
              <FlatList data={DEVICES} keyExtractor={i => i} renderItem={({ item }) => (
                <Pressable style={[s.dropItem, item === device && s.dropItemActive]} onPress={() => { setDevice(item); setShowDevices(false); }}>
                  <Feather name={DEVICE_ICONS[item] || 'smartphone'} size={12} color={item === device ? C.primary : C.muted} />
                  <Text style={{ ...s.dropText as any, ...(item === device ? s.dropTextActive : {}) }}>{item}</Text>
                </Pressable>
              )} />
            </Box>
          </Pressable>
        </Modal>
      </Center>

      {/* ── Right actions ── */}
      <Box style={s.rightWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.rightContent} style={s.rightScroll}>

          {/* Zoom */}
          <Inline align="center" style={s.zoomRow}>
            <Pressable style={s.zoomBtn} onPress={() => setZoom(Math.max(25, zoom - 10))}>
              <Feather name="minus" size={11} color={C.muted} />
            </Pressable>
            <Text style={s.zoomText}>{zoom}%</Text>
            <Pressable style={s.zoomBtn} onPress={() => setZoom(Math.min(200, zoom + 10))}>
              <Feather name="plus" size={11} color={C.muted} />
            </Pressable>
          </Inline>

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
                  <Box style={{ ...s.moreDropdown as any, borderColor: C.border }} bg={C.surface}>
                    <Pressable style={s.moreItem} onPress={() => { onImport(); setShowMoreMenu(false); }}>
                      <Feather name="upload-cloud" size={13} color={C.text} /><Text style={s.moreItemText}>Importer</Text>
                    </Pressable>
                    <Pressable style={s.moreItem} onPress={() => { onExport(); setShowMoreMenu(false); }}>
                      <Feather name="download-cloud" size={13} color={C.text} /><Text style={s.moreItemText}>Exporter</Text>
                    </Pressable>
                    <Box style={s.moreDivider} bg={C.border} />
                    <Pressable style={s.moreItem} onPress={() => { setShowResetConfirm(true); setShowMoreMenu(false); }}>
                      <Feather name="trash-2" size={13} color={C.error} /><Text style={{ ...s.moreItemText as any, color: C.error }}>Réinitialiser</Text>
                    </Pressable>
                  </Box>
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
              <Inline align="center" spacing={2}>
                <Spinner size={12} color="#fff" />
                <Text fontSize={12} fontWeight="700" color="#fff">Génération…</Text>
              </Inline>
            ) : (
              <Inline align="center" spacing={2}>
                <Feather name="zap" size={13} color="#fff" />
                <Text fontSize={12} fontWeight="700" color="#fff">Generate</Text>
              </Inline>
            )}
          </Pressable>

        </ScrollView>
      </Box>
    </Inline>
  );
};

export default Topbar;

const s = StyleSheet.create({
  // Logo
  left: { flexShrink: 0 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIcon: {
    width: 24, height: 24, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
  },
  // Device
  deviceBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1,
  },
  deviceText: { fontSize: 12, fontWeight: '500' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  dropdown: {
    borderRadius: 8, borderWidth: 1,
    width: 220, maxHeight: 300, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16,
  },
  dropItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 11 },
  dropItemActive: { backgroundColor: 'rgba(59,130,246,0.1)' },
  dropText: { fontSize: 13 },
  dropTextActive: { fontWeight: '600' },
  // Right
  rightWrapper: { flexShrink: 0, maxWidth: '62%' },
  rightScroll: { flexGrow: 0 },
  rightContent: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  divider: { width: 1, height: 20, marginHorizontal: 4 },
  // Zoom
  zoomRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    overflow: 'hidden',
  },
  zoomBtn: { paddingHorizontal: 8, paddingVertical: 6 },
  zoomText: { fontSize: 11, minWidth: 34, textAlign: 'center', fontVariant: ['tabular-nums'] as any },
  // Icon button
  iconBtn: {
    width: 30, height: 30, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
  },
  // Generate
  genBtn: {
    borderRadius: 6,
    paddingHorizontal: 12, paddingVertical: 6,
    marginLeft: 2,
  },
  // More dropdown
  moreDropdown: {
    borderRadius: 8, borderWidth: 1,
    minWidth: 180, overflow: 'hidden',
    position: 'absolute', top: 48, right: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12,
  },
  moreItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 11 },
  moreItemText: { fontSize: 13 },
  moreDivider: { height: 1, marginHorizontal: 10 },
});
