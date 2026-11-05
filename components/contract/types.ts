import type { ReactNode } from 'react';

/**
 * The contract: what every provider implements for the same component. Props are the intersection of what the
 * providers can honour identically; anything provider-specific stays on the provider's own component.
 */
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  testID?: string;
  children?: ReactNode;
}

export type TextSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';

export interface TextProps {
  size?: TextSize;
  bold?: boolean;
  underline?: boolean;
  strikeThrough?: boolean;
  isTruncated?: boolean;
  testID?: string;
  children?: ReactNode;
}

export interface InputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  secureTextEntry?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

export type CardSize = 'default' | 'sm';

export interface CardProps {
  size?: CardSize;
  testID?: string;
  children?: ReactNode;
}

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface BadgeProps {
  variant?: BadgeVariant;
  testID?: string;
  children?: ReactNode;
}

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  size?: SwitchSize;
  accessibilityLabel?: string;
  testID?: string;
}

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps {
  /** 1 (largest) to 6; default 2 */
  level?: HeadingLevel;
  isTruncated?: boolean;
  testID?: string;
  children?: ReactNode;
}

export interface TextareaProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  /** visible lines, default 4 */
  rows?: number;
  disabled?: boolean;
  invalid?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  invalid?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

export interface RadioGroupProps {
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  /** image URL; the initials of `name` are shown when it is missing or fails to load */
  source?: string;
  name?: string;
  size?: AvatarSize;
  accessibilityLabel?: string;
  testID?: string;
}

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  testID?: string;
}

export interface ModalProps {
  visible: boolean;
  onClose?: () => void;
  title?: string;
  testID?: string;
  children?: ReactNode;
}

export interface TabItem {
  key: string;
  label: string;
  content?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  onValueChange?: (key: string) => void;
  testID?: string;
}

export type FeedbackVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant?: FeedbackVariant;
  title?: string;
  testID?: string;
  children?: ReactNode;
}

export interface ToastProps {
  variant?: FeedbackVariant | 'default';
  title?: string;
  description?: string;
  onClose?: () => void;
  testID?: string;
}

export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps {
  /** 0 to 100 (clamped) */
  value: number;
  size?: ProgressSize;
  accessibilityLabel?: string;
  testID?: string;
}

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  circle?: boolean;
  testID?: string;
}

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  size?: SpinnerSize;
  accessibilityLabel?: string;
  testID?: string;
}

// ---- layout and primitives ---------------------------------------------------------------------------------------

/** a step of the registry's spacing scale: '0', '0.5', '1', ... '12' */
export type Space = string;

export interface BoxProps {
  testID?: string;
  children?: ReactNode;
}
export type CenterProps = BoxProps;
export type ViewProps = BoxProps;
export type SafeAreaViewProps = BoxProps;

export interface StackProps extends BoxProps {
  /** gap between children, a spacing step (default '2') */
  space?: Space;
}
export type HStackProps = StackProps;
export type VStackProps = StackProps;

export interface GridProps extends BoxProps {
  /** number of columns (default 2) */
  columns?: number;
  space?: Space;
}

export interface PressableProps {
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  children?: ReactNode;
}

export interface ScrollViewProps extends BoxProps {
  horizontal?: boolean;
}

export type KeyboardAvoidingViewProps = BoxProps;

export interface ListProps {
  data: unknown[];
  renderItem: (item: unknown, index: number) => ReactNode;
  keyExtractor?: (item: unknown, index: number) => string;
  horizontal?: boolean;
  /** shown when `data` is empty */
  empty?: ReactNode;
  testID?: string;
}
export type FlatListProps = ListProps;
export type VirtualizedListProps = ListProps;

export interface SectionListProps {
  sections: Array<{ title: string; data: unknown[] }>;
  renderItem: (item: unknown, index: number) => ReactNode;
  keyExtractor?: (item: unknown, index: number) => string;
  testID?: string;
}

export interface RefreshControlProps {
  refreshing: boolean;
  onRefresh?: () => void;
}

