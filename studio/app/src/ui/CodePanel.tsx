/**
 * CodePanel — Full IDE panel.
 *
 * Features:
 * - File explorer showing all files that would be generated (same as generated/ folder)
 * - Syntax-highlighted code viewer (monospace, line numbers)
 * - Edit mode: changes sync back to the project via the generate endpoint
 * - Auto-refresh when project changes
 * - Copy file content
 */
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Platform, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStudio } from '../store/StudioProvider';
import Tooltip from './shared/Tooltip';
import { CODE_TEXTS } from './codeTexts';
import { useWindowSize } from './shared/useWindowSize';
import { CODE_RESPONSIVE } from './codeResponsive';

export { CODE_TEXTS };
export { CODE_RESPONSIVE };

const C = {
  bg: '#080c18', surface: '#0d1220', s2: '#131a2e', border: '#1a2240',
  text: '#d0d8f0', muted: '#6a7494', primary: '#3b82f6',
  green: '#22c55e', yellow: '#f59e0b', red: '#ef4444', cyan: '#22d3ee',
  purple: '#a78bfa',
};

// ---------------------------------------------------------------------------
// SkeletonLine — animated placeholder for loading state
// ---------------------------------------------------------------------------
const SkeletonLine: React.FC<{ width?: string | number; height?: number }> = ({ width = '100%', height = 10 }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 600, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);
  // Convert string width to number for Animated.View compatibility
  const widthValue = typeof width === 'string' ? parseFloat(width) || 100 : width;
  return (
    <Animated.View style={{ width: widthValue, height, borderRadius: 4, backgroundColor: C.s2, opacity, marginBottom: 6 }} />
  );
};

const FileSkeleton: React.FC = () => (
  <View style={{ padding: 10, gap: 4 }}>
    {[80, 60, 90, 50, 70].map((w, i) => (
      <SkeletonLine key={i} width={`${w}%`} height={9} />
    ))}
  </View>
);

const API = Platform.OS === 'web' ? '/api' : 'http://localhost:4200/api';

interface GeneratedFile { path: string; content: string; }

// File icon by extension
function fileIcon(path: string): { icon: React.ComponentProps<typeof Feather>['name']; color: string } {
  if (path.endsWith('.tsx') || path.endsWith('.ts')) return { icon: 'code', color: C.cyan };
  if (path.endsWith('.json')) return { icon: 'file-text', color: C.yellow };
  if (path.endsWith('.md')) return { icon: 'book-open', color: C.muted };
  if (path.endsWith('.yml') || path.endsWith('.yaml')) return { icon: 'settings', color: C.purple };
  if (path.endsWith('.env')) return { icon: 'lock', color: C.red };
  return { icon: 'file', color: C.muted };
}

// Build a tree from flat file paths
interface FileNode {
  name: string;
  path: string;
  isDir: boolean;
  children: FileNode[];
  content?: string;
}

function buildTree(files: GeneratedFile[]): FileNode[] {
  const root: FileNode[] = [];
  for (const f of files) {
    const parts = f.path.split('/');
    let nodes = root;
    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const isLast = i === parts.length - 1;
      let existing = nodes.find(n => n.name === name);
      if (!existing) {
        existing = { name, path: parts.slice(0, i + 1).join('/'), isDir: !isLast, children: [], content: isLast ? f.content : undefined };
        nodes.push(existing);
      } else if (isLast) {
        existing.content = f.content;
      }
      nodes = existing.children;
    }
  }
  // Sort: dirs first, then files
  const sort = (nodes: FileNode[]) => {
    nodes.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach(n => sort(n.children));
  };
  sort(root);
  return root;
}

