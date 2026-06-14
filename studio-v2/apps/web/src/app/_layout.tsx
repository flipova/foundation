import '@/global.css';
import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useStudioStore } from '@flipova/studio-core';
import { ToastProvider } from '../ui/shared/Toast';
import { colors } from '../ui/ds';

// ─── Web: inject Lexend @font-face + force RN Web font override ───────────────
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  // 1. Inject Google Fonts link if not already present
  if (!document.querySelector('#lexend-font-link')) {
    const link = document.createElement('link');
    link.id   = 'lexend-font-link';
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link);
  }
  
  // Set browser title
  document.title = 'Flipova - Foundation Studio 2';

  // 1b. Inject Feather icon font
  if (!document.querySelector('#feather-font-link')) {
    const iconFontStyles = `@font-face {
      src: url(${require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ttf')});
      font-family: Feather;
    }`;
    const style = document.createElement('style');
    style.id = 'feather-font-link';
    style.appendChild(document.createTextNode(iconFontStyles));
    document.head.appendChild(style);
  }
  // 2. Inject a style tag that overrides RN Web's inline fontFamily and enforces dark mode inputs
  if (!document.querySelector('#rnweb-font-override')) {
    const style = document.createElement('style');
    style.id = 'rnweb-font-override';
    style.textContent = `
      /* Base font fallback (does not override inline vector icons) */
      html, body, #root {
        font-family: 'Lexend', ui-sans-serif, system-ui, sans-serif;
        color-scheme: dark;
      }
      /* Optional: default text elements if needed without !important */
      [class*="css-"] {
        font-family: 'Lexend', ui-sans-serif, system-ui, sans-serif;
      }
      /* Prevent black-on-black in native inputs on Web */
      input, textarea, select {
        color: ${colors.text};
      }
    `;
    document.head.appendChild(style);
  }
}

// ─── Error Boundary ──────────────────────────────────────────────────────────
interface EBState { error: Error | null; info: string }
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, EBState> {
  state: EBState = { error: null, info: '' };
  static getDerivedStateFromError(error: Error): EBState {
    return { error, info: '' };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error.message, info.componentStack);
    this.setState({ info: info.componentStack || '' });
  }
  render() {
    if (this.state.error) {
      return (
        <View style={eb.root}>
          <Text style={eb.title}>⚠ Render Error</Text>
          <Text style={eb.msg}>{this.state.error.message}</Text>
          {!!this.state.info && (
            <Text style={eb.stack} numberOfLines={12}>{this.state.info.trim()}</Text>
          )}
          <Pressable style={eb.btn} onPress={() => this.setState({ error: null, info: '' })}>
            <Text style={eb.btnText}>Dismiss</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const eb = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title:   { color: colors.error, fontSize: 16, fontWeight: '700', marginBottom: 12 },
  msg:     { color: colors.text, fontSize: 13, textAlign: 'center', marginBottom: 12 },
  stack:   { color: colors.textSub, fontSize: 10, fontFamily: 'monospace', backgroundColor: colors.surface, padding: 12, borderRadius: 8, width: '100%', marginBottom: 16 },
  btn:     { backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 6 },
  btnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});

// ─── Root Layout ─────────────────────────────────────────────────────────────
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <ErrorBoundary>
        <ToastProvider>
          <View style={s.container}>
            <Slot />
          </View>
        </ToastProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