export interface StatusBarProps {
  /** 'auto' follows the theme mode (default) */
  style?: 'light' | 'dark' | 'auto';
}

export interface ImageProps {
  source: string;
  alt?: string;
  width?: number;
  height?: number;
  /** a radius step ('md', 'full', ...) */
  radius?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  testID?: string;
}

export interface ImageBackgroundProps {
  source: string;
  testID?: string;
  children?: ReactNode;
}

/** the glyphs of the built-in set (plain text, so no icon font and no SVG library is needed) */
export type IconName =
  | 'check'
  | 'close'
  | 'chevron-up'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'plus'
  | 'minus'
  | 'search'
  | 'info'
  | 'warning'
  | 'star'
  | 'menu'
  | 'dot';
export type IconColor = 'foreground' | 'muted' | 'primary' | 'destructive' | 'success' | 'warning' | 'info';

export interface IconProps {
  name: IconName;
  /** a font-size step ('sm', 'md', 'xl', ...), default 'md' */
  size?: string;
  color?: IconColor;
  accessibilityLabel?: string;
  testID?: string;
}

export interface LinkProps {
  href?: string;
  onPress?: () => void;
  testID?: string;
  children?: ReactNode;
}

export interface PortalProps {
  children?: ReactNode;
}

// ---- overlays and disclosure ---------------------------------------------------------------------------------------

export interface AccordionItem {
  key: string;
  title: string;
  content?: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** 'single' opens one item at a time (default) */
  type?: 'single' | 'multiple';
  /** the open items' keys; uncontrolled when omitted */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (keys: string[]) => void;
  testID?: string;
}

export interface PopoverProps {
  /** the element the popover opens from */
  trigger: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  testID?: string;
  children?: ReactNode;
}

export interface TooltipProps {
  content: string;
  testID?: string;
  children?: ReactNode;
}

