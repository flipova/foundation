import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StudioProvider } from '../src/store/StudioProvider';
import { ToastProvider } from '../src/ui/shared/Toast';

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
  root: { flex: 1, backgroundColor: '#080c18', justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { color: '#ef4444', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  msg: { color: '#d0d8f0', fontSize: 13, textAlign: 'center', marginBottom: 12 },
  stack: { color: '#6a7494', fontSize: 10, fontFamily: 'monospace', backgroundColor: '#0d1220', padding: 12, borderRadius: 8, width: '100%', marginBottom: 16 },
  btn: { backgroundColor: '#3b82f6', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 6 },
  btnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});

// ─── Root Layout ─────────────────────────────────────────────────────────────
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <StudioProvider>
          <ToastProvider>
            <View style={s.root}><Slot /></View>
          </ToastProvider>
        </StudioProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({ root: { flex: 1, backgroundColor: '#080c18' } });
