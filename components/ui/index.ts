/**
 * The unified components: `import { Button, Card } from '@flipova/foundation/ui'`. Each one renders the component of
 * the library chosen in <FlipovaProvider adapter={...}> with the design applied, and falls back to the flipova
 * provider when that library does not have it (or when no provider is mounted).
 */
import { createUi } from './create';

export const Button = createUi('Button');
export const Text = createUi('Text');
export const Heading = createUi('Heading');
export const Input = createUi('Input');
export const Textarea = createUi('Textarea');
export const Select = createUi('Select');
export const Checkbox = createUi('Checkbox');
export const RadioGroup = createUi('RadioGroup');
export const Switch = createUi('Switch');
export const Card = createUi('Card');
export const Badge = createUi('Badge');
export const Avatar = createUi('Avatar');
export const Divider = createUi('Divider');
export const Modal = createUi('Modal');
export const Tabs = createUi('Tabs');
export const Alert = createUi('Alert');
export const Toast = createUi('Toast');
export const Progress = createUi('Progress');
export const Skeleton = createUi('Skeleton');
export const Spinner = createUi('Spinner');
export const Accordion = createUi('Accordion');
export const ActionSheet = createUi('ActionSheet');
export const AlertDialog = createUi('AlertDialog');
export const BottomSheet = createUi('BottomSheet');
export const Box = createUi('Box');
export const Calendar = createUi('Calendar');
export const Center = createUi('Center');
export const DateTimePicker = createUi('DateTimePicker');
export const Drawer = createUi('Drawer');
export const Fab = createUi('Fab');
export const FlatList = createUi('FlatList');
export const FormControl = createUi('FormControl');
export const Grid = createUi('Grid');
export const HStack = createUi('HStack');
export const Icon = createUi('Icon');
export const Image = createUi('Image');
export const ImageBackground = createUi('ImageBackground');
export const ImageViewer = createUi('ImageViewer');
export const InputAccessoryView = createUi('InputAccessoryView');
export const KeyboardAvoidingView = createUi('KeyboardAvoidingView');
export const LiquidGlass = createUi('LiquidGlass');
export const Link = createUi('Link');
export const Menu = createUi('Menu');
export const Popover = createUi('Popover');
export const Portal = createUi('Portal');
export const Pressable = createUi('Pressable');
export const RefreshControl = createUi('RefreshControl');
export const SafeAreaView = createUi('SafeAreaView');
export const ScrollView = createUi('ScrollView');
export const SectionList = createUi('SectionList');
export const Slider = createUi('Slider');
export const StatusBar = createUi('StatusBar');
export const Table = createUi('Table');
export const Tooltip = createUi('Tooltip');
export const View = createUi('View');
export const VirtualizedList = createUi('VirtualizedList');
export const VStack = createUi('VStack');

export { componentsOf, coverageOf, useComponents, type Coverage } from './resolve';
export { FlipovaProvider, useProviderName, useResolvedTheme, type FlipovaProviderProps } from '../providers';
export type * from '../contract/types';
