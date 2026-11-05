import React from 'react';
import type {
  FabProps,
  FlatListProps,
  ImageBackgroundProps,
  ImageProps,
  InputAccessoryViewProps,
  KeyboardAvoidingViewProps,
  ModalProps,
  RefreshControlProps,
  SafeAreaViewProps,
  ScrollViewProps,
  SectionListProps,
  StatusBarProps,
  ViewProps,
  VirtualizedListProps,
} from '../../contract';
import { iconRecipe } from '../../contract';
import { useResolvedTheme } from '../provider';
import { Fab as GFab, FabLabel } from './ui/fab';
import { FlatList as GFlatList } from './ui/flat-list';
import { Image as GImage } from './ui/image';
import { ImageBackground as GImageBackground } from './ui/image-background';
import { InputAccessoryView as GInputAccessoryView } from './ui/input-accessory-view';
import { KeyboardAvoidingView as GKeyboardAvoidingView } from './ui/keyboard-avoiding-view';
import { Modal as GModal, ModalBackdrop, ModalBody, ModalContent, ModalHeader } from './ui/modal';
import { RefreshControl as GRefreshControl } from './ui/refresh-control';
import { SafeAreaView as GSafeAreaView } from './ui/safe-area-view';
import { ScrollView as GScrollView } from './ui/scroll-view';
import { SectionList as GSectionList } from './ui/section-list';
import { StatusBar as GStatusBar } from './ui/status-bar';
import { View as GView } from './ui/view';
import { VirtualizedList as GVirtualizedList } from './ui/virtualized-list';
import { Text as RNText } from 'react-native';

/** gluestack's own components for the rest of the contract; many of them are thin re-exports of React Native. */

export const View = (p: ViewProps) => <GView testID={p.testID}>{p.children}</GView>;
export const ScrollView = (p: ScrollViewProps) => (
  <GScrollView testID={p.testID} horizontal={p.horizontal}>
    {p.children}
  </GScrollView>
);
export const SafeAreaView = (p: SafeAreaViewProps) => (
  <GSafeAreaView testID={p.testID} style={{ flex: 1 }}>
    {p.children}
  </GSafeAreaView>
);
export const KeyboardAvoidingView = (p: KeyboardAvoidingViewProps) => (
  <GKeyboardAvoidingView testID={p.testID} style={{ flex: 1 }}>
    {p.children}
  </GKeyboardAvoidingView>
);

const keyOf = (k?: (item: unknown, i: number) => string) => k ?? ((_: unknown, i: number) => String(i));

export const FlatList = (p: FlatListProps) => (
  <GFlatList
    testID={p.testID}
    data={p.data}
    horizontal={p.horizontal}
    keyExtractor={keyOf(p.keyExtractor)}
    renderItem={({ item, index }) => <>{p.renderItem(item, index)}</>}
    ListEmptyComponent={p.empty ? <>{p.empty}</> : undefined}
  />
);

export const VirtualizedList = (p: VirtualizedListProps) => (
  <GVirtualizedList
    testID={p.testID}
    data={p.data}
    horizontal={p.horizontal}
    getItem={(data: unknown[], i: number) => data[i]}
    getItemCount={(data: unknown[]) => data.length}
    keyExtractor={keyOf(p.keyExtractor)}
    renderItem={({ item, index }: { item: unknown; index: number }) => <>{p.renderItem(item, index)}</>}
    ListEmptyComponent={p.empty ? <>{p.empty}</> : undefined}
  />
);

export const SectionList = (p: SectionListProps) => (
  <GSectionList
    testID={p.testID}
    sections={p.sections}
    keyExtractor={keyOf(p.keyExtractor)}
    renderItem={({ item, index }) => <>{p.renderItem(item, index)}</>}
    renderSectionHeader={({ section }) => <RNText accessibilityRole="header">{section.title}</RNText>}
  />
);

export function RefreshControl(p: RefreshControlProps) {
  const t = useResolvedTheme();
  return (
    <GRefreshControl
      refreshing={p.refreshing}
      onRefresh={p.onRefresh}
      tintColor={t.colors.primary}
      colors={[t.colors.primary]}
    />
  );
}

export function StatusBar({ style = 'auto' }: StatusBarProps) {
  const t = useResolvedTheme();
  const dark = style === 'auto' ? t.mode === 'dark' : style === 'light';
  return <GStatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={t.colors.background} />;
}

export const InputAccessoryView = (p: InputAccessoryViewProps) => (
  <GInputAccessoryView nativeID={p.nativeID}>{p.children}</GInputAccessoryView>
);

export const Image = (p: ImageProps) => (
  <GImage
    testID={p.testID}
    source={{ uri: p.source }}
    alt={p.alt}
    resizeMode={p.resizeMode ?? 'cover'}
    style={{ width: p.width, height: p.height }}
  />
);

export const ImageBackground = (p: ImageBackgroundProps) => (
  <GImageBackground testID={p.testID} source={{ uri: p.source }} resizeMode="cover">
    {p.children}
  </GImageBackground>
);

export function Fab(p: FabProps) {
  const t = useResolvedTheme();
  return (
    <GFab onPress={p.onPress} accessibilityLabel={p.accessibilityLabel ?? p.label ?? 'Action'} testID={p.testID}>
      <FabLabel>{iconRecipe({ name: p.icon ?? 'plus' }, t).glyph}</FabLabel>
      {p.label ? <FabLabel>{p.label}</FabLabel> : null}
    </GFab>
  );
}

export const Modal = (p: ModalProps) => (
  <GModal isOpen={p.visible} onClose={p.onClose} testID={p.testID}>
    <ModalBackdrop />
    <ModalContent>
      {p.title ? (
        <ModalHeader>
          <RNText accessibilityRole="header">{p.title}</RNText>
        </ModalHeader>
      ) : null}
      <ModalBody>{p.children}</ModalBody>
    </ModalContent>
  </GModal>
);
