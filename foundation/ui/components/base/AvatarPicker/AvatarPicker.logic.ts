import { useMemo, useCallback } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AvatarPickerMeta from './AvatarPicker.meta.yaml';

/**
 * Properties for the AvatarPicker component.
 */
export interface AvatarPickerProps {
  /** 
   * Callback fired when an avatar is selected or uploaded.
   * @param uri The URI of the selected image.
   */
  onChange?: (uri: string) => void;
  /** 
   * Currently selected avatar URI.
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
 * Custom hook to handle the logic for the AvatarPicker component.
 * @param props The properties passed to the AvatarPicker component.
 * @returns An object containing the processed logic and state for the component.
 */
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

  const pickImage = useCallback(async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (onChange) {
        onChange(result.assets[0].uri);
      }
    }
  }, [onChange]);

  const selectAvatar = useCallback((uri: string) => {
    if (onChange) {
      onChange(uri);
    }
  }, [onChange]);

  return { value, pickImage, selectAvatar, defaultAvatars, rest };
}