// ---------------------------------------------------------------------------
// FileTree component
// ---------------------------------------------------------------------------
const FileTree: React.FC<{
  nodes: FileNode[];
  depth: number;
  selected: string | null;
  onSelect: (path: string, content: string) => void;
}> = ({ nodes, depth, selected, onSelect }) => {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggle = (path: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path); else next.add(path);
      return next;
    });
  };

  return (
    <>
      {nodes.map(node => {
        const isCollapsed = collapsed.has(node.path);
        const isSelected = selected === node.path;
        const { icon, color } = fileIcon(node.path);
        const indent = depth * 12;

        return (
          <View key={node.path}>
            <Pressable
              style={[ft.row, isSelected && ft.rowSelected, { paddingLeft: 8 + indent }]}
              onPress={() => {
                if (node.isDir) toggle(node.path);
                else if (node.content !== undefined) onSelect(node.path, node.content);
              }}
            >
              {node.isDir ? (
                <Feather name={isCollapsed ? 'chevron-right' : 'chevron-down'} size={10} color={C.muted} style={{ marginRight: 4 }} />
              ) : (
                <View style={{ width: 14 }} />
              )}
              <Feather
                name={node.isDir ? (isCollapsed ? 'folder' : 'folder') : icon}
                size={11}
                color={node.isDir ? C.yellow : color}
                style={{ marginRight: 5 }}
              />
              <Text style={[ft.name, isSelected && ft.nameSelected, node.isDir && ft.dirName]} numberOfLines={1}>
                {node.name}
              </Text>
            </Pressable>
            {node.isDir && !isCollapsed && (
              <FileTree nodes={node.children} depth={depth + 1} selected={selected} onSelect={onSelect} />
            )}
          </View>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------
// Code viewer with line numbers
// ---------------------------------------------------------------------------
const CodeViewer: React.FC<{
  content: string;
  editing: boolean;
  onChange: (v: string) => void;
}> = ({ content, editing, onChange }) => {
  const lines = content.split('\n');

  if (editing) {
    return (
      <View style={{ flex: 1 }}>
        <TextInput
          style={cv.editor}
          value={content}
          onChangeText={onChange}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
        />
      </View>
    );
  }

  return (
    <ScrollView style={cv.root} contentContainerStyle={cv.content}>
      <View style={cv.lineNumbers}>
        {lines.map((_, i) => (
          <Text key={i} style={cv.lineNum}>{i + 1}</Text>
        ))}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={cv.codeLines}>
          {lines.map((line, i) => (
            <Text key={i} style={cv.line} selectable>{line || ' '}</Text>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

// ---------------------------------------------------------------------------
// Main CodePanel
// ---------------------------------------------------------------------------
const CodePanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { project, pageId } = useStudio();
  const { width: windowWidth } = useWindowSize();
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const skeletonTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState('');
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const explorerWidth = CODE_RESPONSIVE.getExplorerWidth(windowWidth);

  // Show skeleton only after 300ms of loading (Requirement 16.1)
  useEffect(() => {
    if (loading) {
      skeletonTimer.current = setTimeout(() => setShowSkeleton(true), 300);
    } else {
      if (skeletonTimer.current) clearTimeout(skeletonTimer.current);
      setShowSkeleton(false);
    }
    return () => { if (skeletonTimer.current) clearTimeout(skeletonTimer.current); };
  }, [loading]);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/generate`, { method: 'POST' });
      const data = await res.json();
      // data.files is an array of paths — we need to read the generated files
      // Use the preview endpoint to get all file contents
      const allRes = await fetch(`${API}/generate/all`, { method: 'POST' });
      if (allRes.ok) {
        const allData = await allRes.json();
        setFiles(allData.files || []);
        // Auto-select first .tsx file
        const firstTsx = (allData.files || []).find((f: GeneratedFile) => f.path.endsWith('.tsx'));
        if (firstTsx && !selectedPath) {
          setSelectedPath(firstTsx.path);
          setSelectedContent(firstTsx.content);
        }
      } else {
        // Fallback: generate preview for current page only
        const previewRes = await fetch(`${API}/generate/preview/${pageId}`, { method: 'POST' });
        const previewData = await previewRes.json();
        const fallback: GeneratedFile[] = [{ path: 'app/(tabs)/HomeScreen.tsx', content: previewData.code || '' }];
        setFiles(fallback);
        setSelectedPath(fallback[0].path);
        setSelectedContent(fallback[0].content);
      }
    } catch {
      setFiles([]);
    }
    setLoading(false);
  }, [pageId, selectedPath]);

  useEffect(() => { fetchFiles(); }, [project?.version]);

  const tree = useMemo(() => buildTree(files), [files]);

  const handleSelect = (path: string, content: string) => {
    setSelectedPath(path);
    setSelectedContent(content);
    setEditing(false);
    setEditContent(content);
  };

  const startEdit = () => {
    setEditContent(selectedContent);
    setEditing(true);
  };

  const saveEdit = async () => {
    // Update the file in our local state
    setFiles(prev => prev.map(f => f.path === selectedPath ? { ...f, content: editContent } : f));
    setSelectedContent(editContent);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    // Optionally write back to disk via API
    try {
      await fetch(`${API}/generate/write`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: selectedPath, content: editContent }),
      });
    } catch {}
  };

  const copy = () => {
    if (Platform.OS === 'web') {
      try { navigator.clipboard.writeText(selectedContent); } catch {}
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const currentFile = selectedPath ? files.find(f => f.path === selectedPath) : null;
  const { icon: selIcon, color: selColor } = selectedPath ? fileIcon(selectedPath) : { icon: 'file' as const, color: C.muted };

  return (
    <View style={s.root}>
      {/* Top bar */}
      <View style={s.topbar}>
        <Feather name="code" size={13} color={C.primary} />
        <Text style={s.topbarTitle}>Generated Code</Text>
        <Tooltip text={CODE_TEXTS.tooltips.refresh}>
          <Pressable onPress={fetchFiles} style={s.iconBtn} disabled={loading}>
            <Feather name="refresh-cw" size={12} color={loading ? C.muted : C.text} />
          </Pressable>
        </Tooltip>
        <Pressable onPress={onClose} style={s.iconBtn}>
          <Feather name="x" size={13} color={C.muted} />
        </Pressable>
      </View>

      <View style={s.body}>
        {/* File explorer */}
        <View style={[s.explorer, { width: explorerWidth }]}>
          <View style={s.explorerHeader}>
            <Text style={s.explorerTitle}>FILES</Text>
            <Text style={s.explorerCount}>{files.length}</Text>
          </View>
          <ScrollView style={s.explorerScroll} showsVerticalScrollIndicator={false}>
            {loading && showSkeleton ? (
              <FileSkeleton />
            ) : loading ? null : (
              <FileTree nodes={tree} depth={0} selected={selectedPath} onSelect={handleSelect} />
            )}
          </ScrollView>
        </View>

        {/* Editor area */}
        <View style={s.editor}>
          {selectedPath ? (
            <>
              {/* File tab bar */}
              <View style={s.tabBar}>
                <Feather name={selIcon} size={11} color={selColor} />
                <Text style={s.tabPath} numberOfLines={1} ellipsizeMode="tail">{selectedPath}</Text>
                <View style={s.tabActions}>
                  {editing ? (
                    <>
                      <Pressable onPress={() => setEditing(false)} style={s.actionBtn}>
                        <Feather name="x" size={11} color={C.muted} />
                        <Text style={s.actionBtnText}>Cancel</Text>
                      </Pressable>
                      <Pressable onPress={saveEdit} style={[s.actionBtn, s.actionBtnPrimary]}>
                        <Feather name="save" size={11} color="#fff" />
                        <Text style={[s.actionBtnText, { color: '#fff' }]}>{saved ? 'Saved!' : 'Save'}</Text>
                      </Pressable>
                    </>
                  ) : (
                    <>
                      <Tooltip text={CODE_TEXTS.tooltips.copy}>
                        <Pressable onPress={copy} style={s.actionBtn}>
                          <Feather name={copied ? 'check' : 'copy'} size={11} color={copied ? C.green : C.muted} />
                          <Text style={[s.actionBtnText, copied && { color: C.green }]}>{copied ? 'Copied' : 'Copy'}</Text>
                        </Pressable>
                      </Tooltip>
                      <Tooltip text={CODE_TEXTS.tooltips.edit}>
                        <Pressable onPress={startEdit} style={s.actionBtn}>
                          <Feather name="edit-2" size={11} color={C.muted} />
                          <Text style={s.actionBtnText}>Edit</Text>
                        </Pressable>
                      </Tooltip>
                    </>
                  )}
                </View>
              </View>
              {/* Edit mode banner */}
              {editing && (
                <View style={s.editBanner}>
                  <Feather name="edit-2" size={10} color={C.yellow} />
                  <Text style={s.editBannerText}>{CODE_TEXTS.editBanner}</Text>
                </View>
              )}
              {/* Code */}
              <CodeViewer
                content={editing ? editContent : selectedContent}
                editing={editing}
                onChange={setEditContent}
              />
            </>
          ) : (
            <View style={s.emptyEditor}>
              <Feather name="file-text" size={28} color={C.muted} />
              <Text style={s.emptyEditorText}>{CODE_TEXTS.emptyState}</Text>
              {loading && <Text style={s.loadingText}>{CODE_TEXTS.loading}</Text>}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default CodePanel;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, flexDirection: 'column' },
  topbar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.surface },
  topbarTitle: { color: C.text, fontSize: 12, fontWeight: '600', flex: 1 },
  iconBtn: { padding: 5, borderRadius: 4 },
  body: { flex: 1, flexDirection: 'row' },
  // Explorer
  explorer: { width: 200, borderRightWidth: 1, borderRightColor: C.border, backgroundColor: C.surface },
  explorerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: C.border },
  explorerTitle: { color: C.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  explorerCount: { color: C.muted, fontSize: 9, backgroundColor: C.s2, paddingHorizontal: 5, paddingVertical: 1, borderRadius: 8 },
  explorerScroll: { flex: 1 },
  loadingText: { color: C.muted, fontSize: 10, textAlign: 'center', padding: 16, fontStyle: 'italic' },
  // Editor
  editor: { flex: 1, flexDirection: 'column' },
  tabBar: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.s2 },
  tabPath: { flex: 1, color: C.text, fontSize: 10, fontFamily: 'monospace' as any },
  tabActions: { flexDirection: 'row', gap: 4 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 4, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  actionBtnPrimary: { backgroundColor: C.primary, borderColor: C.primary },
  actionBtnText: { color: C.muted, fontSize: 9, fontWeight: '500' },
  emptyEditor: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyEditorText: { color: C.muted, fontSize: 12 },
  editBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: 'rgba(245,158,11,0.1)', borderBottomWidth: 1, borderBottomColor: 'rgba(245,158,11,0.25)' },
  editBannerText: { color: C.yellow, fontSize: 10, flex: 1 },
});

const ft = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingRight: 8 },
  rowSelected: { backgroundColor: 'rgba(59,130,246,0.12)' },
  name: { color: C.muted, fontSize: 10, flex: 1 },
  nameSelected: { color: C.text, fontWeight: '600' },
  dirName: { color: C.text, fontWeight: '500' },
});

const cv = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { flexDirection: 'row', padding: 0 },
  lineNumbers: { paddingVertical: 8, paddingHorizontal: 8, borderRightWidth: 1, borderRightColor: C.border, backgroundColor: C.surface, minWidth: 40, alignItems: 'flex-end' },
  lineNum: { color: C.muted, fontSize: 10, fontFamily: 'monospace' as any, lineHeight: 18, textAlign: 'right' },
  codeLines: { paddingVertical: 8 },
  line: { color: '#22c55e', fontSize: 11, fontFamily: 'monospace' as any, lineHeight: 18, paddingHorizontal: 12 },
  editor: { flex: 1, backgroundColor: C.bg, color: '#22c55e', fontSize: 11, fontFamily: 'monospace' as any, lineHeight: 18, padding: 12, textAlignVertical: 'top' },
});
