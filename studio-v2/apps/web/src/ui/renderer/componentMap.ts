/**
 * Component Map
 *
 * Maps registry IDs to actual React Native components from foundation.
 * Each component is wrapped in safeLayout to prevent crashes from missing props.
 * Child distribution (children vs items vs named slots) is handled by NodeRenderer + slotConfig.
 */

import React, { ComponentType } from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Box } from '@flipova/foundation/layout';
import { Stack } from '@flipova/foundation/layout';
import { Inline } from '@flipova/foundation/layout';
import { Center } from '@flipova/foundation/layout';
import { Scroll } from '@flipova/foundation/layout';
import { Divider } from '@flipova/foundation/layout';

import AuthLayout from '@flipova/foundation/layout/ui/AuthLayout';
import BentoLayout from '@flipova/foundation/layout/ui/BentoLayout';
import CenteredLayout from '@flipova/foundation/layout/ui/CenteredLayout';
import DashboardLayout from '@flipova/foundation/layout/ui/DashboardLayout';
import FlexLayout from '@flipova/foundation/layout/ui/FlexLayout';
import FooterLayout from '@flipova/foundation/layout/ui/FooterLayout';
import GridLayout from '@flipova/foundation/layout/ui/GridLayout';
// HeaderContentLayout uses react-native-reanimated — replaced by animatedStub()
import MasonryLayout from '@flipova/foundation/layout/ui/MasonryLayout';
import ResponsiveLayout from '@flipova/foundation/layout/ui/ResponsiveLayout';
import ScrollLayout from '@flipova/foundation/layout/ui/ScrollLayout';
import SidebarLayout from '@flipova/foundation/layout/ui/SidebarLayout';
import SplitLayout from '@flipova/foundation/layout/ui/SplitLayout';
import VoidLayout from '@flipova/foundation/layout/ui/VoidLayout';
import RootLayout from '@flipova/foundation/layout/ui/RootLayout';
// BottomDrawerLayout, TopDrawerLayout, LeftDrawerLayout, CrossTabLayout use react-native-reanimated
// They are replaced by animatedStub() below — no import needed
import SketchLayout from '@flipova/foundation/layout/ui/SketchLayout';
// SwiperLayout, Swipe2ScreenLayout, TutoLayout, DeckLayout, FlipLayout use react-native-reanimated
import { SystemUIWrapper as SystemLayout } from '@flipova/foundation/layout/ui/SystemLayout';

import { Button } from '@flipova/foundation/layout';
import { TextInput } from '@flipova/foundation/layout';
import { TextArea } from '@flipova/foundation/layout';
import { Checkbox } from '@flipova/foundation/layout';
import { Switch as SwitchComp } from '@flipova/foundation/layout';
import { Badge } from '@flipova/foundation/layout';
import { Avatar } from '@flipova/foundation/layout';
import { IconButton } from '@flipova/foundation/layout';
import { Chip } from '@flipova/foundation/layout';
import { Spinner } from '@flipova/foundation/layout';
import { Select } from '@flipova/foundation/layout';
import { RadioGroup } from '@flipova/foundation/layout';
import { DatePicker } from '@flipova/foundation/layout';
import { FilePicker } from '@flipova/foundation/layout';
import { Slider as SliderComp } from '@flipova/foundation/layout';
import { ImageComp } from '@flipova/foundation/layout';
import { IconComp } from '@flipova/foundation/layout';
import { GradientComp } from '@flipova/foundation/layout';
import { SeparatorComp } from '@flipova/foundation/layout';
import { TextComp } from '@flipova/foundation/layout';
import { VideoComp } from '@flipova/foundation/layout';
import { CameraComp } from '@flipova/foundation/layout';
import { WebViewComp } from '@flipova/foundation/layout';
import { MapViewComp } from '@flipova/foundation/layout';
import { ProgressBar } from '@flipova/foundation/layout';
import { Accordion } from '@flipova/foundation/layout';

