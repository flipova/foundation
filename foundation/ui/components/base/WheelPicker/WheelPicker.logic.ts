import { useMemo, useState, useCallback } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import WheelPickerMeta from './WheelPicker.meta.yaml';

/**
 * Represents a single item in the WheelPicker
 */
export interface WheelPickerItem {
  /** Display text for the item */
  label: string;
  /** Unique value identifying the item */
  value: string;
}

export interface WheelPickerProps {
  /** Array of items to pick from */
  items: WheelPickerItem[];
  /** Currently selected value */
  value?: string;
  /** Callback fired when an item is selected */
  onChange?: (value: string) => void;
  /** Height of a single item in pixels (default: 44) */
  itemHeight?: number;
  /** Maximum number of items to show in the wheel before moving the rest to a submenu (default: 7) */
  maxItemsInWheel?: number;
  /** Label for the "More..." option (default: 'More...') */
  moreLabel?: string;
  /** Additional styling or container props */
  [key: string]: any;
}

/**
 * Custom hook to encapsulate WheelPicker business logic.
 */
export function useWheelPickerLogic(props: WheelPickerProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (WheelPickerMeta?.props) {
      WheelPickerMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { 
    items = [], 
    value, 
    onChange, 
    itemHeight = 44,
    maxItemsInWheel = 7,
    moreLabel = 'More...',
    ...rest 
  } = merged;

  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  // Compute the visible items in the wheel vs the submenu
  const wheelItems = useMemo(() => {
    if (items.length <= maxItemsInWheel) {
      return items;
    }
    const truncated = items.slice(0, maxItemsInWheel - 1);
    truncated.push({ label: moreLabel, value: '__MORE__' });
    return truncated;
  }, [items, maxItemsInWheel, moreLabel]);

  // Find the selected index among the wheel items
  const selectedIndex = useMemo(() => {
    const idx = wheelItems.findIndex((i: WheelPickerItem) => i.value === value);
    return idx >= 0 ? idx : 0;
  }, [wheelItems, value]);

  const handleScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / itemHeight);
    
    if (index >= 0 && index < wheelItems.length) {
      const selectedItem = wheelItems[index];
      if (selectedItem.value === '__MORE__') {
        setIsSubmenuOpen(true);
      } else if (onChange && selectedItem.value !== value) {
        onChange(selectedItem.value);
      }
    }
  }, [itemHeight, wheelItems, onChange, value]);

  const selectFromSubmenu = useCallback((val: string) => {
    setIsSubmenuOpen(false);
    if (onChange && val !== value) onChange(val);
  }, [onChange, value]);

  return { 
    wheelItems, 
    allItems: items,
    selectedIndex,
    itemHeight,
    isSubmenuOpen,
    setIsSubmenuOpen,
    handleScrollEnd,
    selectFromSubmenu,
    value,
    onChange,
    rest 
  };
}
