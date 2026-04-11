import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Modal } from 'react-native';
import Topbar from '../src/ui/Topbar';
import LibraryPanel from '../src/ui/LibraryPanel';
import LayersPanel from '../src/ui/LayersPanel';
import DeviceCanvas from '../src/ui/DeviceCanvas';
import PropertiesPanel from '../src/ui/PropertiesPanel';
import CodePanel from '../src/ui/CodePanel';
import Statusbar from '../src/ui/Statusbar';
import ThemeEditorModal from '../src/ui/modals/ThemeEditorModal';
import ProjectSettingsModal from '../src/ui/modals/ProjectSettingsModal';
import ServiceConnectorModal from '../src/ui/modals/ServiceConnectorModal';
import DataQueryModal from '../src/ui/modals/DataQueryModal';
import CustomFunctionModal from '../src/ui/modals/CustomFunctionModal';
import SnackModal from '../src/ui/modals/SnackModal';
import ResizeHandle from '../src/ui/shared/ResizeHandle';
import { usePanelWidth } from '../src/ui/shared/usePanelWidth';
import { useWindowSize } from '../src/ui/shared/useWindowSize';
import { useStudio } from '../src/store/StudioProvider';
import { LAYOUT_RESPONSIVE, Z_INDEX } from '../src/ui/layoutResponsive';

export default function StudioScreen() {
  const [showTheme, setShowTheme] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showQueries, setShowQueries] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showCustomFn, setShowCustomFn] = useState(false);
  const [showSnack, setShowSnack] = useState(false);

  const { selId, setSel, removeNode, undo, redo, copyNode, pasteNode, duplicateNode, page } = useStudio();

  const windowSize = useWindowSize();
  const left  = usePanelWidth(230, 160, 360);
  const right = usePanelWidth(280, 220, 420);

  // Clamp panel widths so the DeviceCanvas is never covered (Requirement 15.6)
  const clamped = LAYOUT_RESPONSIVE.clampPanelWidths(
    windowSize.width || 1280,
    left.width,
    right.width,
  );
  const effectiveLeftWidth  = clamped.left;
  const effectiveRightWidth = clamped.right;

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const tag = (e.target as HTMLElement)?.tagName;
      const inInput = ['INPUT', 'TEXTAREA'].includes(tag);
      if ((e.key === 'Delete' || e.key === 'Backspace') && selId && !inInput) { e.preventDefault(); removeNode(selId); }
      if (ctrl && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if (ctrl && (e.key === 'z' && e.shiftKey || e.key === 'y')) { e.preventDefault(); redo(); }
      if (ctrl && e.key === 'd') { e.preventDefault(); if (selId) duplicateNode(selId); }
      if (ctrl && e.key === 'c' && selId && !inInput) copyNode(selId);
      if (ctrl && e.key === 'v' && !inInput) { const pg = page(); if (pg) pasteNode(selId || pg.root.id); }
      if (e.key === 'Escape') { setSel(null); setShowCode(false); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [selId, setSel, removeNode, undo, redo, copyNode, pasteNode, duplicateNode, page]);

  return (
    <View style={s.root}>
      <Topbar
        onOpenTheme={() => setShowTheme(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenServices={() => setShowServices(true)}
        onOpenQueries={() => setShowQueries(true)}
        onToggleCode={() => setShowCode(c => !c)}
        showCode={showCode}
        onOpenCustomFn={() => setShowCustomFn(true)}
        onOpenSnack={() => setShowSnack(true)}
      />

      <View style={s.body}>
        <View style={[s.leftPanel, { width: effectiveLeftWidth }]}>
          <LibraryPanel />
          <LayersPanel />
        </View>
        <ResizeHandle side="left" onResize={left.onResize} currentSize={effectiveLeftWidth} />
        <View style={s.center}>
          <DeviceCanvas />
        </View>
        <ResizeHandle side="right" onResize={right.onResize} currentSize={effectiveRightWidth} />
        <View style={{ width: effectiveRightWidth }}>
          <PropertiesPanel />
        </View>
      </View>

      <Statusbar />

      {/* Code IDE — full-screen modal */}
      <Modal visible={showCode} animationType="fade" transparent={false} onRequestClose={() => setShowCode(false)}>
        <View style={s.codeModal}>
          <CodePanel onClose={() => setShowCode(false)} />
        </View>
      </Modal>

      {showTheme    && <ThemeEditorModal    onClose={() => setShowTheme(false)} />}
      {showSettings && <ProjectSettingsModal onClose={() => setShowSettings(false)} />}
      {showServices && <ServiceConnectorModal onClose={() => setShowServices(false)} />}
      {showQueries  && <DataQueryModal       onClose={() => setShowQueries(false)} />}
      {showCustomFn && <CustomFunctionModal  onClose={() => setShowCustomFn(false)} />}
      {showSnack    && <SnackModal visible={showSnack} onClose={() => setShowSnack(false)} />}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#080c18' },
  body: { flex: 1, flexDirection: 'row', overflow: 'hidden' as any },
  leftPanel: { borderRightWidth: 1, borderRightColor: '#1a2240', zIndex: Z_INDEX.PANEL },
  center: { flex: 1, overflow: 'hidden' as any, zIndex: Z_INDEX.PANEL },
  codeModal: { flex: 1, backgroundColor: '#080c18', zIndex: Z_INDEX.MODAL },
});