import { AuthFormBlock } from '@flipova/foundation/layout';
import { HeaderBlock } from '@flipova/foundation/layout';
import { FormBlock } from '@flipova/foundation/layout';
import { CardBlock } from '@flipova/foundation/layout';
import { ListItemBlock } from '@flipova/foundation/layout';
import { SearchBarBlock } from '@flipova/foundation/layout';
import { StatCardBlock } from '@flipova/foundation/layout';
import { EmptyStateBlock } from '@flipova/foundation/layout';
import { AvatarBlock } from '@flipova/foundation/layout';
import { ModalBlock } from '@flipova/foundation/layout';
import { ToastBlock } from '@flipova/foundation/layout';
import { SocialLinksBlock } from '@flipova/foundation/layout';
import { ProductCardBlock } from '@flipova/foundation/layout';
import { NotificationItemBlock } from '@flipova/foundation/layout';
import { PricingCardBlock } from '@flipova/foundation/layout';
import { TransactionItemBlock } from '@flipova/foundation/layout';
import { OnboardingSlideBlock } from '@flipova/foundation/layout';
import { ChatBubbleBlock } from '@flipova/foundation/layout';
import { CalendarEventBlock } from '@flipova/foundation/layout';
import { FileItemBlock } from '@flipova/foundation/layout';
import { ContactCardBlock } from '@flipova/foundation/layout';
import { MapPinBlock } from '@flipova/foundation/layout';
import { PasswordStrengthBlock } from '@flipova/foundation/layout';
import { MediaPickerBlock } from '@flipova/foundation/layout';
import { BannerBlock } from '@flipova/foundation/layout';
import { CommentBlock } from '@flipova/foundation/layout';
import { OTPInputBlock } from '@flipova/foundation/layout';
import { TagInputBlock } from '@flipova/foundation/layout';
import { StepperBlock } from '@flipova/foundation/layout';
import { RatingBlock } from '@flipova/foundation/layout';
import { QuoteBlock } from '@flipova/foundation/layout';
import { TimelineBlock } from '@flipova/foundation/layout';
import { CounterBlock } from '@flipova/foundation/layout';
import { SegmentedControlBlock } from '@flipova/foundation/layout';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  componentDidCatch(e: Error) { console.warn('[componentMap] render error', e?.message); }
  render() {
    if (this.state.error) return React.createElement(View, { style: { flex: 1, minHeight: 20, borderWidth: 1, borderColor: '#ef4444', borderStyle: 'dashed' as any, borderRadius: 4, alignItems: 'center', justifyContent: 'center' } },
      React.createElement(Text, { style: { color: '#ef4444', fontSize: 9 } }, 'render error'));
    return this.props.children as React.ReactElement;
  }
}

function safe(Comp: ComponentType<any>): ComponentType<any> {
  return function SafeWrapper(props: any) {
    try {
      return React.createElement(ErrorBoundary, null, React.createElement(Comp, props));
    } catch {
      return React.createElement(View, { style: { flex: 1, minHeight: 20 } }, props.children);
    }
  };
}

function stub(realName: string, FallbackComp: ComponentType<any>): ComponentType<any> {
  return function StubWrapper(props: any) {
    if (__DEV__) {
      console.warn(`[componentMap] ${realName} n'est pas implémenté — fallback vers ${(FallbackComp as any).displayName || FallbackComp.name}`);
    }
    return React.createElement(
      View,
      { style: { borderWidth: 1, borderColor: '#f59e0b', borderStyle: 'dashed' } },
      React.createElement(Text, { style: { fontSize: 9, color: '#f59e0b', padding: 2 } }, `[stub: ${realName}]`),
      React.createElement(FallbackComp, props)
    );
  };
}

// ---------------------------------------------------------------------------
// Animated layouts stub — these use react-native-reanimated which can't run
// in the web studio environment. Replaced with a visual placeholder.
// ---------------------------------------------------------------------------

