import { useMemo } from 'react';
import IconButtonMeta from './IconButton.meta.yaml';

/**
 * Props for the IconButton component.
 */
export interface IconButtonProps {
  /**
   * The name of the icon to display, corresponding to a `lucide-react-native` component.
   */
  icon: string;
  /**
   * Callback executed when the button is pressed.
   */
  onPress?: () => void;
  /**
   * The size of the icon in pixels. The button container will scale accordingly.
   */
  size?: number;
  /**
   * Disables the button, applying a visual opacity and preventing interaction.
   */
  disabled?: boolean;
  /**
   * Visual variant of the button:
   * - 'default': Solid background with primary theme colors.
   * - 'ghost': Transparent background.
   * - 'outline': Transparent background with a border.
   */
  variant?: 'default' | 'ghost' | 'outline';
  /**
   * Additional props to pass down to the wrapping Pressable component.
   */
  [key: string]: any;
}

export function useIconButtonLogic(props: IconButtonProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (IconButtonMeta?.props) {
      IconButtonMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { icon, onPress, size, disabled, variant, ...rest } = merged;

  return { icon, onPress, size, disabled, variant, rest };
}
