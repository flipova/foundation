import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal as RNModal, Platform } from 'react-native';
import Topbar from './Topbar';
import Statusbar from './Statusbar';
import ResizeHandle from './ResizeHandle';
import LibraryPanel from '../panels/library';
import LayersPanel from '../panels/layers';
import DeviceCanvas from '../panels/canvas';
import PropertiesPanel from '../panels/properties';
import CodePanel from '../panels/properties/CodePanel';
import ThemeEditorModal from '../modals/ThemeEditorModal';
import ProjectSettingsModal from '../modals/ProjectSettingsModal';
import ServiceConnectorModal from '../modals/ServiceConnectorModal';
import DataQueryModal from '../modals/DataQueryModal';
import CustomFunctionModal from '../modals/CustomFunctionModal';
import SnackModal from '../modals/SnackModal';
import { usePanelWidth } from '../shared/usePanelWidth';
import { useWindowSize } from '../shared/useWindowSize';
import { useStudio } from '../useStudio';
import { LAYOUT_RESPONSIVE, Z_INDEX } from './layoutResponsive';
import { colors } from '../ds';

export default function StudioLayout() {
  const [showTheme,    setShowTheme]    = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showQueries,  setShowQueries]  = useState(false);
  const [showCode,     setShowCode]     = useState(false);
  const [showCustomFn, setShowCustomFn] = useState(false);
  const [showSnack,    setShowSnack]    = useState(false);

  useEffect(() => {
    const handleOpenSettings = () => setShowSettings(true);
    window.addEventListener('open-settings', handleOpenSettings);
    return () => window.removeEventListener('open-settings', handleOpenSettings);
  }, []);

  const {
    selId, setSel, removeNode, undo, redo,
    copyNode, pasteNode, duplicateNode, page,
  } = useStudio();

  const windowSize = useWindowSize();
  const left  = usePanelWidth(230, 160, 360);
  const right = usePanelWidth(280, 220, 420);

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
      const ctrl  = e.ctrlKey || e.metaKey;
      const tag   = (e.target as HTMLElement)?.tagName;
      const inInput = ['INPUT', 'TEXTAREA'].includes(tag);
      if ((e.key === 'Delete' || e.key === 'Backspace') && selId && !inInput) { e.preventDefault(); removeNode(selId); }
      if (ctrl && e.key === 'z' && !e.shiftKey)              { e.preventDefault(); undo(); }
      if (ctrl && (e.key === 'z' && e.shiftKey || e.key === 'y')) { e.preventDefault(); redo(); }
      if (ctrl && e.key === 'd')                              { e.preventDefault(); if (selId) duplicateNode(selId); }
      if (ctrl && e.key === 'c' && selId && !inInput)         copyNode(selId);
      if (ctrl && e.key === 'v' && !inInput)                  { const pg = page(); if (pg) pasteNode(selId || pg.root.id); }
      if (e.key === 'Escape')                                 { setSel(null); setShowCode(false); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [selId, setSel, removeNode, undo, redo, copyNode, pasteNode, duplicateNode, page]);

  return (
    <View style={s.root}>
      {/* Topbar */}
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

      {/* Main area */}
      <View style={s.main}>
        {/* Left panel: Library + Layers */}
        <View style={[s.leftPanel, { width: effectiveLeftWidth }]}>
          <LibraryPanel />
          <LayersPanel />
        </View>

        <ResizeHandle side="left" onResize={left.onResize} currentSize={effectiveLeftWidth} />

        {/* Canvas */}
        <View style={s.canvas}>
          <DeviceCanvas />
        </View>

        <ResizeHandle side="right" onResize={right.onResize} currentSize={effectiveRightWidth} />

        {/* Right panel: Properties */}
        <View style={{ width: effectiveRightWidth }}>
          <PropertiesPanel />
        </View>
      </View>

      {/* Statusbar */}
      <Statusbar />

      {/* Code IDE — full-screen modal */}
      <RNModal visible={showCode} animationType="fade" transparent={false} onRequestClose={() => setShowCode(false)}>
        <View style={s.codeModal}>
          <CodePanel onClose={() => setShowCode(false)} />
        </View>
      </RNModal>

      {showTheme    && <ThemeEditorModal      onClose={() => setShowTheme(false)}    />}
      {showSettings && <ProjectSettingsModal  onClose={() => setShowSettings(false)} />}
      {showServices && <ServiceConnectorModal onClose={() => setShowServices(false)} />}
      {showQueries  && <DataQueryModal        onClose={() => setShowQueries(false)}  />}
      {showCustomFn && <CustomFunctionModal   onClose={() => setShowCustomFn(false)} />}
      {showSnack    && <SnackModal visible={showSnack} onClose={() => setShowSnack(false)} />}
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  leftPanel: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
    overflow: 'hidden',
    zIndex: Z_INDEX.PANEL,
  },
  canvas: {
    flex: 1,
    overflow: 'hidden',
    zIndex: Z_INDEX.PANEL,
  },
  codeModal: {
    flex: 1,
    backgroundColor: colors.bg,
    position: 'relative',
    overflow: 'hidden',
    zIndex: Z_INDEX.MODAL,
  },
});
