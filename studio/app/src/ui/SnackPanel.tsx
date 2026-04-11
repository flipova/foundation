/**
 * SnackPanel — Send the current project to Expo Snack for live testing.
 *
 * The Snack session is kept alive in a module-level singleton so closing
 * the panel doesn't tear down the session. Re-opening shows the live state.
 * File edits (via /generate/write) are automatically pushed to Snack.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Snack } from 'snack-sdk';
import QRCodeImage from './QRCodeImage';

const C = {
  bg: '#080c18', surface: '#0d1220', surface2: '#131a2e',
  border: '#1a2240', text: '#d0d8f0', muted: '#6a7494',
  primary: '#3b82f6', success: '#22c55e', error: '#ef4444',
  purple: '#a78bfa',
};

const API = '/api';

type SnackStatus = 'idle' | 'loading' | 'online' | 'error';
type SyncDirection = 'push' | 'pull' | null;

// ---------------------------------------------------------------------------
// Module-level singleton — survives panel unmount/remount
// ---------------------------------------------------------------------------
let _snack: InstanceType<typeof Snack> | null = null;
let _snackUrl: string | null = null;
let _webUrl: string | null = null;
let _localFoundation = false;

function getSnack() { return _snack; }

// ---------------------------------------------------------------------------

export const SnackPanel: React.FC = () => {
  const [status, setStatus] = useState<SnackStatus>(_snack ? 'online' : 'idle');
  const [snackUrl, setSnackUrl] = useState<string | null>(_snackUrl);
  const [webUrl, setWebUrl] = useState<string | null>(_webUrl);
  const [error, setError] = useState<string | null>(null);
  const [connectedClients, setConnectedClients] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [localFoundation, setLocalFoundation] = useState(_localFoundation);
  const [syncDirection, setSyncDirection] = useState<SyncDirection>(null);
  const [syncError, setSyncError] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const lastKnownFilesRef = useRef<Record<string, { contents: string }>>({});
  const pendingWritesRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Re-attach state listener when panel mounts and snack already exists
  useEffect(() => {
    if (_snack) {
      const unsub = _snack.addStateListener((state) => {
        setConnectedClients(Object.keys(state.connectedClients || {}).length);
        if (state.url) { _snackUrl = state.url; setSnackUrl(state.url); }

        // Snack → local: detect changed files and write back
        for (const [filePath, file] of Object.entries(state.files ?? {})) {
          const known = lastKnownFilesRef.current[filePath];
          const contents = (file as any).contents ?? '';
          if (known?.contents === contents) continue;

          clearTimeout(pendingWritesRef.current.get(filePath));
          pendingWritesRef.current.set(filePath, setTimeout(async () => {
            pendingWritesRef.current.delete(filePath);
            try {
              await fetch(`${API}/generate/write`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: filePath, content: contents }),
              });
              lastKnownFilesRef.current[filePath] = { contents };
              setSyncDirection('pull');
              setLastUpdated(new Date());
            } catch (e) {
              console.error('[SnackPanel] Snack→local write failed:', e);
              setSyncError(true);
            }
          }, 500));
        }
      });
      return () => unsub();
    }
  }, []);

  // WebSocket — listen for file-write events and push to Snack
  useEffect(() => {
    const wsUrl = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = async (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'file:written' && _snack) {
          // A file was edited — fetch the updated generated files and push
          const res = await fetch(`${API}/snack/export`, { method: 'POST' });
          if (!res.ok) return;
          const { files, dependencies } = await res.json();
          _snack.updateFiles(files);
          _snack.updateDependencies(dependencies);
          setSyncDirection('push');
          setLastUpdated(new Date());
        }
      } catch {}
    };

    return () => { ws.close(); wsRef.current = null; };
  }, []);

  const openInSnack = useCallback(async () => {
    setStatus('loading');
    setError(null);
    _localFoundation = localFoundation;

    try {
      // 1. Regenerate
      const genRes = await fetch(`${API}/generate/all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ localFoundation }),
      });
      if (!genRes.ok) throw new Error(`Generate error: ${genRes.status}`);

      // 2. Get files from disk
      const res = await fetch(`${API}/snack/export`, { method: 'POST' });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const { files, dependencies, name } = await res.json();

      // 3. Tear down existing session
      if (_snack) { _snack.setOnline(false); _snack = null; }

      // 4. Create Snack
      const snack = new Snack({
        name: name || 'Flipova Preview',
        description: 'Generated by Flipova Studio',
        files,
        dependencies,
        online: false,
        codeChangesDelay: 500,
      });

      snack.addStateListener((state) => {
        setConnectedClients(Object.keys(state.connectedClients || {}).length);
        if (state.url) { _snackUrl = state.url; setSnackUrl(state.url); }

        // Snack → local: detect changed files and write back
        for (const [filePath, file] of Object.entries(state.files ?? {})) {
          const known = lastKnownFilesRef.current[filePath];
          const contents = (file as any).contents ?? '';
          if (known?.contents === contents) continue;

          clearTimeout(pendingWritesRef.current.get(filePath));
          pendingWritesRef.current.set(filePath, setTimeout(async () => {
            pendingWritesRef.current.delete(filePath);
            try {
              await fetch(`${API}/generate/write`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: filePath, content: contents }),
              });
              lastKnownFilesRef.current[filePath] = { contents };
              setSyncDirection('pull');
              setLastUpdated(new Date());
            } catch (e) {
              console.error('[SnackPanel] Snack→local write failed:', e);
              setSyncError(true);
            }
          }, 500));
        }
      });

      _snack = snack;

      // 5. Go online
      snack.setOnline(true);
      const state = await snack.getStateAsync();
      _snackUrl = state.url || null;
      setSnackUrl(_snackUrl);

      const saved = await snack.saveAsync();
      const savedId = (saved as any).id || '';
      _webUrl = savedId ? `https://snack.expo.dev/${savedId}` : `https://snack.expo.dev`;
      setWebUrl(_webUrl);
      setLastUpdated(new Date());
      setStatus('online');
    } catch (e: any) {
      setError(e.message || 'Failed to create Snack');
      setStatus('error');
    }
  }, [localFoundation]);

  const pushUpdate = useCallback(async () => {
    if (!_snack) return;
    setStatus('loading');
    try {
      const genRes = await fetch(`${API}/generate/all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ localFoundation }),
      });
      if (!genRes.ok) throw new Error(`Generate error: ${genRes.status}`);

      const res = await fetch(`${API}/snack/export`, { method: 'POST' });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const { files, dependencies } = await res.json();
      _snack.updateFiles(files);
      _snack.updateDependencies(dependencies);
      setSyncDirection('push');
      setLastUpdated(new Date());
      setStatus('online');
    } catch (e: any) {
      setError(e.message || 'Failed to push update');
      setStatus('error');
    }
  }, [localFoundation]);

  const closeSnack = useCallback(() => {
    // Cancel all pending debounced writes
    for (const timer of pendingWritesRef.current.values()) {
      clearTimeout(timer);
    }
    pendingWritesRef.current.clear();
    lastKnownFilesRef.current = {};

    if (_snack) { _snack.setOnline(false); _snack = null; }
    _snackUrl = null; _webUrl = null;
    setStatus('idle');
    setSnackUrl(null);
    setWebUrl(null);
    setConnectedClients(0);
    setSyncDirection(null);
    setSyncError(false);
  }, []);

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerIcon}>
          <Feather name="smartphone" size={14} color={C.purple} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Expo Snack</Text>
          <Text style={s.headerSub}>Test on a real device</Text>
        </View>
        {status === 'online' && <View style={s.onlineDot} />}
      </View>

      {/* Idle */}
      {status === 'idle' && (
        <View style={s.body}>
          <Text style={s.desc}>
            Send your project to Expo Snack and scan the QR code with the Expo Go app to test on a real device.
          </Text>
          <Pressable style={s.toggleRow} onPress={() => setLocalFoundation(v => !v)}>
            <View style={[s.toggleBox, localFoundation && s.toggleBoxOn]}>
              {localFoundation && <Feather name="check" size={10} color="#fff" />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.toggleLabel}>Copy foundation locally</Text>
              <Text style={s.toggleSub}>Embed @flipova/foundation sources instead of using the GitHub registry</Text>
            </View>
          </Pressable>
          <Pressable style={s.primaryBtn} onPress={openInSnack}>
            <Feather name="send" size={13} color="#fff" />
            <Text style={s.primaryBtnText}>Open in Snack</Text>
          </Pressable>
        </View>
      )}

      {/* Loading */}
      {status === 'loading' && (
        <View style={s.body}>
          <ActivityIndicator color={C.purple} size="small" />
          <Text style={s.loadingText}>Generating & uploading…</Text>
        </View>
      )}

      {/* Error */}
      {status === 'error' && (
        <View style={s.body}>
          <View style={s.errorBox}>
            <Feather name="alert-circle" size={12} color={C.error} />
            <Text style={s.errorText}>{error}</Text>
          </View>
          <Pressable style={s.primaryBtn} onPress={openInSnack}>
            <Feather name="refresh-cw" size={12} color="#fff" />
            <Text style={s.primaryBtnText}>Retry</Text>
          </Pressable>
        </View>
      )}

      {/* Online */}
      {status === 'online' && (
        <View style={s.body}>
          <View style={s.statusRow}>
            <View style={s.onlinePill}>
              <View style={s.onlineDotSmall} />
              <Text style={s.onlinePillText}>Live</Text>
            </View>
            {connectedClients > 0 && (
              <View style={s.clientsBadge}>
                <Feather name="smartphone" size={9} color={C.success} />
                <Text style={s.clientsText}>{connectedClients} connected</Text>
              </View>
            )}
            {syncDirection && (
              <View style={s.syncBadge}>
                <Text style={s.syncBadgeText}>
                  {syncDirection === 'push' ? '↑ push' : '↓ pull'}
                </Text>
              </View>
            )}
            {syncError && (
              <View style={s.syncErrorBadge}>
                <Feather name="alert-triangle" size={9} color={C.error} />
                <Text style={s.syncErrorText}>sync error</Text>
              </View>
            )}
            {lastUpdated && (
              <Text style={s.updatedText}>
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            )}
          </View>

          {snackUrl && (
            <View style={s.qrContainer}>
              <QRCodeImage value={snackUrl} size={160} backgroundColor="#080c18" color="#d0d8f0" />
              <Text style={s.qrCaption}>Scanner avec Expo Go</Text>
            </View>
          )}

          {snackUrl && (
            <View style={s.urlBox}>
              <Text style={s.urlLabel}>Expo Go URL</Text>
              <Text style={s.urlText} numberOfLines={2} selectable>{snackUrl}</Text>
            </View>
          )}

          {webUrl && (
            <Pressable style={s.webLinkBtn} onPress={() => Linking.openURL(webUrl)}>
              <Feather name="external-link" size={11} color={C.primary} />
              <Text style={s.webLinkText}>Open in browser</Text>
            </Pressable>
          )}

          <View style={s.actions}>
            <Pressable style={s.secondaryBtn} onPress={pushUpdate}>
              <Feather name="upload-cloud" size={11} color={C.text} />
              <Text style={s.secondaryBtnText}>Push update</Text>
            </Pressable>
            <Pressable style={[s.secondaryBtn, s.dangerBtn]} onPress={closeSnack}>
              <Feather name="x" size={11} color={C.error} />
              <Text style={[s.secondaryBtnText, { color: C.error }]}>Close</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default SnackPanel;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  headerIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(167,139,250,0.12)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: C.text, fontSize: 12, fontWeight: '700' },
  headerSub: { color: C.muted, fontSize: 9, marginTop: 1 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.success },
  body: { padding: 14, gap: 12 },
  desc: { color: C.muted, fontSize: 11, lineHeight: 16 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: C.purple, borderRadius: 8, paddingVertical: 10 },
  primaryBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  loadingText: { color: C.muted, fontSize: 11, textAlign: 'center' },
  errorBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: 7, padding: 10, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  errorText: { color: C.error, fontSize: 10, flex: 1, lineHeight: 14 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  onlinePill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(34,197,94,0.1)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 10 },
  onlineDotSmall: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.success },
  onlinePillText: { color: C.success, fontSize: 9, fontWeight: '700' },
  clientsBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clientsText: { color: C.success, fontSize: 9 },
  updatedText: { color: C.muted, fontSize: 9, marginLeft: 'auto' as any },
  qrContainer: { alignItems: 'center', gap: 8, paddingVertical: 4 },
  qrCaption: { color: '#6a7494', fontSize: 10, textAlign: 'center' },
  urlBox: { backgroundColor: C.bg, borderRadius: 7, padding: 10, borderWidth: 1, borderColor: C.border, gap: 3 },
  urlLabel: { color: C.muted, fontSize: 8, fontWeight: '600', textTransform: 'uppercase' as any, letterSpacing: 0.5 },
  urlText: { color: C.primary, fontSize: 10, fontFamily: 'monospace' as any },
  webLinkBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  webLinkText: { color: C.primary, fontSize: 11, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 8 },
  secondaryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: C.surface2, borderRadius: 7, paddingVertical: 8, borderWidth: 1, borderColor: C.border },
  secondaryBtnText: { color: C.text, fontSize: 11, fontWeight: '600' },
  dangerBtn: { borderColor: 'rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.06)' },
  toggleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: C.surface2, borderRadius: 8, padding: 10, borderWidth: 1, borderColor: C.border },
  toggleBox: { width: 16, height: 16, borderRadius: 4, borderWidth: 1.5, borderColor: C.muted, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  toggleBoxOn: { backgroundColor: C.purple, borderColor: C.purple },
  toggleLabel: { color: C.text, fontSize: 11, fontWeight: '600' },
  toggleSub: { color: C.muted, fontSize: 9, lineHeight: 13, marginTop: 2 },
  syncBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(59,130,246,0.12)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  syncBadgeText: { color: C.primary, fontSize: 9, fontWeight: '700' },
  syncErrorBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(239,68,68,0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  syncErrorText: { color: C.error, fontSize: 9, fontWeight: '600' },
});