function animatedStub(displayName: string): ComponentType<any> {
  const Stub = function AnimatedStub(props: any) {
    return React.createElement(
      View,
      { style: { flex: 1, minHeight: 60, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#a78bfa', borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(167,139,250,0.05)', padding: 12 } },
      React.createElement(Feather, { name: 'wind', size: 14, color: '#a78bfa' }),
      React.createElement(Text, { style: { color: '#a78bfa', fontSize: 10, fontWeight: '600', marginTop: 4 } }, displayName),
      React.createElement(Text, { style: { color: '#a78bfa', fontSize: 8, opacity: 0.7, marginTop: 2 } }, 'Animated — preview in device'),
      props.children ? React.createElement(View, { style: { width: '100%', marginTop: 8 } }, props.children) : null,
    );
  };
  Stub.displayName = displayName + 'Stub';
  return Stub;
}

export const COMPONENT_MAP: Record<string, ComponentType<any>> = {
  Box, Stack, Inline, Center, Scroll, Divider,
  AuthLayout: safe(AuthLayout),
  BentoLayout: safe(BentoLayout),
  CenteredLayout: safe(CenteredLayout),
  DashboardLayout: safe(DashboardLayout),
  FlexLayout: safe(FlexLayout),
  FooterLayout: safe(FooterLayout),
  GridLayout: safe(GridLayout),
  HeaderContentLayout: animatedStub('HeaderContentLayout'),
  MasonryLayout: safe(MasonryLayout),
  ResponsiveLayout: safe(ResponsiveLayout),
  ScrollLayout: safe(ScrollLayout),
  SidebarLayout: safe(SidebarLayout),
  SplitLayout: safe(SplitLayout),
  VoidLayout: safe(VoidLayout),
  RootLayout: safe(RootLayout),
  BottomDrawerLayout: animatedStub('BottomDrawerLayout'),
  TopDrawerLayout: animatedStub('TopDrawerLayout'),
  LeftDrawerLayout: animatedStub('LeftDrawerLayout'),
  CrossTabLayout: animatedStub('CrossTabLayout'),
  ParallaxLayout: animatedStub('ParallaxLayout'),
  SketchLayout: safe(SketchLayout),
  SwiperLayout: animatedStub('SwiperLayout'),
  Swipe2ScreenLayout: animatedStub('Swipe2ScreenLayout'),
  SystemLayout: safe(SystemLayout),
  TutoLayout: animatedStub('TutoLayout'),
  DeckLayout: animatedStub('DeckLayout'),
  FlipLayout: animatedStub('FlipLayout'),
  Button: safe(Button),
  TextInput: safe(TextInput),
  TextArea: safe(TextArea),
  Checkbox: safe(Checkbox),
  Switch: safe(SwitchComp),
  Badge: safe(Badge),
  Avatar: safe(Avatar),
  IconButton: safe(IconButton),
  Chip: safe(Chip),
  Spinner: safe(Spinner),
  Select: safe(Select),
  RadioGroup: safe(RadioGroup),
  DatePicker: safe(DatePicker),
  FilePicker: safe(FilePicker),
  Slider: safe(SliderComp),
  Image: safe(ImageComp),
  Icon: safe(IconComp),
  Gradient: safe(GradientComp),
  Separator: safe(SeparatorComp),
  Text: safe(TextComp),
  Video: safe(VideoComp),
  Camera: safe(CameraComp),
  WebView: safe(WebViewComp),
  MapView: safe(MapViewComp),
  BlurView: stub('BlurView', GradientComp),
  LottieAnimation: stub('LottieAnimation', ImageComp),
  ProgressBar: safe(ProgressBar),
  Accordion: safe(Accordion),
  Tabs: stub('Tabs', Box),
  Pressable: safe(Box),
  FlatList: stub('FlatList', Box),
  AuthFormBlock: safe(AuthFormBlock),
  HeaderBlock: safe(HeaderBlock),
  FormBlock: safe(FormBlock),
  CardBlock: safe(CardBlock),
  ListItemBlock: safe(ListItemBlock),
  SearchBarBlock: safe(SearchBarBlock),
  StatCardBlock: safe(StatCardBlock),
  EmptyStateBlock: safe(EmptyStateBlock),
  AvatarBlock: safe(AvatarBlock),
  ModalBlock: safe(ModalBlock),
  ToastBlock: safe(ToastBlock),
  SocialLinksBlock: safe(SocialLinksBlock),
  ProductCardBlock: safe(ProductCardBlock),
  NotificationItemBlock: safe(NotificationItemBlock),
  PricingCardBlock: safe(PricingCardBlock),
  TransactionItemBlock: safe(TransactionItemBlock),
  OnboardingSlideBlock: safe(OnboardingSlideBlock),
  ChatBubbleBlock: safe(ChatBubbleBlock),
  CalendarEventBlock: safe(CalendarEventBlock),
  FileItemBlock: safe(FileItemBlock),
  ContactCardBlock: safe(ContactCardBlock),
  MapPinBlock: safe(MapPinBlock),
  PasswordStrengthBlock: safe(PasswordStrengthBlock),
  MediaPickerBlock: safe(MediaPickerBlock),
  BannerBlock: safe(BannerBlock),
  CommentBlock: safe(CommentBlock),
  OTPInputBlock: safe(OTPInputBlock),
  TagInputBlock: safe(TagInputBlock),
  StepperBlock: safe(StepperBlock),
  RatingBlock: safe(RatingBlock),
  QuoteBlock: safe(QuoteBlock),
  TimelineBlock: safe(TimelineBlock),
  CounterBlock: safe(CounterBlock),
  SegmentedControlBlock: safe(SegmentedControlBlock),
};

export function getComponent(registryId: string): ComponentType<any> | null {
  if (!Object.prototype.hasOwnProperty.call(COMPONENT_MAP, registryId)) return null;
  return COMPONENT_MAP[registryId] || null;
}
