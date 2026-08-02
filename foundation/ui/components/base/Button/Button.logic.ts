import { useMemo } from 'react';
import ButtonMeta from './Button.meta.yaml';

/**
 * Properties for the Button component.
 */
export interface ButtonProps {
  /**
   * The text label to display inside the button.
   */
  label?: string;
  /**
   * Callback function executed when the button is pressed.
   */
  onPress?: () => void;
  /**
   * Whether the button is disabled. If true, interactions are ignored and the visual state is adjusted.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the button is in a loading state. If true, an ActivityIndicator is shown and interactions are disabled.
   * @default false
   */
  loading?: boolean;
  /**
   * The visual style variant of the button.
   * Determines background and text colors.
   * @default 'default'
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /**
   * The size of the button, affecting padding, height, and width (for icon size).
   * @default 'default'
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /**
   * Additional properties to pass down to the underlying Pressable.
   */
  [key: string]: any;
}

export function useButtonLogic(props: ButtonProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (ButtonMeta?.props) {
      ButtonMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { label, onPress, disabled, loading, variant, size, ...rest } = merged;

  return { label, onPress, disabled: disabled || loading, loading, variant, size, rest };
}
