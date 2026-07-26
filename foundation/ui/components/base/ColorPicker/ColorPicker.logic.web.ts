/**
 * ColorPicker Logic - Web Variant
 *
 * @description
 * Logic hook for color picker component with color selection and state management.
 * Manages current color value and selection callbacks.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Uses React.CSSProperties for style typing instead of React Native ViewStyle.
 * Manages color state with callback firing on selection.
 * Integrates with YAML metadata for default values.
 * Pure logic layer with no rendering concerns.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Color values stored as hex strings (#RRGGBB format)
 * - Memoized callback prevents unnecessary re-renders
 * - Processes component props with metadata defaults
 * - Suitable for reuse in different color picker UI implementations
 *
 * @example
 * ```typescript
 * const logic = useColorPickerLogic({
 *   value: '#FF0000',
 *   onChange: handleColorChange,
 * });
 * // logic.color: string (hex)
 * // logic.onSelectColor: (res) => void
 * ```
 *
 * @see
 * - ColorPicker.style.web.ts for styling
 * - ColorPicker.web.tsx for component rendering
 */

import { useMemo, useState, useCallback } from 'react';
import ColorPickerMeta from './ColorPicker.meta.yaml';

/**
 * Properties for the ColorPicker component.
 */
export interface ColorPickerProps {
  /**
   * Callback fired when a color is selected.
   * @param color The hex representation of the selected color.
   */
  onChange?: (color: string) => void;
  /**
   * Currently selected color in hex format.
   * @default "#FF0000"
   */
  value?: string;
  /** Additional style to apply to the container. */
  style?: React.CSSProperties;
  [key: string]: any;
}

export function useColorPickerLogic(props: ColorPickerProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (ColorPickerMeta?.props) {
      ColorPickerMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props } as ColorPickerProps;
  const { onChange, value = '#FF0000', ...rest } = merged;

  const [color, setColor] = useState<string>(value);

  const onSelectColor = useCallback((res: { hex: string }) => {
    setColor(res.hex);
    onChange?.(res.hex);
  }, [onChange]);

  return { onSelectColor, color, rest };
}
