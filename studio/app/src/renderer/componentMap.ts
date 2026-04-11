/**
 * Component Map
 *
 * Maps registry IDs to actual React Native components from foundation.
 * Each component is wrapped in safeLayout to prevent crashes from missing props.
 * Child distribution (children vs items vs named slots) is handled by NodeRenderer + slotConfig.
 */

import React, { ComponentType } from 'react';
import { View, Text } from 'react-native';

import Box from '../../../../foundation/layout/ui/primitives/Box';
import Stack from '../../../../foundation/layout/ui/primitives/Stack';
import Inline from '../../../../foundation/layout/ui/primitives/Inline';
import Center from '../../../../foundation/layout/ui/primitives/Center';
import Scroll from '../../../../foundation/layout/ui/primitives/Scroll';
import Divider from '../../../../foundation/layout/ui/primitives/Divider';

import AuthLayout from '../../../../foundation/layout/ui/AuthLayout';
import BentoLayout from '../../../../foundation/layout/ui/BentoLayout';
import CenteredLayout from '../../../../foundation/layout/ui/CenteredLayout';
import DashboardLayout from '../../../../foundation/layout/ui/DashboardLayout';
import FlexLayout from '../../../../foundation/layout/ui/FlexLayout';
import FooterLayout from '../../../../foundation/layout/ui/FooterLayout';
import GridLayout from '../../../../foundation/layout/ui/GridLayout';
import HeaderContentLayout from '../../../../foundation/layout/ui/HeaderContentLayout';
import MasonryLayout from '../../../../foundation/layout/ui/MasonryLayout';
import ResponsiveLayout from '../../../../foundation/layout/ui/ResponsiveLayout';
import ScrollLayout from '../../../../foundation/layout/ui/ScrollLayout';
import SidebarLayout from '../../../../foundation/layout/ui/SidebarLayout';
import SplitLayout from '../../../../foundation/layout/ui/SplitLayout';
import VoidLayout from '../../../../foundation/layout/ui/VoidLayout';
import RootLayout from '../../../../foundation/layout/ui/RootLayout';
import BottomDrawerLayout from '../../../../foundation/layout/ui/BottomDrawerLayout';
import TopDrawerLayout from '../../../../foundation/layout/ui/TopDrawerLayout';
import LeftDrawerLayout from '../../../../foundation/layout/ui/LeftDrawerLayout';
import CrossTabLayout from '../../../../foundation/layout/ui/CrossTabLayout';
import ParallaxLayout from '../../../../foundation/layout/ui/ParallaxLayout';
import SketchLayout from '../../../../foundation/layout/ui/SketchLayout';
import SwiperLayout from '../../../../foundation/layout/ui/SwiperLayout';
import Swipe2ScreenLayout from '../../../../foundation/layout/ui/Swipe2ScreenLayout';
import { SystemUIWrapper as SystemLayout } from '../../../../foundation/layout/ui/SystemLayout';
import { TutoLayout } from '../../../../foundation/layout/ui/TutoLayout';
import DeckLayout from '../../../../foundation/layout/ui/DeckLayout';
import FlipLayout from '../../../../foundation/layout/ui/FlipLayout';

import Button from '../../../../foundation/layout/ui/components/Button';
import TextInput from '../../../../foundation/layout/ui/components/TextInput';
import TextArea from '../../../../foundation/layout/ui/components/TextArea';
import Checkbox from '../../../../foundation/layout/ui/components/Checkbox';
import SwitchComp from '../../../../foundation/layout/ui/components/Switch';
import Badge from '../../../../foundation/layout/ui/components/Badge';
import Avatar from '../../../../foundation/layout/ui/components/Avatar';
import IconButton from '../../../../foundation/layout/ui/components/IconButton';
import Chip from '../../../../foundation/layout/ui/components/Chip';
import Spinner from '../../../../foundation/layout/ui/components/Spinner';
import Select from '../../../../foundation/layout/ui/components/Select';
import RadioGroup from '../../../../foundation/layout/ui/components/RadioGroup';
import DatePicker from '../../../../foundation/layout/ui/components/DatePicker';
import FilePicker from '../../../../foundation/layout/ui/components/FilePicker';
import SliderComp from '../../../../foundation/layout/ui/components/Slider';
import ImageComp from '../../../../foundation/layout/ui/components/ImageComp';
import IconComp from '../../../../foundation/layout/ui/components/IconComp';
import GradientComp from '../../../../foundation/layout/ui/components/GradientComp';
import SeparatorComp from '../../../../foundation/layout/ui/components/SeparatorComp';
import TextComp from '../../../../foundation/layout/ui/components/TextComp';
import VideoComp from '../../../../foundation/layout/ui/components/VideoComp';
import CameraComp from '../../../../foundation/layout/ui/components/CameraComp';
import WebViewComp from '../../../../foundation/layout/ui/components/WebViewComp';
import MapViewComp from '../../../../foundation/layout/ui/components/MapViewComp';
import ProgressBar from '../../../../foundation/layout/ui/components/ProgressBar';
import Accordion from '../../../../foundation/layout/ui/components/Accordion';

