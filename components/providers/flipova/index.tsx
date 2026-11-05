import React from 'react';
import type { UiComponents } from '../../contract';
import { defineAdapter } from '../types';
import { Accordion } from './components/Accordion';
import { ActionSheet } from './components/ActionSheet';
import { Alert } from './components/Alert';
import { AlertDialog } from './components/AlertDialog';
import { Avatar } from './components/Avatar';
import { Badge } from './components/Badge';
import { BottomSheet } from './components/BottomSheet';
import { Box } from './components/Box';
import { Button } from './components/Button';
import { Calendar } from './components/Calendar';
import { Card } from './components/Card';
import { Center } from './components/Center';
import { Checkbox } from './components/Checkbox';
import { DateTimePicker } from './components/DateTimePicker';
import { Divider } from './components/Divider';
import { Drawer } from './components/Drawer';
import { Fab } from './components/Fab';
import { FlatList } from './components/FlatList';
import { FormControl } from './components/FormControl';
import { Grid } from './components/Grid';
import { HStack } from './components/HStack';
import { Heading } from './components/Heading';
import { Icon } from './components/Icon';
import { Image } from './components/Image';
import { ImageBackground } from './components/ImageBackground';
import { ImageViewer } from './components/ImageViewer';
import { Input } from './components/Input';
import { InputAccessoryView } from './components/InputAccessoryView';
import { KeyboardAvoidingView } from './components/KeyboardAvoidingView';
import { Link } from './components/Link';
import { LiquidGlass } from './components/LiquidGlass';
import { Menu } from './components/Menu';
import { Modal } from './components/Modal';
import { Popover } from './components/Popover';
import { Pressable } from './components/Pressable';
import { Progress } from './components/Progress';
import { RadioGroup } from './components/RadioGroup';
import { RefreshControl } from './components/RefreshControl';
import { SafeAreaView } from './components/SafeAreaView';
import { ScrollView } from './components/ScrollView';
import { SectionList } from './components/SectionList';
import { Select } from './components/Select';
import { Skeleton } from './components/Skeleton';
import { Slider } from './components/Slider';
import { Spinner } from './components/Spinner';
import { StatusBar } from './components/StatusBar';
import { Switch } from './components/Switch';
import { Table } from './components/Table';
import { Tabs } from './components/Tabs';
import { Text } from './components/Text';
import { Textarea } from './components/Textarea';
import { Toast } from './components/Toast';
import { Tooltip } from './components/Tooltip';
import { VStack } from './components/VStack';
import { View } from './components/View';
import { VirtualizedList } from './components/VirtualizedList';
import { Portal, PortalHost } from './components/Portal';

export {
  Accordion,
  ActionSheet,
  Alert,
  AlertDialog,
  Avatar,
  Badge,
  BottomSheet,
  Box,
  Button,
  Calendar,
  Card,
  Center,
  Checkbox,
  DateTimePicker,
  Divider,
  Drawer,
  Fab,
  FlatList,
  FormControl,
  Grid,
  HStack,
  Heading,
  Icon,
  Image,
  ImageBackground,
  ImageViewer,
  Input,
  InputAccessoryView,
  KeyboardAvoidingView,
  Link,
  LiquidGlass,
  Menu,
  Modal,
  Popover,
  Portal,
  Pressable,
  Progress,
  RadioGroup,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  SectionList,
  Select,
  Skeleton,
  Slider,
  Spinner,
  StatusBar,
  Switch,
  Table,
  Tabs,
  Text,
  Textarea,
  Toast,
  Tooltip,
  VStack,
  View,
  VirtualizedList,
  PortalHost,
};

/** Flipova's own components: React Native primitives styled only from the recipes, so they carry the design as is. */
export const flipovaComponents: UiComponents = {
  Accordion,
  ActionSheet,
  Alert,
  AlertDialog,
  Avatar,
  Badge,
  BottomSheet,
  Box,
  Button,
  Calendar,
  Card,
  Center,
  Checkbox,
  DateTimePicker,
  Divider,
  Drawer,
  Fab,
  FlatList,
  FormControl,
  Grid,
  HStack,
  Heading,
  Icon,
  Image,
  ImageBackground,
  ImageViewer,
  Input,
  InputAccessoryView,
  KeyboardAvoidingView,
  Link,
  LiquidGlass,
  Menu,
  Modal,
  Popover,
  Portal,
  Pressable,
  Progress,
  RadioGroup,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  SectionList,
  Select,
  Skeleton,
  Slider,
  Spinner,
  StatusBar,
  Switch,
  Table,
  Tabs,
  Text,
  Textarea,
  Toast,
  Tooltip,
  VStack,
  View,
  VirtualizedList,
};

export const flipova = defineAdapter({
  name: 'flipova',
  // the portal host is the one thing to mount: <Portal> content is drawn there, above the app
  Provider: ({ children }) => <PortalHost>{children}</PortalHost>,
  components: flipovaComponents,
});
