/**
 * AvatarPicker Logic - Web Variant
 *
 * @description
 * Logic hook for avatar picker with file upload and preset selection.
 * Manages avatar state and provides image picking capabilities.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Uses browser's native HTML file input instead of React Native image picker.
 * Creates object URLs for selected files using File API.
 * Provides both file upload and preset avatar selection methods.
 * Integrates with YAML metadata for default values.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Uses HTML File input (not visible, triggered programmatically)
 * - Object URLs created from File objects for preview
 * - Preset avatars loaded from external avatar service
 * - Pure logic layer with no rendering concerns
 *
 * @example
 * ```typescript
 * const logic = useAvatarPickerLogic({
 *   value: currentAvatar,
 *   onChange: setAvatar,
 * });
 * // logic.value: string (URI)
 * // logic.pickImage: () => void (opens file picker)
 * // logic.selectAvatar: (uri) => void (selects preset)
 * // logic.defaultAvatars: string[] (preset URLs)
 * ```
 *
 * @see
 * - AvatarPicker.style.web.ts for styling
 * - AvatarPicker.web.tsx for component rendering
 */

import { useMemo, useCallback } from 'react';
import AvatarPickerMeta from './AvatarPicker.meta.yaml';

/**
 * Properties for the AvatarPicker component.
 */
export interface AvatarPickerProps {
  /**
   * Callback fired when an avatar is selected or uploaded.
   * @param uri The data-URL or object-URL of the selected image.
   */
  onChange?: (uri: string) => void;
  /** Currently selected avatar URI. */
  value?: string;
  /** Additional style to apply to the container. */
  style?: React.CSSProperties;
  [key: string]: any;
}

export function useAvatarPickerLogic(props: AvatarPickerProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (AvatarPickerMeta?.props) {
      AvatarPickerMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props } as AvatarPickerProps;
  const { onChange, value, ...rest } = merged;

  const defaultAvatars = useMemo(() => [
    'https://i.pravatar.cc/150?img=11',
    'https://i.pravatar.cc/150?img=32',
    'https://i.pravatar.cc/150?img=33',
    'https://i.pravatar.cc/150?img=44',
    'https://i.pravatar.cc/150?img=47',
    'https://i.pravatar.cc/150?img=68',
  ], []);

  /**
   * Opens a hidden file input to let the user pick an image from disk.
   */
  const pickImage = useCallback(() => {
    if (typeof document === 'undefined') return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const objectUrl = URL.createObjectURL(file);
      onChange?.(objectUrl);
    };

    input.click();
  }, [onChange]);

  const selectAvatar = useCallback((uri: string) => {
    onChange?.(uri);
  }, [onChange]);

  return { value, pickImage, selectAvatar, defaultAvatars, rest };
}
