import { useMemo, useState, useCallback } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
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
  /**
   * Additional style to apply to the container.
   */
  style?: StyleProp<ViewStyle>;
  /** 
   * Any other properties to pass to the container view.
   */
  [key: string]: any;
}

/**
 * Custom hook to handle the logic for the ColorPicker component.
 * @param props The properties passed to the ColorPicker component.
 * @returns An object containing the processed logic and state for the component.
 */
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
    if (onChange) {
      onChange(res.hex);
    }
  }, [onChange]);

  return { onSelectColor, color, rest };
}