export interface MenuItem {
  key: string;
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

export interface MenuProps {
  /** the label of the default trigger button */
  label: string;
  items: MenuItem[];
  testID?: string;
}

export interface ActionSheetAction {
  key: string;
  label: string;
  onPress?: () => void;
  destructive?: boolean;
}

export interface ActionSheetProps {
  visible: boolean;
  onClose?: () => void;
  title?: string;
  actions: ActionSheetAction[];
  cancelLabel?: string;
  testID?: string;
}

export interface AlertDialogProps {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** styles the confirm button as destructive */
  destructive?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  testID?: string;
}

export interface BottomSheetProps {
  visible: boolean;
  onClose?: () => void;
  title?: string;
  testID?: string;
  children?: ReactNode;
}

export interface DrawerProps {
  visible: boolean;
  onClose?: () => void;
  side?: 'left' | 'right';
  testID?: string;
  children?: ReactNode;
}

export interface ImageViewerProps {
  visible: boolean;
  source: string;
  alt?: string;
  onClose?: () => void;
  testID?: string;
}

export interface LiquidGlassProps {
  testID?: string;
  children?: ReactNode;
}

// ---- inputs and data -------------------------------------------------------------------------------------------------

export interface SliderProps {
  value: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

export interface FormControlProps {
  label?: string;
  helper?: string;
  /** the message shown (and the field flagged) when set */
  error?: string;
  required?: boolean;
  disabled?: boolean;
  testID?: string;
  children?: ReactNode;
}

export interface InputAccessoryViewProps {
  nativeID: string;
  children?: ReactNode;
}

/** dates are 'YYYY-MM-DD' strings: no time zone to get wrong */
export interface CalendarProps {
  value?: string;
  onChange?: (date: string) => void;
  min?: string;
  max?: string;
  /** the month shown first, 'YYYY-MM' (the value's month, else the current one) */
  month?: string;
  /** 0 = Sunday (default), 1 = Monday */
  weekStartsOn?: 0 | 1;
  testID?: string;
}

export interface DateTimePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

export interface FabProps {
  onPress?: () => void;
  label?: string;
  icon?: IconName;
  accessibilityLabel?: string;
  testID?: string;
}

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps {
  columns: TableColumn[];
  rows: Array<Record<string, ReactNode>>;
  caption?: string;
  testID?: string;
}

/** Every component of the contract, with its props. A provider implements as many as it natively has. */
export interface UiProps {
  Accordion: AccordionProps;
  ActionSheet: ActionSheetProps;
  Alert: AlertProps;
  AlertDialog: AlertDialogProps;
  Avatar: AvatarProps;
  Badge: BadgeProps;
  BottomSheet: BottomSheetProps;
  Box: BoxProps;
  Button: ButtonProps;
  Calendar: CalendarProps;
  Card: CardProps;
  Center: CenterProps;
  Checkbox: CheckboxProps;
  DateTimePicker: DateTimePickerProps;
  Divider: DividerProps;
  Drawer: DrawerProps;
  Fab: FabProps;
  FlatList: FlatListProps;
  FormControl: FormControlProps;
  Grid: GridProps;
  Heading: HeadingProps;
  HStack: HStackProps;
  Icon: IconProps;
  Image: ImageProps;
  ImageBackground: ImageBackgroundProps;
  ImageViewer: ImageViewerProps;
  Input: InputProps;
  InputAccessoryView: InputAccessoryViewProps;
  KeyboardAvoidingView: KeyboardAvoidingViewProps;
  LiquidGlass: LiquidGlassProps;
  Link: LinkProps;
  Menu: MenuProps;
  Modal: ModalProps;
  Popover: PopoverProps;
  Portal: PortalProps;
  Pressable: PressableProps;
  Progress: ProgressProps;
  RadioGroup: RadioGroupProps;
  RefreshControl: RefreshControlProps;
  SafeAreaView: SafeAreaViewProps;
  ScrollView: ScrollViewProps;
  SectionList: SectionListProps;
  Select: SelectProps;
  Skeleton: SkeletonProps;
  Slider: SliderProps;
  Spinner: SpinnerProps;
  StatusBar: StatusBarProps;
  Switch: SwitchProps;
  Table: TableProps;
  Tabs: TabsProps;
  Text: TextProps;
  Textarea: TextareaProps;
  Toast: ToastProps;
  Tooltip: TooltipProps;
  View: ViewProps;
  VirtualizedList: VirtualizedListProps;
  VStack: VStackProps;
}

export type UiName = keyof UiProps;

/** The component names, alphabetical (the docs and the coverage table list them in this order). */
export const UI_NAMES = [
  'Accordion', 'ActionSheet', 'Alert', 'AlertDialog', 'Avatar', 'Badge', 'BottomSheet', 'Box', 'Button', 'Calendar',
  'Card', 'Center', 'Checkbox', 'DateTimePicker', 'Divider', 'Drawer', 'Fab', 'FlatList', 'FormControl', 'Grid',
  'Heading', 'HStack', 'Icon', 'Image', 'ImageBackground', 'ImageViewer', 'Input', 'InputAccessoryView',
  'KeyboardAvoidingView', 'LiquidGlass', 'Link', 'Menu', 'Modal', 'Popover', 'Portal', 'Pressable', 'Progress',
  'RadioGroup', 'RefreshControl', 'SafeAreaView', 'ScrollView', 'SectionList', 'Select', 'Skeleton', 'Slider',
  'Spinner', 'StatusBar', 'Switch', 'Table', 'Tabs', 'Text', 'Textarea', 'Toast', 'Tooltip', 'View',
  'VirtualizedList', 'VStack',
] as const satisfies readonly UiName[]; // prettier-ignore

export type UiComponents = { [K in UiName]: (props: UiProps[K]) => ReactNode };

/** What an adapter provides: the components its library really has. The rest fall back to the flipova provider. */
export type ProviderComponents = Partial<UiComponents>;

export type ProviderName = 'flipova' | 'gluestack' | 'reusables' | 'paper' | 'tamagui';
export const PROVIDERS: readonly ProviderName[] = ['flipova', 'gluestack', 'reusables', 'paper', 'tamagui'];
