/**
 * WheelPicker.logic — Web variant
 *
 * Replaces NativeSyntheticEvent / NativeScrollEvent with plain React state.
 * On web the scroll snap is handled purely by CSS; no scroll event parsing needed.
 */

import { useMemo, useState, useCallback } from 'react';
import WheelPickerMeta from './WheelPicker.meta.yaml';

export interface WheelPickerItem {
  label: string;
  value: string;
}

export interface WheelPickerProps {
  items: WheelPickerItem[];
  value?: string;
  onChange?: (value: string) => void;
  itemHeight?: number;
  maxItemsInWheel?: number;
  moreLabel?: string;
  [key: string]: any;
}

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

  const wheelItems = useMemo<WheelPickerItem[]>(() => {
    if (items.length <= maxItemsInWheel) return items;
    const truncated = items.slice(0, maxItemsInWheel - 1);
    truncated.push({ label: moreLabel, value: '__MORE__' });
    return truncated;
  }, [items, maxItemsInWheel, moreLabel]);

  const selectedIndex = useMemo(() => {
    const idx = wheelItems.findIndex((i: WheelPickerItem) => i.value === value);
    return idx >= 0 ? idx : 0;
  }, [wheelItems, value]);

  /** Called when user clicks a wheel row */
  const handleItemClick = useCallback((item: WheelPickerItem) => {
    if (item.value === '__MORE__') {
      setIsSubmenuOpen(true);
    } else if (onChange && item.value !== value) {
      onChange(item.value);
    }
  }, [onChange, value]);

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
    handleItemClick,
    selectFromSubmenu,
    value,
    onChange,
    rest,
  };
}
