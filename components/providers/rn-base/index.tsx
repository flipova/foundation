/** React Native's own components, shared by every provider: no library replaces them, so each adapter serves these. */
export { Box } from './Box';
export { View } from './View';
export { ScrollView } from './ScrollView';
export { FlatList } from './FlatList';
export { VirtualizedList } from './VirtualizedList';
export { SectionList } from './SectionList';
export { SafeAreaView } from './SafeAreaView';
export { KeyboardAvoidingView } from './KeyboardAvoidingView';
export { StatusBar } from './StatusBar';
export { RefreshControl } from './RefreshControl';
export { InputAccessoryView } from './InputAccessoryView';
export { Image } from './Image';
export { ImageBackground } from './ImageBackground';
export { Pressable } from './Pressable';
import type { ProviderComponents } from '../../contract';
import { Box } from './Box';
import { View } from './View';
import { ScrollView } from './ScrollView';
import { FlatList } from './FlatList';
import { VirtualizedList } from './VirtualizedList';
import { SectionList } from './SectionList';
import { SafeAreaView } from './SafeAreaView';
import { KeyboardAvoidingView } from './KeyboardAvoidingView';
import { StatusBar } from './StatusBar';
import { RefreshControl } from './RefreshControl';
import { InputAccessoryView } from './InputAccessoryView';
import { Image } from './Image';
import { ImageBackground } from './ImageBackground';
import { Pressable } from './Pressable';

export const RN_BASE_NAMES = [
  'Box',
  'View',
  'ScrollView',
  'FlatList',
  'VirtualizedList',
  'SectionList',
  'SafeAreaView',
  'KeyboardAvoidingView',
  'StatusBar',
  'RefreshControl',
  'InputAccessoryView',
  'Image',
  'ImageBackground',
  'Pressable',
] as const;

export const rnBase: ProviderComponents = {
  Box,
  View,
  ScrollView,
  FlatList,
  VirtualizedList,
  SectionList,
  SafeAreaView,
  KeyboardAvoidingView,
  StatusBar,
  RefreshControl,
  InputAccessoryView,
  Image,
  ImageBackground,
  Pressable,
};