import AuthFormBlock from '../../../../foundation/layout/ui/blocks/AuthFormBlock';
import HeaderBlock from '../../../../foundation/layout/ui/blocks/HeaderBlock';
import FormBlock from '../../../../foundation/layout/ui/blocks/FormBlock';
import CardBlock from '../../../../foundation/layout/ui/blocks/CardBlock';
import ListItemBlock from '../../../../foundation/layout/ui/blocks/ListItemBlock';
import SearchBarBlock from '../../../../foundation/layout/ui/blocks/SearchBarBlock';
import StatCardBlock from '../../../../foundation/layout/ui/blocks/StatCardBlock';
import EmptyStateBlock from '../../../../foundation/layout/ui/blocks/EmptyStateBlock';
import AvatarBlock from '../../../../foundation/layout/ui/blocks/AvatarBlock';
import ModalBlock from '../../../../foundation/layout/ui/blocks/ModalBlock';
import ToastBlock from '../../../../foundation/layout/ui/blocks/ToastBlock';
import SocialLinksBlock from '../../../../foundation/layout/ui/blocks/SocialLinksBlock';
import ProductCardBlock from '../../../../foundation/layout/ui/blocks/ProductCardBlock';
import NotificationItemBlock from '../../../../foundation/layout/ui/blocks/NotificationItemBlock';
import PricingCardBlock from '../../../../foundation/layout/ui/blocks/PricingCardBlock';
import TransactionItemBlock from '../../../../foundation/layout/ui/blocks/TransactionItemBlock';
import OnboardingSlideBlock from '../../../../foundation/layout/ui/blocks/OnboardingSlideBlock';
import ChatBubbleBlock from '../../../../foundation/layout/ui/blocks/ChatBubbleBlock';
import CalendarEventBlock from '../../../../foundation/layout/ui/blocks/CalendarEventBlock';
import FileItemBlock from '../../../../foundation/layout/ui/blocks/FileItemBlock';
import ContactCardBlock from '../../../../foundation/layout/ui/blocks/ContactCardBlock';
import MapPinBlock from '../../../../foundation/layout/ui/blocks/MapPinBlock';
import PasswordStrengthBlock from '../../../../foundation/layout/ui/blocks/PasswordStrengthBlock';
import MediaPickerBlock from '../../../../foundation/layout/ui/blocks/MediaPickerBlock';
import BannerBlock from '../../../../foundation/layout/ui/blocks/BannerBlock';
import CommentBlock from '../../../../foundation/layout/ui/blocks/CommentBlock';
import OTPInputBlock from '../../../../foundation/layout/ui/blocks/OTPInputBlock';
import TagInputBlock from '../../../../foundation/layout/ui/blocks/TagInputBlock';
import StepperBlock from '../../../../foundation/layout/ui/blocks/StepperBlock';
import RatingBlock from '../../../../foundation/layout/ui/blocks/RatingBlock';
import QuoteBlock from '../../../../foundation/layout/ui/blocks/QuoteBlock';
import TimelineBlock from '../../../../foundation/layout/ui/blocks/TimelineBlock';
import CounterBlock from '../../../../foundation/layout/ui/blocks/CounterBlock';
import SegmentedControlBlock from '../../../../foundation/layout/ui/blocks/SegmentedControlBlock';

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

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() {
    if (this.state.error) return React.createElement(View, { style: { padding: 8, minHeight: 20 } },
      React.createElement(Text, { style: { color: '#ef4444', fontSize: 10 } }, 'Render error'));
    return this.props.children;
  }
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
  HeaderContentLayout: safe(HeaderContentLayout),
  MasonryLayout: safe(MasonryLayout),
  ResponsiveLayout: safe(ResponsiveLayout),
  ScrollLayout: safe(ScrollLayout),
  SidebarLayout: safe(SidebarLayout),
  SplitLayout: safe(SplitLayout),
  VoidLayout: safe(VoidLayout),
  RootLayout: safe(RootLayout),
  BottomDrawerLayout: safe(BottomDrawerLayout),
  TopDrawerLayout: safe(TopDrawerLayout),
  LeftDrawerLayout: safe(LeftDrawerLayout),
  CrossTabLayout: safe(CrossTabLayout),
  ParallaxLayout: safe(ParallaxLayout),
  SketchLayout: safe(SketchLayout),
  SwiperLayout: safe(SwiperLayout),
  Swipe2ScreenLayout: safe(Swipe2ScreenLayout),
  SystemLayout: safe(SystemLayout),
  TutoLayout: safe(TutoLayout),
  DeckLayout: safe(DeckLayout),
  FlipLayout: safe(FlipLayout),
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
